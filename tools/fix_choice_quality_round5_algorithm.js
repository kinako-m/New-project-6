const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "スタックを見分ける特徴として最も適切なものはどれか。": {
    correct: "最後に追加した要素を最初に取り出す",
    distractors: [
      "最初に追加した要素を最初に取り出す",
      "優先度が高い要素から取り出す",
      "参照で要素同士をつないで管理する",
      "節点が最大二つの子を持つ構造で管理する",
      "最大値や最小値を効率よく取り出す",
      "添字で任意の要素に直接アクセスする"
    ]
  },
  "キューを見分ける特徴として最も適切なものはどれか。": {
    correct: "最初に追加した要素を最初に取り出す",
    distractors: [
      "最後に追加した要素を最初に取り出す",
      "優先度が高い要素から取り出す",
      "参照で要素同士をつないで管理する",
      "節点が最大二つの子を持つ構造で管理する",
      "最大値や最小値を効率よく取り出す",
      "添字で任意の要素に直接アクセスする"
    ]
  },
  "否定の説明として最も適切なものはどれか。": {
    correct: "条件の真偽を反転させる論理演算",
    distractors: [
      "二つの条件が両方真のときだけ真になる論理演算",
      "二つの条件の少なくとも一方が真なら真になる論理演算",
      "二つの条件が異なるときだけ真になる論理演算"
    ]
  },
  "バブルソートを見分ける特徴として最も適切なものはどれか。": {
    correct: "隣り合う要素を比較し、必要に応じて交換する",
    distractors: [
      "未整列部分から最小値を選んで先頭へ配置する",
      "整列済み部分の適切な位置へ要素を挿入する",
      "基準値を選び、左右の部分列へ分割する",
      "部分列に分割し、整列済みの列を併合する",
      "ヒープから最大値または最小値を順に取り出す",
      "間隔を縮めながら離れた要素を比較する"
    ]
  },
  "選択ソートを見分ける特徴として最も適切なものはどれか。": {
    correct: "未整列部分から最小値を選んで先頭へ配置する",
    distractors: [
      "整列済み部分の適切な位置へ要素を挿入する",
      "基準値を選び、左右の部分列へ分割する",
      "部分列に分割し、整列済みの列を併合する",
      "隣り合う要素を比較し、必要に応じて交換する",
      "ヒープから最大値または最小値を順に取り出す",
      "間隔を縮めながら離れた要素を比較する"
    ]
  },
  "挿入ソートを見分ける特徴として最も適切なものはどれか。": {
    correct: "整列済み部分の適切な位置へ要素を挿入する",
    distractors: [
      "基準値を選び、左右の部分列へ分割する",
      "部分列に分割し、整列済みの列を併合する",
      "隣り合う要素を比較し、必要に応じて交換する",
      "未整列部分から最小値を選んで先頭へ配置する",
      "ヒープから最大値または最小値を順に取り出す",
      "間隔を縮めながら離れた要素を比較する"
    ]
  },
  "クイックソートを見分ける特徴として最も適切なものはどれか。": {
    correct: "基準値を選び、左右の部分列へ分割する",
    distractors: [
      "部分列に分割し、整列済みの列を併合する",
      "隣り合う要素を比較し、必要に応じて交換する",
      "未整列部分から最小値を選んで先頭へ配置する",
      "整列済み部分の適切な位置へ要素を挿入する",
      "ヒープから最大値または最小値を順に取り出す",
      "間隔を縮めながら離れた要素を比較する"
    ]
  },
  "マージソートを見分ける特徴として最も適切なものはどれか。": {
    correct: "部分列に分割し、整列済みの列を併合する",
    distractors: [
      "隣り合う要素を比較し、必要に応じて交換する",
      "未整列部分から最小値を選んで先頭へ配置する",
      "整列済み部分の適切な位置へ要素を挿入する",
      "基準値を選び、左右の部分列へ分割する",
      "ヒープから最大値または最小値を順に取り出す",
      "間隔を縮めながら離れた要素を比較する"
    ]
  },
  "メモ化を見分ける特徴として最も適切なものはどれか。": {
    correct: "同じ計算の結果を保存して再利用する",
    distractors: [
      "各段階でその時点の最良候補だけを選択する",
      "最後に入れたデータから先に取り出す",
      "先に入れたデータから先に取り出す",
      "関数が自分自身を呼び出して処理する",
      "問題を独立した小問題へ分割して結果を統合する",
      "候補を試し、条件に合わなければ直前の状態へ戻る"
    ]
  },
  "動的計画法を見分ける特徴として最も適切なものはどれか。": {
    correct: "部分問題の結果を保存し、全体の解に利用する",
    distractors: [
      "各段階でその時点の最良候補だけを選択する",
      "問題を独立した小問題へ分割して結果を統合する",
      "候補を試し、条件に合わなければ直前の状態へ戻る",
      "関数が自分自身を呼び出して処理する",
      "最後に入れたデータから先に取り出す",
      "先に入れたデータから先に取り出す"
    ]
  },
  "探索範囲を毎回半分にする処理で、要素数が2倍になったとき比較回数は概ねどうなるか。": {
    correct: "およそ1回増える",
    distractors: [
      "およそ2倍になる",
      "およそ半分になる",
      "ほとんど変わらない",
      "およそ4倍になる",
      "要素数と同じだけ増える",
      "必ず0回になる"
    ]
  },
  "次の処理は、行列の各行の合計が最大となる行番号を求める。行番号は1から始まる。\n\n行列 = [[2, 4, 1], [5, 1, 3], [3, 3, 2]]\n各行の合計を求め、これまでの最大値より大きい場合だけ行番号を更新する。\n\n最終的な行番号はどれか。": {
    distractors: ["1", "3", "0", "4", "5", "6"]
  },
  "次の処理は、文字列を左から読み、数字の文字だけを順に連結する。\n\n入力文字列 = A1B23C4\n数字ならresultの末尾へ追加し、それ以外は何もしない。\n\n処理終了時のresultはどれか。": {
    distractors: ["123", "1243", "1324", "4321", "46", "10"]
  }
};

const changed = [];
for (const [text, update] of Object.entries(updates)) {
  const definition = choiceSets[text];
  if (!definition) throw new Error(`Question not found: ${text}`);
  if (update.correct) definition.correct = update.correct;
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
