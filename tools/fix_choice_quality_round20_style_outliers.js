const fs = require("fs");

const target = "question-choice-sets.js";
const write = process.argv.includes("--write");
let source = fs.readFileSync(target, "utf8");

const replacements = [
  ["論理積の説明として最も適切なものはどれか。", "条件の真偽を反転させる演算", "一つの条件の真偽を反転させる演算であること"],
  ["論理和の説明として最も適切なものはどれか。", "条件の真偽を反転させる演算", "一つの条件の真偽を反転させる演算であること"],
  ["外部キーの説明として最も適切なものはどれか。", "列の値の重複を防ぐための制約", "列の値が重複しないように制限するための制約"],
  ["候補キーの説明として最も適切なものはどれか。", "列の値の重複を防ぐための制約", "列の値が重複しないように制限するための制約"],
  ["ウォータフォールモデルを見分ける特徴として最も適切なものはどれか。", "短い反復で開発と改善を進める", "短い期間で開発と改善を繰り返して進める"],
  ["アジャイル開発を見分ける特徴として最も適切なものはどれか。", "短い反復で開発と改善を進める", "短い期間で開発と改善を繰り返して進める"],
  ["プロトタイピングを見分ける特徴として最も適切なものはどれか。", "短い反復で開発と改善を進める", "短い期間で開発と改善を繰り返して進める"],
  ["DevOpsを見分ける特徴として最も適切なものはどれか。", "短い反復で開発と改善を進める", "短い期間で開発と改善を繰り返して進める"],
  ["CIを見分ける特徴として最も適切なものはどれか。", "短い反復で開発と改善を進める", "短い期間で開発と改善を繰り返して進める"],
  ["フェールオーバを見分ける特徴として最も適切なものはどれか。", "待機系へ切り替える", "障害時に待機系へ処理を自動的に切り替える"],
  ["結合テストで多数のインタフェース不具合が発生した。上流で強化すべき活動はどれか。", "設計レビュー", "設計段階でインタフェース仕様をレビューする"],
  ["一つのモジュールが一つの明確な役割へ集中している状態として望ましいものはどれか。", "機能が無関係に混在する", "低い凝集度"],
  ["4Pに含まれる要素はどれか。", "Physical Evidence", "Process"],
  ["貸借対照表で、ある時点の財政状態を示すものはどれか。", "本業による利益を示す指標", "本業によって得た利益を確認するための指標"],
  ["営業利益の説明として適切なものはどれか。", "本業で得た利益を表す指標です。", "本業の活動によって得た利益を表す指標です。"],
  ["営業利益を見分ける特徴として最も適切なものはどれか。", "投資に対する利益の割合を見る", "投資額に対する利益の割合を確認する"],
  ["固定費の説明として適切なものはどれか。", "本業で得た利益を表す指標です。", "本業の活動によって得た利益を表す指標です。"],
  ["固定費を見分ける特徴として最も適切なものはどれか。", "投資に対する利益の割合を見る", "投資額に対する利益の割合を確認する"],
  ["変動費の説明として適切なものはどれか。", "本業で得た利益を表す指標です。", "本業の活動によって得た利益を表す指標です。"],
  ["損益分岐点の説明として適切なものはどれか。", "本業で得た利益を表す指標です。", "本業の活動によって得た利益を表す指標です。"],
  ["ROIの説明として適切なものはどれか。", "本業で得た利益を表す指標です。", "本業の活動によって得た利益を表す指標です。"],
  ["著作権を見分ける特徴として最も適切なものはどれか。", "個人を識別できる情報を守る", "個人を識別できる情報を適切に保護する"],
  ["特許権を見分ける特徴として最も適切なものはどれか。", "個人を識別できる情報を守る", "個人を識別できる情報を適切に保護する"],
  ["商標権を見分ける特徴として最も適切なものはどれか。", "個人を識別できる情報を守る", "個人を識別できる情報を適切に保護する"],
  ["派遣契約を見分ける特徴として最も適切なものはどれか。", "仕事の完成に責任を負う", "仕事の完成に対して受注者が責任を負う"],
  ["経理担当者が人事情報も閲覧できる状態になっていた。適切な改善はどれか。", "職務と無関係な権限を残す", "職務と無関係な権限を削除せずに残す"],
  ["管理者作業の追跡性を高める方法として適切なものはどれか。", "共通の管理者IDだけを使う", "共通の管理者IDだけを使って作業者を識別しない"],
  ["取引先を装ったメールの添付ファイルを開かせる攻撃への対策として有効なものはどれか。", "全メールを管理者権限で開く", "全てのメールを管理者権限で開いて確認する"],
  ["重大な脆弱性が公表されたが直ちに更新できない。暫定対応として適切なものはどれか。", "利用者へ管理者権限を与える", "一般利用者へ管理者権限を追加で付与する"],
  ["機密ファイルを高速に暗号化し、その共通鍵だけを公開鍵暗号で保護する方式の利点はどれか。", "鍵配送を全く考慮しなくてよい", "共通鍵の配送方法を全く考慮しなくてよい"],
  ["クラウド事業者へデータ処理を委託する前に確認すべき事項として最も適切なものはどれか。", "事故対応は全て口頭で決める", "事故時の対応方法を全て口頭だけで決める"],
  ["サーバ室への入退室管理を強化する対策はどれか。", "共通カードを全員で使い回す", "共通の入退室カードを全員で使い回す"],
  ["社内ネットワークからの接続でも毎回利用者と端末状態を確認する考え方はどれか。", "全端末へ同じ証明書を配る", "全ての端末へ同じ証明書を配布して区別しない"],
  ["業務委託先の作業者へ本番環境の管理権限を付与する必要がある。安全な運用として最も適切なものはどれか。", "操作ログを残さず作業を任せる", "操作ログを残さずに本番作業を任せる"]
];

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

function replaceInQuestion(question, before, after) {
  const key = JSON.stringify(question);
  const questionIndex = source.indexOf(`${key}: {`);
  if (questionIndex < 0) throw new Error(`Question not found: ${question}`);
  const blockStart = source.indexOf("{", questionIndex);
  const blockEnd = findBlockEnd(source, blockStart);
  const block = source.slice(blockStart, blockEnd);
  const beforeJson = JSON.stringify(before);
  const afterJson = JSON.stringify(after);
  if (!block.includes(beforeJson)) {
    throw new Error(`Candidate not found: ${question} / ${before}`);
  }
  const nextBlock = block.replace(beforeJson, afterJson);
  source = source.slice(0, blockStart) + nextBlock + source.slice(blockEnd);
}

let changed = 0;
for (const [question, before, after] of replacements) {
  replaceInQuestion(question, before, after);
  changed += 1;
}

if (write) fs.writeFileSync(target, source);

console.log(JSON.stringify({ changed, write }, null, 2));
