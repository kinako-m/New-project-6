const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const findings = [];

function check(label, pattern, source) {
  if (!pattern.test(source)) findings.push({ type: "responsive-contract-missing", label });
}

check("device-width viewport", /<meta\s+name="viewport"\s+content="width=device-width,\s*initial-scale=1\.0"/, html);
check("tablet breakpoint", /@media\s*\(max-width:\s*700px\)/, css);
check("phone breakpoint", /@media\s*\(max-width:\s*480px\)/, css);
check("shell keeps phone gutters", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.app-shell\s*\{[\s\S]*?width:\s*min\(100%\s*-\s*12px,\s*1120px\)/, css);
check("phone actions become full width", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.quiz-actions button,[\s\S]*?width:\s*100%/, css);
check("phone exam toolbar uses one column", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.exam-toolbar\s*\{[\s\S]*?grid-template-columns:\s*1fr/, css);
check("phone navigator uses stable five columns", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.exam-question-grid\s*\{[\s\S]*?repeat\(5,\s*minmax\(0,\s*1fr\)\)/, css);
check("navigator targets are at least 42px", /\.exam-question-jump\s*\{[\s\S]*?min-height:\s*44px|@media\s*\(max-width:\s*480px\)[\s\S]*?\.exam-question-jump\s*\{[\s\S]*?min-height:\s*42px/, css);
check("answer targets are at least 48px", /body\[data-view="quiz"\]\s+\.choice\s*\{[\s\S]*?min-height:\s*48px/, css);
check("answer text can shrink", /\.choice\s*\{[\s\S]*?minmax\(0,\s*1fr\)/, css);
check("answer text wraps", /\.choice\s*\{[\s\S]*?overflow-wrap:\s*anywhere/, css);
check("question text wraps", /\.question-card h2\s*\{[\s\S]*?overflow-wrap:\s*anywhere/, css);
check("quiz creature keeps flexible speech width", /\.quiz-creature-companion\s*\{[\s\S]*?minmax\(0,\s*1fr\)/, css);
check("reduced motion supported", /@media\s*\(prefers-reduced-motion:\s*reduce\)/, css);
check("phone rank controls use touch targets", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.battle-rank-control button,[\s\S]*?min-height:\s*44px/, css);
check("phone stage start uses touch target", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.stage-start-button[\s\S]*?min-height:\s*44px/, css);
check("phone battle result actions stack", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.battle-result-actions[\s\S]*?flex-direction:\s*column/, css);
check("phone enemy dex uses one column", /@media\s*\(max-width:\s*480px\)[\s\S]*?\.enemy-dex-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr/, css);
check("settings dialog stays within viewport", /\.settings-dialog\s*\{[\s\S]*?width:\s*min\(420px,\s*calc\(100vw\s*-\s*28px\)\)/, css);
check("battle support can wrap", /\.battle-support-status\s*\{[\s\S]*?flex-wrap:\s*wrap/, css);

const report = {
  generatedAt: new Date().toISOString(),
  assertionCount: 20,
  findingCount: findings.length,
  findings
};

fs.writeFileSync("tools/responsive-layout-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
if (findings.length) process.exitCode = 1;
