const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const testTerms = ["レビュー", "単体テスト", "結合テスト", "受入テスト", "リグレッションテスト", "システムテスト", "性能テスト", "ホワイトボックステスト"];
const testDescriptions = [
  "成果物を人が確認して欠陥を早期発見する活動です。",
  "個々の部品や関数が正しく動くか確認するテストです。",
  "複数部品を組み合わせた動作を確認するテストです。",
  "利用者要求を満たすか確認するテストです。",
  "修正で既存機能に悪影響がないか確認するテストです。",
  "システム全体が要求どおり動作するか確認するテストです。",
  "応答時間や処理能力などを確認するテストです。",
  "プログラム内部の分岐や経路を確認するテストです。"
];
const testFeatures = [
  "人が成果物を確認する",
  "部品単位で確認する",
  "部品間の連携を確認する",
  "利用者視点で確認する",
  "修正の副作用を確認する",
  "システム全体を確認する",
  "応答時間や処理能力を確認する",
  "内部の分岐や経路を確認する"
];

const explicit = [
  ["公開鍵暗号方式で、受信者だけが読めるように送信者が使う鍵はどれか。", [
    "送信者の公開鍵", "認証局の秘密鍵", "認証局の公開鍵"
  ]],
  ["ハッシュ関数に求められる性質として適切なものはどれか。", [
    "異なる入力から同じハッシュ値が頻繁に得られる",
    "入力データより常に長い値を返す",
    "秘密鍵がなければハッシュ値を計算できない"
  ]],
  ["「Webアプリケーションへの攻撃を検知・防御する仕組み」に該当する用語はどれか。", [
    "IDS", "IPS", "ファイアウォール", "VPN", "認証局", "多要素認証"
  ]],
  ["WAFを見分ける特徴として最も適切なものはどれか。", [
    "不正侵入の兆候を検知して通知する",
    "不正な通信を検知して自動遮断する",
    "通信の許可や拒否をルールで制御する",
    "通信内容を暗号化する",
    "利用者を複数要素で認証する",
    "公開鍵証明書を発行する"
  ]],
  ["「入力値にSQLの断片を混入して不正操作する攻撃」に該当する用語はどれか。", [
    "クロスサイトスクリプティング", "CSRF", "ブルートフォース攻撃",
    "辞書攻撃", "フィッシング", "DoS攻撃"
  ]],
  ["SQLインジェクションを見分ける特徴として最も適切なものはどれか。", [
    "スクリプトをWebページへ埋め込む",
    "ログイン済み利用者へ意図しない要求を送る",
    "パスワード候補を総当たりで試す",
    "偽サイトへ誘導して認証情報を盗む",
    "大量の通信でサービスを停止させる",
    "通信内容を盗聴する"
  ]]
];

function normalize(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function fillFromPool(definition, pool) {
  const existing = new Set([definition.correct, ...definition.distractors].map(normalize));
  const additions = pool.filter((candidate) => !existing.has(normalize(candidate)));
  definition.distractors = [...definition.distractors, ...additions].slice(0, 6);
  if (definition.distractors.length !== 6) throw new Error(`Could not fill choices for ${definition.correct}`);
}

const changed = [];
for (const [prefix, pool] of explicit) {
  const matches = Object.keys(choiceSets).filter((text) => text.startsWith(prefix));
  if (matches.length !== 1) throw new Error(`Expected one match for "${prefix}", found ${matches.length}.`);
  fillFromPool(choiceSets[matches[0]], pool);
  changed.push(matches[0]);
}

for (const [text, definition] of Object.entries(choiceSets)) {
  if (definition.stageId !== "management" || definition.tag !== "\u30c6\u30b9\u30c8" || definition.distractors.length >= 6) continue;
  if (/^\u300c/.test(text)) fillFromPool(definition, testTerms);
  else if (/\u8aac\u660e\u3068\u3057\u3066/.test(text)) fillFromPool(definition, testDescriptions);
  else if (/\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) fillFromPool(definition, testFeatures);
  else throw new Error(`Unknown test question format: ${text}`);
  changed.push(text);
}

const output = `// Generated and maintained as the source of truth for per-question choices.
// Edit the correct answer, distractors, and optional choiceNotes for each question here.
// Add at least three distractors. Six or more allows varied choices between challenges.
globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};

if (typeof module !== "undefined") module.exports = globalThis.QUESTION_CHOICE_SETS;
`;

if (process.argv.includes("--write")) fs.writeFileSync("question-choice-sets.js", output);
console.log(JSON.stringify({ mode: process.argv.includes("--write") ? "write" : "dry-run", changed: changed.length }, null, 2));
