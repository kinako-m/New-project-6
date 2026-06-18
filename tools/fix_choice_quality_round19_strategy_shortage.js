const fs = require("fs");

const target = "question-choice-sets.js";
const write = process.argv.includes("--write");
let source = fs.readFileSync(target, "utf8");

const updates = new Map([
  [
    "ソフトウェアのプログラムそのものを保護する代表的な権利はどれか。",
    ["特許権", "商標権", "意匠権", "実用新案権", "育成者権", "営業秘密"]
  ],
  [
    "貸借対照表で、ある時点の財政状態を示すものはどれか。",
    [
      "一定期間の収益と費用から利益を示す財務諸表",
      "一定期間のお金の流れを示す財務諸表",
      "売上高から売上原価を引いた利益",
      "本業による利益を示す指標",
      "投資に対する利益の割合を示す指標",
      "売上と費用が等しくなる販売量を示す点"
    ]
  ],
  [
    "情報システム導入の投資効果を評価する指標として適切なものはどれか。",
    ["ROE", "ROA", "売上総利益率", "損益分岐点", "固定費率", "流動比率"]
  ],
  [
    "売上高100万円、変動費60万円、固定費20万円の利益はいくらか。",
    ["40万円", "60万円", "80万円", "0万円", "10万円", "30万円"]
  ],
  [
    "売上高200万円、売上原価120万円の売上総利益はいくらか。",
    ["120万円", "320万円", "40万円", "60万円", "100万円", "200万円"]
  ],
  [
    "ROIを高める方法として適切なものはどれか。",
    [
      "利益を変えずに投資額だけを増やす",
      "売上や費用を考えず投資額だけを見る",
      "投資額に対する利益を小さくする",
      "利益を減らして投資額を増やす",
      "投資効果を測定せず追加投資だけを行う",
      "費用対効果を無視して支出を増やす"
    ]
  ],
  [
    "固定費が30万円、商品1個あたりの限界利益が300円のとき損益分岐点販売数量はどれか。",
    ["300個", "600個", "3,000個", "100個", "900個", "1,500個"]
  ],
  [
    "個人情報の取扱いで最も適切なものはどれか。",
    [
      "本人に知らせず目的外で自由に利用する",
      "管理方法を決めずに委託先へ渡す",
      "漏えい後だけ対策を検討する",
      "利用目的を定めず収集できるだけ収集する",
      "不要になった個人情報を期限なく保存し続ける",
      "安全管理措置を確認せず外部委託する"
    ]
  ],
  [
    "売上高800万円、変動費500万円、固定費200万円の利益はどれか。",
    ["300万円", "500万円", "1,000万円", "0万円", "200万円", "800万円"]
  ],
  [
    "固定費120万円、1個当たり販売価格1,000円、変動費600円の損益分岐点販売数量はどれか。",
    ["1,200個", "2,000個", "4,000個", "1,500個", "2,400個", "6,000個"]
  ],
  [
    "市場成長率が高く、自社の市場占有率も高い事業をPPMで何と呼ぶか。",
    ["金のなる木", "問題児", "負け犬", "導入期", "成熟期", "撤退候補"]
  ],
  [
    "自社の強みを使って市場の機会を生かす戦略は、SWOTのどの組合せか。",
    ["弱みと脅威", "強みと脅威", "弱みと機会", "弱みと強み", "機会と脅威", "脅威と市場占有率"]
  ],
  [
    "顧客データを分析して、既存顧客との関係強化と継続購入を狙う仕組みはどれか。",
    ["SCM", "ERP", "RFP", "SFA", "MA", "BPR"]
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
