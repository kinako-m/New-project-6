const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const additions = [
  ["次の手続countChangeは、隣り合う要素の値が変化した回数を返す。", ["1", "5", "7"]],
  ["次の処理は、文字列中で同じ文字が連続する最大回数を求める。", ["1", "5", "7"]],
  ["利用者のパスワードをデータベースへ保存する方式を見直す。", [
    "全利用者に同じソルトを付けて高速なハッシュ関数で保存する",
    "パスワードをBase64で符号化して保存する",
    "パスワードを可逆暗号で保存し、復号鍵を同じDBへ保存する"
  ]],
  ["次の関数gを考える。", ["8と6回", "6と5回", "10と4回"]],
  ["社内Webシステムの検索欄へ入力した文字列が、そのまま検索結果画面のHTMLへ出力される。", [
    "入力値をSQLのプレースホルダへ渡すだけにする",
    "通信をTLS化するだけにする",
    "スクリプトという文字列だけを入力禁止にする"
  ]],
  ["Webアプリケーションが、利用者の入力を文字列連結してSQL文へ組み込んでいる。", [
    "入力値から空白文字だけを削除して文字列連結を続ける",
    "通信をTLS化して文字列連結を続ける",
    "SQL文を実行する前にHTMLエスケープする"
  ]],
  ["次の処理は、配列dataからしきい値以上の値だけをresultへ追加する。", [
    "[12, 7, 18, 5, 10]",
    "[18, 10]",
    "[10, 12, 18]"
  ]],
  ["次の処理は、在庫数stockから注文数ordersを順に引き当てる。", ["-1", "7", "10"]],
  ["次の処理は、行列の各行の合計が最大となる行番号を求める。", ["0", "4", "1行目と3行目の同率"]],
  ["次の処理は、整数nが素数かを判定する。", ["1", "4", "割り切れる値はない"]],
  ["次の処理は、文字列を左から読み、数字の文字だけを順に連結する。", ["1、2、3、4", "123", "46"]],
  ["次の処理は、重複を除いて値を出力する。", ["1、3、2", "3、1", "3、1、2、1"]],
  ["次の処理は、二次元配列の主対角線上の値を合計する。", ["11", "16", "45"]],
  ["次の処理は、循環配列の次の位置を求める。", ["-1", "3", "位置は存在しない"]],
  ["通販サイトで、同一IPアドレスから多数の利用者IDに対するログイン失敗が短時間に発生した。", [
    "該当IPだけを永久遮断し、成功したアカウントは調査しない",
    "ログイン画面を一時的に非表示にし、関連ログは保存しない",
    "成功した利用者へ通知せずパスワードをそのまま利用させる"
  ]],
  ["5個の要素を線形探索し、目的値が最後にある場合、比較回数は最大何回か。", ["2回", "4回", "6回"]],
  ["線形探索で目的値が配列の先頭にある場合、比較回数はどれか。", ["3回", "配列の要素数と同じ回数", "比較は不要"]],
  ["再帰呼出しで終了条件を書き忘れたときに起こりやすい問題はどれか。", [
    "終了条件がなくても処理系が自動的に安全な位置で停止する",
    "再帰の戻り値が自動的に0へ補正される",
    "コンパイラが必ず終了条件を追加する"
  ]],
  ["二分探索を使う前提として最も重要なものはどれか。", [
    "探索対象が配列の末尾に存在する",
    "全要素が互いに異なる",
    "探索対象の要素数が偶数である"
  ]],
  ["昇順配列[3, 8, 12, 17, 25, 31, 40]から二分探索で25を探す。", ["3", "8", "40"]],
  ["次の再帰関数fを考える。", ["7", "11", "15"]],
  ["次の処理で、訪問済みでない頂点をキューへ追加する幅優先探索を行う。", ["C、B", "D、F", "E、F"]],
  ["次の処理は、売上配列から3日間の移動平均を求める。", ["20", "50", "120"]],
  ["次の処理は、スタックを使って括弧の対応を確認する。", [
    "不正。終了時にスタックへ左括弧が二つ残る",
    "不正。途中で右括弧を二回連続して処理する",
    "正しい。ただし終了時にスタックへ左括弧が一つ残る"
  ]],
  ["次の処理で配列を1回走査する。", ["0", "5", "7"]],
  ["次の処理は、商品コードごとの個数を連想配列countへ記録する。", ["1と2", "3と3", "2と1"]],
  ["次の処理は、整列済み配列へ値を挿入する位置を探す。", [
    "[4, 9, 15, 12, 22]",
    "[4, 9, 12, 22, 15]",
    "[4, 9, 15, 12]"
  ]],
  ["次の処理は、状態に応じてイベントを処理する。", ["開始前", "エラー", "一時停止のまま終了"]]
];

const expanded = [];
for (const [prefix, extraDistractors] of additions) {
  const matches = Object.keys(choiceSets).filter((text) => text.startsWith(prefix));
  if (matches.length !== 1) {
    throw new Error(`Expected one question for prefix "${prefix}", found ${matches.length}.`);
  }
  const text = matches[0];
  const definition = choiceSets[text];
  definition.distractors = [...new Set([...definition.distractors, ...extraDistractors])]
    .filter((choice) => choice !== definition.correct);
  expanded.push({ text, distractors: definition.distractors.length });
}

const output = `// Generated and maintained as the source of truth for per-question choices.
// Edit the correct answer, distractors, and optional choiceNotes for each question here.
// Add at least three distractors. Six or more allows varied choices between challenges.
globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};

if (typeof module !== "undefined") module.exports = globalThis.QUESTION_CHOICE_SETS;
`;

fs.writeFileSync("question-choice-sets.js", output);
console.log(JSON.stringify({ expandedQuestions: expanded.length, expanded }, null, 2));
