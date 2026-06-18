const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "ACID特性の A が表すものはどれか。": {
    distractors: [
      "Consistency",
      "Isolation",
      "Durability",
      "Availability",
      "Authentication",
      "Authorization"
    ]
  },
  "複数の利用者が同じデータを同時更新して矛盾が起きるのを防ぐ仕組みはどれか。": {
    distractors: [
      "COMMIT",
      "ROLLBACK",
      "共有ロック",
      "専有ロック",
      "デッドロック",
      "ダーティリード"
    ]
  },
  "ER図でエンティティ間の関連を表すものはどれか。": {
    distractors: [
      "エンティティ",
      "属性",
      "主キー",
      "外部キー",
      "カーディナリティ",
      "正規化"
    ]
  },
  "ER図の説明として最も適切なものはどれか。": {
    distractors: [
      "表の行を条件で絞り込む操作を表す図",
      "処理手順を時系列に並べて表す図",
      "画面遷移と利用者操作を表す図",
      "ネットワーク機器の接続関係だけを表す図",
      "プログラムの分岐条件だけを表す図",
      "障害対応の手順だけを表す図"
    ]
  },
  "カーディナリティの説明として最も適切なものはどれか。": {
    distractors: [
      "エンティティの属性名を表すもの",
      "表の主キーとなる列を表すもの",
      "表同士を結合するSQL句を表すもの",
      "トランザクションの確定処理を表すもの",
      "データの更新履歴を表すもの",
      "列の値の入力条件を表すもの"
    ]
  },
  "主キーに設定できない値はどれか。": {
    distractors: [
      "重複しない社員番号",
      "重複しない注文番号",
      "重複しない商品コード",
      "一意な顧客ID",
      "一意なメールアドレス",
      "一意な会員番号"
    ]
  },
  "トランザクションの途中で障害が起きた場合、更新を取り消す処理はどれか。": {
    distractors: [
      "コミット",
      "セーブポイント",
      "共有ロック",
      "専有ロック",
      "チェックポイント",
      "ロールフォワード"
    ]
  },
  "送金処理で口座Aの減額後に障害が起きた。口座Bの増額も含め処理全体を取り消すために必要な性質はどれか。": {
    distractors: [
      "一貫性",
      "独立性",
      "永続性",
      "可用性",
      "機密性",
      "完全性"
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
