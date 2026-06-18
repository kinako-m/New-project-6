const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const hardware = {
  "主記憶装置を見分ける特徴として最も適切なものはどれか。": {
    correct: "実行中のプログラムやデータを保持する",
    distractors: [
      "半導体メモリへデータを永続的に保存する",
      "同じデータを複製して耐障害性を高める",
      "分散パリティを使って障害に備える",
      "CPUを介さずデータを転送する",
      "主記憶へのアクセス時間を短縮する",
      "算術演算と論理演算を行う"
    ]
  },
  "SSDを見分ける特徴として最も適切なものはどれか。": {
    correct: "半導体メモリへデータを永続的に保存する",
    distractors: [
      "実行中のプログラムやデータを保持する",
      "同じデータを複製して耐障害性を高める",
      "分散パリティを使って障害に備える",
      "CPUを介さずデータを転送する",
      "主記憶へのアクセス時間を短縮する",
      "算術演算と論理演算を行う"
    ]
  },
  "RAID1を見分ける特徴として最も適切なものはどれか。": {
    correct: "同じデータを複製して耐障害性を高める",
    distractors: [
      "実行中のプログラムやデータを保持する",
      "半導体メモリへデータを永続的に保存する",
      "分散パリティを使って障害に備える",
      "CPUを介さずデータを転送する",
      "主記憶へのアクセス時間を短縮する",
      "算術演算と論理演算を行う"
    ]
  },
  "RAID5を見分ける特徴として最も適切なものはどれか。": {
    correct: "分散パリティを使って障害に備える",
    distractors: [
      "実行中のプログラムやデータを保持する",
      "半導体メモリへデータを永続的に保存する",
      "同じデータを複製して耐障害性を高める",
      "CPUを介さずデータを転送する",
      "主記憶へのアクセス時間を短縮する",
      "算術演算と論理演算を行う"
    ]
  }
};

const os = {
  "仮想記憶を見分ける特徴として最も適切なものはどれか。": {
    correct: "補助記憶を使って主記憶より大きな空間を提供する",
    distractors: [
      "不足したページを補助記憶から読み込む",
      "入出力データを一時保存して処理を並行化する",
      "複数の処理が互いに資源解放を待ち続ける",
      "参照対象ページが主記憶にない状態を検出する",
      "低速な入出力装置とCPUの速度差を緩和する",
      "資源を保持したまま複数処理が進行不能になる"
    ]
  },
  "ページフォールトを見分ける特徴として最も適切なものはどれか。": {
    correct: "不足したページを補助記憶から読み込む",
    distractors: [
      "補助記憶を使って主記憶より大きな空間を提供する",
      "入出力データを一時保存して処理を並行化する",
      "複数の処理が互いに資源解放を待ち続ける",
      "主記憶より大きな空間をプロセスに提供する",
      "低速な入出力装置とCPUの速度差を緩和する",
      "資源を保持したまま複数処理が進行不能になる"
    ]
  },
  "スプーリングを見分ける特徴として最も適切なものはどれか。": {
    correct: "入出力データを一時保存して処理を並行化する",
    distractors: [
      "補助記憶を使って主記憶より大きな空間を提供する",
      "不足したページを補助記憶から読み込む",
      "複数の処理が互いに資源解放を待ち続ける",
      "参照対象ページが主記憶にない状態を検出する",
      "主記憶より大きな空間をプロセスに提供する",
      "資源を保持したまま複数処理が進行不能になる"
    ]
  },
  "デッドロックを見分ける特徴として最も適切なものはどれか。": {
    correct: "複数の処理が互いに資源解放を待ち続ける",
    distractors: [
      "補助記憶を使って主記憶より大きな空間を提供する",
      "不足したページを補助記憶から読み込む",
      "入出力データを一時保存して処理を並行化する",
      "主記憶より大きな空間をプロセスに提供する",
      "参照対象ページが主記憶にない状態を検出する",
      "低速な入出力装置とCPUの速度差を緩和する"
    ]
  }
};

const network = {
  "DNSを見分ける特徴として最も適切なものはどれか。": {
    correct: "ドメイン名からIPアドレスを解決する",
    distractors: [
      "端末へIP設定を自動配布する",
      "IPアドレスからMACアドレスを求める",
      "プライベートIPとグローバルIPを変換する",
      "再送や順序制御で信頼性を高める",
      "公衆網上に安全な仮想通信路を作る",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "DHCPを見分ける特徴として最も適切なものはどれか。": {
    correct: "端末へIP設定を自動配布する",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "IPアドレスからMACアドレスを求める",
      "プライベートIPとグローバルIPを変換する",
      "再送や順序制御で信頼性を高める",
      "公衆網上に安全な仮想通信路を作る",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "ARPを見分ける特徴として最も適切なものはどれか。": {
    correct: "IPアドレスからMACアドレスを求める",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "端末へIP設定を自動配布する",
      "プライベートIPとグローバルIPを変換する",
      "再送や順序制御で信頼性を高める",
      "公衆網上に安全な仮想通信路を作る",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "NATを見分ける特徴として最も適切なものはどれか。": {
    correct: "プライベートIPとグローバルIPを変換する",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "端末へIP設定を自動配布する",
      "IPアドレスからMACアドレスを求める",
      "再送や順序制御で信頼性を高める",
      "公衆網上に安全な仮想通信路を作る",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "VPNを見分ける特徴として最も適切なものはどれか。": {
    correct: "公衆網上に安全な仮想通信路を作る",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "端末へIP設定を自動配布する",
      "IPアドレスからMACアドレスを求める",
      "再送や順序制御で信頼性を高める",
      "プライベートIPとグローバルIPを変換する",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "TCPを見分ける特徴として最も適切なものはどれか。": {
    correct: "再送や順序制御で信頼性を高める",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "端末へIP設定を自動配布する",
      "IPアドレスからMACアドレスを求める",
      "プライベートIPとグローバルIPを変換する",
      "公衆網上に安全な仮想通信路を作る",
      "再送制御を省いて低遅延を重視する"
    ]
  },
  "UDPを見分ける特徴として最も適切なものはどれか。": {
    correct: "再送制御を省いて低遅延を重視する",
    distractors: [
      "ドメイン名からIPアドレスを解決する",
      "端末へIP設定を自動配布する",
      "IPアドレスからMACアドレスを求める",
      "プライベートIPとグローバルIPを変換する",
      "再送や順序制御で信頼性を高める",
      "公衆網上に安全な仮想通信路を作る"
    ]
  }
};

const updates = { ...hardware, ...os, ...network };
const changed = [];
for (const [text, update] of Object.entries(updates)) {
  const definition = choiceSets[text];
  if (!definition) throw new Error(`Question not found: ${text}`);
  definition.correct = update.correct;
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
