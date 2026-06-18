const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "社外から社内システムへ安全に接続するために使う技術として適切なものはどれか。": {
    distractors: [
      "WAF",
      "IDS",
      "IPS",
      "ファイアウォール",
      "プロキシ",
      "リバースプロキシ"
    ]
  },
  "「Webアプリケーションへの攻撃を検知・防御する仕組み」に該当する用語はどれか。": {
    distractors: [
      "IDS",
      "IPS",
      "ファイアウォール",
      "プロキシ",
      "SIEM",
      "EDR"
    ]
  },
  "「入力値にSQLの断片を混入して不正操作する攻撃」に該当する用語はどれか。": {
    distractors: [
      "クロスサイトスクリプティング",
      "CSRF",
      "OSコマンドインジェクション",
      "ディレクトリトラバーサル",
      "セッションハイジャック",
      "ブルートフォース攻撃"
    ]
  },
  "Webアプリケーションへの攻撃を検知・防御する仕組みはどれか。": {
    distractors: [
      "IDS",
      "IPS",
      "ファイアウォール",
      "プロキシ",
      "SIEM",
      "EDR"
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
