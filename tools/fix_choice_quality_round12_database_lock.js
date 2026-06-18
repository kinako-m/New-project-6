const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "複数の利用者が同じデータを同時更新して矛盾が起きるのを防ぐ仕組みはどれか。": {
    distractors: [
      "コミット",
      "ロールバック",
      "チェックポイント",
      "ログ退避",
      "バックアップ取得",
      "索引作成"
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
