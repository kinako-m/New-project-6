const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "スタックのデータ取り出し方式を表すものはどれか。": {
    distractors: [
      "FIFO",
      "優先度順",
      "キー昇順",
      "ランダム順",
      "到着時刻の古い順",
      "ハッシュ値順"
    ]
  },
  "キューのデータ取り出し方式を表すものはどれか。": {
    distractors: [
      "LIFO",
      "優先度順",
      "キー昇順",
      "ランダム順",
      "到着時刻の新しい順",
      "ハッシュ値順"
    ]
  },
  "同じ計算を何度も行う再帰を高速化するため、計算済み結果を保存して再利用する考え方はどれか。": {
    distractors: [
      "各段階でその時点の最良候補だけを選ぶ貪欲法",
      "問題を小さな独立問題に分けて結果を統合する分割統治法",
      "条件を満たさない候補を途中で捨てるバックトラック",
      "隣接要素を比較して必要なら交換するバブルソート",
      "基準値で左右に分けて整列するクイックソート",
      "呼出し中の処理を後入れ先出しで管理するスタック利用"
    ]
  },
  "「計算済み結果を保存して再利用する考え方」に該当する用語はどれか。": {
    distractors: [
      "動的計画法",
      "分割統治法",
      "貪欲法",
      "バックトラック",
      "再帰",
      "全探索"
    ]
  },
  "「部分問題の結果を利用して全体の解を求める手法」に該当する用語はどれか。": {
    distractors: [
      "メモ化",
      "分割統治法",
      "貪欲法",
      "バックトラック",
      "再帰",
      "全探索"
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
