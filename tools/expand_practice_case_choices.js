const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "technology/実戦問題",
  "management/ケース問題",
  "strategy/実戦ケース"
]);

const SPECIAL = {
  "データ量が64MB、転送速度が8MB/秒のとき、転送に必要な時間はどれか。": ["4秒", "6秒", "7秒", "9秒", "16秒", "72秒"],
  "稼働率0.8の装置Aと0.9の装置Bを直列に接続した全体稼働率はどれか。": ["0.17", "0.70", "0.80", "0.85", "0.90", "0.98"],
  "1文字を2バイトで表す文字を500文字保存する場合、必要な容量はどれか。": ["250バイト", "500バイト", "750バイト", "1500バイト", "2000バイト", "4000バイト"],
  "キャッシュのアクセス時間が10ns、主記憶が100ns、ヒット率が80%の平均アクセス時間はどれか。": ["18ns", "20ns", "22ns", "36ns", "80ns", "90ns"],
  "IPv4でサブネットマスク255.255.255.0を使うと、ホスト部は何ビットか。": ["0ビット", "16ビット", "24ビット", "32ビット", "255ビット", "256ビット"],
  "HTTPS通信でサーバ証明書を確認する主な目的はどれか。": {
    correct: "接続先のサーバが正当であることを確認する",
    distractors: [
      "IPアドレスとドメイン名を対応付ける",
      "端末にIPアドレスを自動配布する",
      "通信経路上のホップ数を調べる",
      "メールを送信サーバへ中継する",
      "ファイルを暗号化せずに転送する",
      "サブネットマスクのビット数を自動計算する"
    ]
  },
  "ログイン失敗が短時間に大量発生した。疑うべき攻撃として適切なものはどれか。": ["入力欄からSQL文を実行させるSQLインジェクション", "画面へ不正スクリプトを埋め込むXSS", "利用者に意図しない要求を送らせるCSRF", "通信内容を盗聴するスニッフィング", "大量トラフィックでサービスを停止させるDoS攻撃", "偽サイトに誘導し認証情報を詐取するフィッシング"],
  "社外から社内システムへ安全に接続するために使う技術として適切なものはどれか。": ["DNS", "TCP", "UDP", "ARP", "DHCP", "NAT"],
  "マルウェア感染に備えた対策として最も適切なものはどれか。": ["パスワードを全員で共有する", "更新プログラムの適用を止める", "不審な添付ファイルを確認せず開く", "バックアップを暗号化せず同じPCだけに保存する", "ウイルス対策ソフトの定義ファイルを更新しない", "感染後の復旧手順を確認しない"],
  "作業Aが3日、作業Bが5日で、BはA完了後に開始する。最短完了日数はどれか。": ["2日", "3日", "5日", "6日", "10日", "15日"],
  "作業Aが3日、作業Bが5日で並行実施できる。両方完了までの最短日数はどれか。": ["2日", "3日", "4日", "8日", "10日", "15日"],
  "EV=80、AC=100のときCPIはどれか。": ["0.2", "1.25", "1.8", "20", "80", "180"],
  "EV=90、PV=100のときSPIはどれか。": ["0.1", "1.1", "1.9", "10", "90", "190"],
  "障害を早く復旧した後、根本原因を分析して再発防止する活動はどれか。": ["インシデント管理", "変更管理", "構成管理", "可用性管理", "リリース管理", "容量管理"],
  "本番環境への変更による障害リスクを抑えるため、事前に評価・承認する活動はどれか。": ["容量管理", "可用性管理", "正規化", "インシデント管理", "構成管理", "問題管理"],
  "レビューで設計書の欠陥を早期発見する主な効果はどれか。": ["テスト工程を行わなくても品質を保証できる", "レビュー参加者を増やすほど欠陥を必ずゼロにできる", "設計書の欠陥を実行時に自動修復できる", "運用中のサーバ負荷を直接下げる", "利用者のパスワードを自動変更する", "データベースの正規化を不要にする"],
  "受入テストで主に確認することはどれか。": ["成果物を人が確認して欠陥を早期発見する活動", "個々の部品や関数が正しく動くか確認するテスト", "複数の部品を組み合わせた動作を確認するテスト", "プログラムの内部構造を基に経路を確認するテスト", "大量データで処理性能を確認するテスト", "障害後の復旧手順を確認するテスト"],
  "監査で職務分掌を確認する目的はどれか。": ["一人にすべての権限を集めて処理を速くする", "売上高を増やすために商品価格を下げる", "表を結合して検索結果を増やす", "担当者がシステムを単独で開発・承認・運用できるようにする", "同じ利用者IDを複数人で共有する", "権限を確認せず業務を委託する"],
  "売上高500万円、変動費300万円、固定費120万円の利益はどれか。": ["20万円", "120万円", "200万円", "300万円", "420万円", "500万円"],
  "固定費100万円、販売単価1000円、変動費600円の損益分岐点販売数量はどれか。": ["1000個", "1600個", "2000個", "4000個", "5000個", "10000個"],
  "売上高1000万円、利益100万円、投資額500万円のROIはどれか。": ["10%", "25%", "50%", "100%", "200%", "500%"],
  "個人情報を外部委託先に扱わせる場合に適切な対応はどれか。": ["利用目的を定めず委託先に自由に利用させる", "契約や管理方法を確認せず個人情報を渡す", "漏えいが起きた後だけ委託先の状況を確認する", "委託先に再委託を無制限に認める", "安全管理措置の確認を行わない", "個人情報を試験目的で公開サイトに掲載する"],
  "他社の登録商標を自社商品名として無断使用した場合に問題となる権利はどれか。": ["著作権", "特許権", "意匠権", "肖像権", "営業秘密", "派遣契約"],
  "発注者が作業者へ直接指揮命令する形態として適切なのはどれか。": ["請負契約", "準委任契約", "売買契約", "ライセンス契約", "秘密保持契約", "業務委託契約"],
  "RFPを提示する目的として適切なものはどれか。": ["企業全体の経営資源を統合的に管理するシステム", "顧客情報を活用して顧客関係を管理する考え方やシステム", "調達から販売までの供給連鎖を管理する考え方", "業務プロセスを継続的に改善する考え方", "業務の一部を外部事業者に委託すること", "ネットワーク経由で計算資源を利用する形態"],
  "SaaSの例として適切なものはどれか。": ["企業全体の経営資源を統合的に管理するシステム", "顧客情報を活用して顧客関係を管理する考え方やシステム", "調達から販売までの供給連鎖を管理する考え方", "自社でサーバを購入してメールソフトを運用する", "サーバのCPUやメモリを資源として借りる", "アプリ開発用の実行基盤を借りる"]
};

const source = fs.readFileSync("app.js", "utf8");
const dataSource = source.slice(0, source.indexOf("const els =")) + "\nresult = stages;";
const context = {
  result: null,
  console,
  explainChoice: () => "",
  getExplanationTip: () => "",
  IMPROVEMENT_QUESTIONS: require("../improvement-questions.js"),
  SUBJECT_B_CASE_QUESTIONS: require("../subject-b-case-questions.js"),
  SUBJECT_B_CASE_QUESTIONS_2: require("../subject-b-case-questions-2.js"),
  SAMPLE_DERIVED_QUESTIONS: require("../sample-derived-questions.js"),
  QUESTION_CHOICE_SETS: choiceSets
};
vm.createContext(context);
vm.runInContext(dataSource, context);

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question) => ({ ...question, stageId: stage.id }))
);

const sameArray = (a, b) => Array.isArray(a) && Array.isArray(b) &&
  a.length === b.length && a.every((value, index) => value === b[index]);

const expanded = [];
const skipped = [];
for (const question of questions) {
  const target = `${question.stageId}/${question.tag}`;
  if (!TARGETS.has(target)) continue;
  const definition = choiceSets[question.text];
  const special = SPECIAL[question.text];
  if (definition && !special && definition.distractors.length >= 6) continue;
  if (!definition || !special) {
    skipped.push({ text: question.text, target, found: special ? 1 : 0 });
    continue;
  }

  if (Array.isArray(special)) {
    if (sameArray(definition.distractors, special)) continue;
    definition.distractors = [...special];
  } else {
    if (definition.correct === special.correct && sameArray(definition.distractors, special.distractors)) continue;
    definition.correct = special.correct;
    definition.distractors = [...special.distractors];
  }
  expanded.push({ text: question.text, target });
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
  targetQuestions: questions.filter((question) => TARGETS.has(`${question.stageId}/${question.tag}`)).length,
  expanded: expanded.length,
  byTarget: expanded.reduce((counts, item) => {
    counts[item.target] = (counts[item.target] || 0) + 1;
    return counts;
  }, {}),
  skipped
}, null, 2));
