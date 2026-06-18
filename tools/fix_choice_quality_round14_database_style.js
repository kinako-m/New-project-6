const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "障害発生時にデータベースを復旧するために重要なものはどれか。": [
    "バックアップのみ",
    "ログのみ",
    "本番データの削除",
    "復旧手順未作成",
    "復元確認なしのバックアップ",
    "上書きだけの更新履歴"
  ],
  "ログの説明として最も適切なものはどれか。": [
    "前回フルバックアップ以降の変更分だけを保存する方式です。",
    "前回バックアップ以降の変更分だけを保存する方式です。",
    "障害時に処理を切り戻すための予備サーバです。",
    "表の重複を減らすために分割する設計手法です。",
    "複数利用者の同時更新を制御する仕組みです。",
    "SQLの検索条件を指定する句です。"
  ],
  "共有ロックの説明として最も適切なものはどれか。": [
    "他トランザクションの参照や更新を制限するロックです。",
    "互いに相手のロック解放を待って処理が進まない状態です。",
    "未コミットの更新を他の処理が読んでしまうことです。",
    "更新内容を確定して永続化する処理です。",
    "未確定の更新を取り消す処理です。",
    "複数の表を共通列で結合する操作です。"
  ],
  "専有ロックの説明として最も適切なものはどれか。": [
    "他トランザクションの参照は許すが更新を制限するロックです。",
    "互いに相手のロック解放を待って処理が進まない状態です。",
    "未コミットの更新を他の処理が読んでしまうことです。",
    "更新内容を確定して永続化する処理です。",
    "未確定の更新を取り消す処理です。",
    "複数の表を共通列で結合する操作です。"
  ],
  "部署ごとの平均給与を求めるときに使う句の組合せとして適切なものはどれか。": [
    "WHERE + COUNT",
    "ORDER BY + MAX",
    "HAVING + DELETE",
    "JOIN + INSERT",
    "SELECT + ROLLBACK",
    "FROM + COMMIT"
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
