const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outDir = path.join(root, "docs");

const files = [
  "index.html",
  "styles.css",
  "app.js",
  "improvement-questions.js",
  "subject-b-case-questions.js",
  "subject-b-case-questions-2.js",
  "sample-derived-questions.js",
  "question-choice-sets.js",
  "manifest.webmanifest",
  "service-worker.js",
  "qa-checklist.html",
  "qa-checklist.css",
  "qa-checklist.js"
];

function removeDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(outDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDir(sourceRelative, targetRelative = sourceRelative) {
  const source = path.join(root, sourceRelative);
  const target = path.join(outDir, targetRelative);
  fs.cpSync(source, target, {
    recursive: true,
    filter: (item) => path.basename(item) !== "original-backgrounds" && !item.includes(`${path.sep}original-backgrounds${path.sep}`)
  });
}

removeDir(outDir);
fs.mkdirSync(outDir, { recursive: true });
files.forEach(copyFile);
copyDir("assets");
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

const copiedFiles = [];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else copiedFiles.push(path.relative(outDir, fullPath).replace(/\\/g, "/"));
  }
}
collect(outDir);

console.log(JSON.stringify({
  outDir,
  files: copiedFiles.length,
  includesSampleQ: copiedFiles.some((file) => file.startsWith("sample_q/")),
  includesTools: copiedFiles.some((file) => file.startsWith("tools/")),
  includesOriginalBackgrounds: copiedFiles.some((file) => file.includes("original-backgrounds/"))
}, null, 2));
