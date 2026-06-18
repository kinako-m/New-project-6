const fs = require("fs");

const target = "question-choice-sets.js";
const write = process.argv.includes("--write");
let source = fs.readFileSync(target, "utf8");

const updates = new Map([
  [
    "重み付きグラフで全ての辺の重みが非負のとき、単一始点最短経路を求める代表的手法はどれか。",
    ["ベルマンフォード法", "幅優先探索だけ", "深さ優先探索だけ", "ワーシャルフロイド法", "最小全域木を求めるクラスカル法", "トポロジカルソート"]
  ],
  [
    "「推移的関数従属を取り除いた形」に該当する用語はどれか。",
    ["第1正規形", "第2正規形", "非正規形", "BCNF", "第4正規形", "未正規化表"]
  ],
  [
    "「部分関数従属を取り除いた形」に該当する用語はどれか。",
    ["第3正規形", "第1正規形", "非正規形", "BCNF", "第4正規形", "未正規化表"]
  ],
  [
    "サブスクリプションモデルの説明はどれか。",
    ["基本機能を無料で提供し高度機能を有料にするモデル", "商品を一度だけ販売して代金を得るモデル", "広告掲載料を主な収益源にするモデル", "取引ごとに仲介手数料を得るモデル", "特定製品やサービスから他へ乗り換えにくい状態", "優れた他社事例と比較して改善点を探る手法"]
  ],
  [
    "フリーミアムの説明はどれか。",
    ["一定期間の利用権に対して継続的に料金を得るモデル", "商品を一度だけ販売して代金を得るモデル", "広告掲載料を主な収益源にするモデル", "取引ごとに仲介手数料を得るモデル", "特定製品やサービスから他へ乗り換えにくい状態", "優れた他社事例と比較して改善点を探る手法"]
  ],
  [
    "KPIの説明はどれか。",
    ["最終的な経営目標の達成度を示す指標", "売上や利益だけで事業全体を評価する指標", "達成目標を設定せず活動量だけを見る指標", "従業員の勤務時間だけを測る指標", "財務諸表の金額だけを比較する指標", "システムの画面数だけを数える指標"]
  ],
  [
    "KGIの説明はどれか。",
    ["目標達成度を測る重要業績評価指標", "日々の業務活動量だけを測る指標", "システムの画面数だけを数える指標", "従業員の勤務時間だけを測る指標", "広告表示回数だけを最終目標にする指標", "財務諸表の勘定科目だけを列挙する指標"]
  ],
  [
    "RFPを提示する目的として適切なものはどれか。",
    ["契約締結後に検収結果を記録する文書", "運用開始後の障害履歴を記録する文書", "納品後の請求金額だけを示す文書", "社内利用者の勤務予定を管理する文書", "ベンダ選定後に作業実績だけを集計する文書", "完成したシステムの操作ログを保存する文書"]
  ],
  [
    "SaaSの例として適切なものはどれか。",
    ["自社でサーバを購入してメールソフトを運用する", "サーバのCPUやメモリを資源として借りる", "アプリ開発用の実行基盤を借りる", "ネットワーク機器だけを購入して自社で保守する", "OSを自社端末へ個別にインストールして利用する", "データセンタのラックだけを借りて機器を設置する"]
  ]
]);

function findBlockEnd(text, startIndex) {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  throw new Error("Block end not found");
}

function replaceDistractors(question, distractors) {
  const key = JSON.stringify(question);
  const questionIndex = source.indexOf(`${key}: {`);
  if (questionIndex < 0) throw new Error(`Question not found: ${question}`);
  const blockStart = source.indexOf("{", questionIndex);
  const blockEnd = findBlockEnd(source, blockStart);
  const block = source.slice(blockStart, blockEnd);
  const distractorIndex = block.indexOf('"distractors"');
  if (distractorIndex < 0) throw new Error(`Distractors not found: ${question}`);
  const arrayStart = block.indexOf("[", distractorIndex);
  let depth = 0;
  let inString = false;
  let escape = false;
  let arrayEnd = -1;
  for (let index = arrayStart; index < block.length; index += 1) {
    const char = block[index];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === "\"") {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        arrayEnd = index + 1;
        break;
      }
    }
  }
  if (arrayEnd < 0) throw new Error(`Array end not found: ${question}`);
  const replacement = JSON.stringify(distractors, null, 6).replace(/\n/g, "\n    ");
  const nextBlock = block.slice(0, arrayStart) + replacement + block.slice(arrayEnd);
  source = source.slice(0, blockStart) + nextBlock + source.slice(blockEnd);
}

for (const [question, distractors] of updates) {
  replaceDistractors(question, distractors);
}

if (write) fs.writeFileSync(target, source);

console.log(JSON.stringify({ changed: updates.size, write }, null, 2));
