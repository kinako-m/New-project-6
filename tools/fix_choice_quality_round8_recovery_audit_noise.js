const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "企業活動の継続能力を高めるための計画はどれか。": {
    distractors: [
      "DRP",
      "BCM",
      "ISMS",
      "CSIRT",
      "危機管理計画",
      "復旧手順書"
    ]
  },
  "毎日0時にバックアップを取得する。障害が18時に起きた場合、最大18時間分の更新が失われ得る。この指標はどれか。": {
    distractors: [
      "目標復旧時間",
      "平均復旧時間",
      "平均故障間隔",
      "バックアップ取得時間",
      "サービス稼働率",
      "復旧手順の所要時間"
    ]
  },
  "「サービス提供者と利用者が合意したサービス水準」に該当する用語はどれか。": {
    distractors: [
      "OLA",
      "UC",
      "KPI",
      "KGI",
      "BCM",
      "サービスカタログ"
    ]
  }
};

const changed = [];
for (const [text, update] of Object.entries(updates)) {
  const definition = choiceSets[text];
  if (!definition) throw new Error(`Question not found: ${text}`);
  definition.distractors = update.distractors;
  changed.push(text);
}

const output = `// Generated and maintained as the source of truth for per-question choices.
// Edit the correct answer, distractors, and optional choiceNotes for each question here.
// Add at least three distractors. Six or more allows varied choices between challenges.
globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};

if (typeof module !== "undefined") module.exports = globalThis.QUESTION_CHOICE_SETS;
`;

if (process.argv.includes("--write")) fs.writeFileSync("question-choice-sets.js", output);
console.log(JSON.stringify({
  mode: process.argv.includes("--write") ? "write" : "dry-run",
  changed: changed.length,
  questions: changed
}, null, 2));
