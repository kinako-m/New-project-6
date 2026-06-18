const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "詳細設計で主に行うことはどれか。": [
    "利用者が必要とする機能や制約を明確にする",
    "外部仕様や画面だけを設計する",
    "本番障害を早期復旧する",
    "修正後に既存機能への影響を確認する",
    "運用中のログを削除する",
    "受入基準だけを決定する"
  ],
  "フェールセーフの説明はどれか。": [
    "故障しても機能を継続する考え方",
    "操作ミスが起きにくいようにする考え方",
    "負荷を複数装置へ分散する考え方",
    "障害時に待機系へ自動切替する仕組み",
    "故障時に危険な状態のまま動作させる考え方",
    "可用性を数値で測定する考え方"
  ],
  "フェールオーバを見分ける特徴として最も適切なものはどれか。": [
    "安全側へ停止する",
    "最低限の機能を継続する",
    "操作ミスを防ぐ",
    "複数装置へ負荷を分散する",
    "障害の根本原因を分析する",
    "変更の影響を評価して承認する"
  ],
  "結合テストで多数のインタフェース不具合が発生した。上流で強化すべき活動はどれか。": [
    "単体テストだけを省略する",
    "受入テストを省略する",
    "障害ログを削除する",
    "インタフェース仕様の確認を行わない",
    "結合条件を文書化しない",
    "設計書をレビューせず実装へ進む"
  ]
};

const changed = [];
for (const [text, distractors] of Object.entries(updates)) {
  const definition = choiceSets[text];
  if (!definition) throw new Error(`Question not found: ${text}`);
  definition.distractors = distractors;
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
