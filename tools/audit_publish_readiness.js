const fs = require("fs");
const path = require("path");

const rootArg = process.argv.find((arg) => arg.startsWith("--root="));
const root = rootArg ? path.resolve(process.cwd(), rootArg.slice("--root=".length)) : process.cwd();
const checkedFiles = ["index.html", "styles.css", "app.js", "service-worker.js", "manifest.webmanifest"];
const findings = [];
const refs = [];

function existsRelative(ref) {
  const clean = ref.replace(/^\.\//, "").split("?")[0].split("#")[0];
  if (!clean || clean === "." || clean === "/") return true;
  return fs.existsSync(path.join(root, clean));
}

function addRef(file, ref, kind) {
  if (!ref || ref.startsWith("data:") || /^https?:\/\//.test(ref)) return;
  if (ref.includes("${")) return;
  refs.push({ file, ref, kind });
  if (!existsRelative(ref)) findings.push({ type: "missing-local-reference", file, ref, kind });
}

for (const file of checkedFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of source.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
    addRef(file, match[1], "html-attribute");
  }
  for (const match of source.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    addRef(file, match[1], "css-url");
  }
  for (const match of source.matchAll(/assetUrl\(["']([^"']+)["']\)/g)) {
    addRef(file, match[1], "assetUrl");
  }
}

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const serviceWorkerSource = fs.readFileSync(path.join(root, "service-worker.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));

if (!/navigator\s*\.\s*serviceWorker\s*\.\s*register\s*\(\s*"\.\/service-worker\.js"(?:\s*,|\s*\))/.test(appSource)) {
  findings.push({ type: "service-worker-register-not-relative" });
}

if (manifest.start_url !== "./" || manifest.scope !== "./") {
  findings.push({ type: "manifest-scope-not-project-relative", start_url: manifest.start_url, scope: manifest.scope });
}

for (const icon of manifest.icons || []) {
  addRef("manifest.webmanifest", icon.src, "manifest-icon");
}

for (const external of [...indexSource.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/g)]) {
  findings.push({ type: "external-page-reference", file: "index.html", ref: external[1] });
}

for (const localOnly of [...[appSource, indexSource, serviceWorkerSource].join("\n").matchAll(/(?:localhost|127\.0\.0\.1|file:\/\/|C:\\)/g)]) {
  findings.push({ type: "local-only-reference", value: localOnly[0] });
}

const requiredTodayReviewIds = [
  "homeTodayReview",
  "startHomeTodayReview",
  "todayReview",
  "startTodayReview"
];

for (const id of requiredTodayReviewIds) {
  if (!indexSource.includes(`id="${id}"`)) {
    findings.push({ type: "missing-today-review-dom", id });
  }
  if (!appSource.includes(`querySelector("#${id}")`)) {
    findings.push({ type: "missing-today-review-selector", id });
  }
}

const todayReviewExpectations = [
  ["homeTodayReview", /renderTodayReviewList\s*\(\s*els\.homeTodayReview\s*,\s*els\.startHomeTodayReview\s*,\s*5\s*\)/],
  ["todayReview", /renderTodayReviewList\s*\(\s*els\.todayReview\s*,\s*els\.startTodayReview\s*,\s*5\s*\)/],
  ["startHomeTodayReview", /els\.startHomeTodayReview\.addEventListener\s*\(\s*"click"/],
  ["startTodayReview", /els\.startTodayReview\.addEventListener\s*\(\s*"click"/]
];

for (const [id, pattern] of todayReviewExpectations) {
  if (!pattern.test(appSource)) {
    findings.push({ type: "missing-today-review-wiring", id });
  }
}

const examNavigatorExpectations = [
  ["examNavigatorFilters", indexSource.includes('id="examNavigatorFilters"')],
  ["exam-filter-all", indexSource.includes('data-exam-filter="all"')],
  ["exam-filter-unanswered", indexSource.includes('data-exam-filter="unanswered"')],
  ["exam-filter-review", indexSource.includes('data-exam-filter="review"')],
  ["examNavigatorFilters-selector", appSource.includes('querySelector("#examNavigatorFilters")')],
  ["examNavigatorFilters-listener", /els\.examNavigatorFilters\.addEventListener\s*\(\s*"click"/.test(appSource)],
  ["examNavigatorFilter-state", appSource.includes("examNavigatorFilter")],
  ["examNavigatorFilter-match", appSource.includes("matchesExamNavigatorFilter")]
];

for (const [id, ok] of examNavigatorExpectations) {
  if (!ok) findings.push({ type: "missing-exam-navigator-filter-wiring", id });
}

const appShell = [...serviceWorkerSource.matchAll(/"(\.\/[^"]+)"/g)].map((match) => match[1]);
const appShellMissing = appShell.filter((ref) => !existsRelative(ref));
if (appShellMissing.length) findings.push({ type: "missing-service-worker-app-shell", refs: appShellMissing });

const runtimeAssetRefs = refs
  .filter((item) => item.ref.startsWith("assets/") || item.ref.startsWith("./assets/"))
  .map((item) => item.ref.replace(/^\.\//, ""));
const appShellAssetRefs = new Set(appShell.map((item) => item.replace(/^\.\//, "").split("?")[0]));
const runtimeAssetsNotPrecached = [...new Set(runtimeAssetRefs)].filter((ref) => !appShellAssetRefs.has(ref));

const report = {
  generatedAt: new Date().toISOString(),
  checkedFiles,
  referenceCount: refs.length,
  runtimeAssetReferences: runtimeAssetRefs.length,
  runtimeAssetsNotPrecached,
  findingCount: findings.length,
  findings
};

fs.writeFileSync(path.join(process.cwd(), "tools/publish-readiness-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  referenceCount: report.referenceCount,
  runtimeAssetReferences: report.runtimeAssetReferences,
  runtimeAssetsNotPrecached: report.runtimeAssetsNotPrecached.length,
  findingCount: report.findingCount,
  findings: report.findings
}, null, 2));

if (findings.length) process.exit(1);
