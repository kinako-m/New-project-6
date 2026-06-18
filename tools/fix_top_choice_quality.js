const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const updates = {
  "x=7のとき、xが10以上ならA、5以上ならB、それ以外ならCを出力する。結果はどれか。": {
    distractors: ["A", "C", "D"]
  },
  "空のスタックに A, B, C の順にpushし、1回popしたとき取り出されるものはどれか。": {
    distractors: ["A", "B", "D", "AとB", "BとC", "AとC"]
  },
  "空のキューに A, B, C の順にenqueueし、1回dequeueしたとき取り出されるものはどれか。": {
    distractors: ["B", "C", "D", "AとB", "BとC", "AとC"]
  },
  "スタックへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。": {
    distractors: ["A、B", "A、C", "B、A", "B、C", "C、A", "A、B、C"]
  },
  "キューへA、B、Cの順に追加し、2回取り出す。取り出される順序はどれか。": {
    distractors: ["A、C", "B、A", "B、C", "C、A", "C、B", "A、B、C"]
  },
  "標本化の説明として最も適切なものはどれか。": {
    distractors: [
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "減算を加算として扱うために数を変換する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "量子化の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "減算を加算として扱うために数を変換する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "パリティビットの説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "減算を加算として扱うために数を変換する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "ハミング距離の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "仮数部と指数部で実数を近似表現する処理",
      "減算を加算として扱うために数を変換する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "浮動小数点数の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "減算を加算として扱うために数を変換する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "補数の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "標準偏差の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "到着とサービスの関係から待ち時間を分析する処理"
    ]
  },
  "待ち行列の説明として最も適切なものはどれか。": {
    distractors: [
      "連続した信号を一定間隔で取り出す処理",
      "連続値を有限個の段階へ丸める処理",
      "データに誤り検出用のビットを付加する処理",
      "二つのビット列で異なる位置を数える処理",
      "仮数部と指数部で実数を近似表現する処理",
      "減算を加算として扱うために数を変換する処理"
    ]
  },
  "HTTPS通信でサーバ証明書を確認する主な目的はどれか。": {
    distractors: [
      "ドメイン名からIPアドレスを調べる",
      "端末へIPアドレスを自動配布する",
      "メールを送信サーバへ中継する",
      "通信経路の到達性を確認する",
      "ファイルを暗号化せずに転送する",
      "サブネットの範囲を計算する"
    ]
  },
  "マルウェア感染に備えた対策として最も適切なものはどれか。": {
    distractors: [
      "利用者全員で同じパスワードを共有する",
      "更新プログラムの適用を停止する",
      "不審な添付ファイルを確認せず開く",
      "バックアップを同じPCだけに保存する",
      "ウイルス定義ファイルを更新しない",
      "復旧手順を事前に確認しない"
    ]
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
