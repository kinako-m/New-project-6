const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "二分探索木で、左部分木に置かれる値として一般に適切なものはどれか。": {
    distractors: [
      "親ノードより大きい値",
      "親ノードと同じ値だけ",
      "根ノードより必ず大きい値",
      "葉ノードだけに置く値",
      "挿入順が最も新しい値",
      "ハッシュ値が同じ値"
    ]
  },
  "社員表から部署が'営業'の行だけを取り出す条件指定に使う句はどれか。": {
    distractors: [
      "HAVING",
      "GROUP BY",
      "ORDER BY",
      "SELECT",
      "FROM",
      "JOIN"
    ]
  },
  "x=7のとき、xが10以上ならA、5以上ならB、それ以外ならCを出力する。結果はどれか。": {
    distractors: [
      "A",
      "C",
      "D",
      "AB",
      "出力なし",
      "エラー"
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
