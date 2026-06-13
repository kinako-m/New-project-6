const fs = require("fs");
const vm = require("vm");

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
  QUESTION_CHOICE_SETS: require("../question-choice-sets.js")
};
vm.createContext(context);
vm.runInContext(dataSource, context);

function clean(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function template(value) {
  return clean(value)
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[a-z]\d*/g, "x")
    .replace(/#[#x,+\-*/]+/g, "#");
}

function answerKey(question) {
  const correct = clean(question.choices[question.answer]);
  return `${question.stageId}:${question.tag}:${correct}`;
}

function countBy(items, keyFn) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question, index) => ({
    ...question,
    id: `${stage.id}-${String(index + 1).padStart(3, "0")}`,
    stageId: stage.id,
    stageName: stage.name
  }))
);

const templateCounts = countBy(questions, (question) => `${question.stageId}:${question.tag}:${template(question.text)}`);
const answerCounts = countBy(questions, answerKey);
const tagCounts = countBy(questions, (question) => `${question.stageId}:${question.tag}`);

function addScore(result, type, points, reason) {
  result[type] += points;
  result.flags.push(`${reason} +${points}`);
}

function scoreQuestion(question) {
  const result = { frequencyScore: 0, riskScore: 0, flags: [] };
  const searchable = `${question.stageName} ${question.tag} ${question.text} ${question.choices.join(" ")}`;
  const explanationLength = clean(question.explanation).length;
  const templateCount = templateCounts.get(`${question.stageId}:${question.tag}:${template(question.text)}`) || 1;
  const sameAnswerCount = answerCounts.get(answerKey(question)) || 1;
  const tagCount = tagCounts.get(`${question.stageId}:${question.tag}`) || 1;

  if (/頻出/.test(question.tag)) addScore(result, "frequencyScore", 6, "頻出タグ");
  if (/科目B長文/.test(question.tag)) addScore(result, "frequencyScore", 7, "科目B長文");
  else if (/科目B|実戦|複合ケース/.test(question.tag)) addScore(result, "frequencyScore", 4, "実戦形式");

  if (/セキュリティ|認証|脆弱性|暗号|インシデント|アクセス制御|ログ/.test(searchable)) {
    addScore(result, "frequencyScore", 4, "セキュリティ重点");
  }
  if (/SQL|データベース|正規化|トランザクション|ロック|主キー|外部キー/.test(searchable)) {
    addScore(result, "frequencyScore", 4, "DB・SQL重点");
  }
  if (/アルゴリズム|擬似言語|トレース|計算量|探索|整列|再帰/.test(searchable)) {
    addScore(result, "frequencyScore", 4, "アルゴリズム重点");
  }
  if (/法務|著作権|特許権|商標権|個人情報|請負|派遣/.test(searchable)) {
    addScore(result, "frequencyScore", 3, "法務重点");
  }
  if (/計算|回数|確率|稼働率|ROI|CPI|SPI|損益分岐|ビット|バイト/.test(searchable)) {
    addScore(result, "frequencyScore", 3, "計算重点");
  }

  if (tagCount >= 20) addScore(result, "frequencyScore", 3, `出題層が厚いタグ(${tagCount}問)`);
  else if (tagCount >= 12) addScore(result, "frequencyScore", 2, `出題層が厚いタグ(${tagCount}問)`);

  if (templateCount >= 3) addScore(result, "riskScore", Math.min(5, templateCount), `類似文型${templateCount}問`);
  if (sameAnswerCount >= 3) addScore(result, "riskScore", Math.min(5, sameAnswerCount), `同じ知識を問う問題${sameAnswerCount}問`);
  if (explanationLength < 24) addScore(result, "riskScore", 6, `解説が短い(${explanationLength}字)`);
  else if (explanationLength < 45) addScore(result, "riskScore", 3, `解説がやや短い(${explanationLength}字)`);

  const choiceLengths = question.choices.map((choice) => clean(choice).length);
  if (Math.max(...choiceLengths) >= Math.min(...choiceLengths) * 3 && Math.min(...choiceLengths) <= 8) {
    addScore(result, "riskScore", 4, "選択肢の長さに大差");
  }
  return {
    ...result,
    priorityScore: result.frequencyScore * 2 + result.riskScore,
    templateCount,
    sameAnswerCount,
    tagCount,
    explanationLength
  };
}

const ranked = questions
  .map((question) => ({ ...question, ...scoreQuestion(question) }))
  .sort((a, b) => b.priorityScore - a.priorityScore || b.riskScore - a.riskScore || a.id.localeCompare(b.id));

function summarizeBy(items, keyFn) {
  return [...countBy(items, keyFn).entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"));
}

const priorityItems = ranked.filter((question) => question.priorityScore >= 18);
const balancedReviewQueue = context.result
  .flatMap((stage) => [
    ...ranked.filter((question) => question.stageId === stage.id && question.riskScore >= 3).slice(0, 20)
  ])
  .sort((a, b) => b.priorityScore - a.priorityScore || b.riskScore - a.riskScore || a.id.localeCompare(b.id));
const report = {
  generatedAt: new Date().toISOString(),
  scoring: {
    priorityScore: "frequencyScore * 2 + riskScore",
    note: "頻出度は試験傾向・科目B・重点分野・問題層の厚さ、品質リスクは類似問題・短い解説・選択肢差などで評価"
  },
  summary: {
    questions: questions.length,
    priorityItems: priorityItems.length,
    highRiskItems: ranked.filter((question) => question.riskScore >= 8).length,
    balancedReviewQueue: balancedReviewQueue.length,
    byStage: summarizeBy(priorityItems, (question) => question.stageName),
    topTags: summarizeBy(priorityItems, (question) => `${question.stageName} / ${question.tag}`).slice(0, 20)
  },
  reviewChecklist: [
    "問題文に対して正解が一意か",
    "誤答選択肢が同分野で、誤りとして明確か",
    "正解の根拠が解説に含まれるか",
    "各誤答が何を指すか、又はなぜ誤りか説明されているか",
    "類似問題と内容が重複しすぎていないか"
  ],
  balancedReviewQueue: balancedReviewQueue.map((question, index) => ({
    queueOrder: index + 1,
    id: question.id,
    stage: question.stageName,
    tag: question.tag,
    priorityScore: question.priorityScore,
    frequencyScore: question.frequencyScore,
    riskScore: question.riskScore,
    flags: question.flags,
    text: question.text,
    correct: question.choices[question.answer],
    choices: question.choices,
    explanation: question.explanation
  })),
  items: ranked.slice(0, 200).map((question) => ({
    rank: ranked.indexOf(question) + 1,
    id: question.id,
    stage: question.stageName,
    tag: question.tag,
    priorityScore: question.priorityScore,
    frequencyScore: question.frequencyScore,
    riskScore: question.riskScore,
    flags: question.flags,
    text: question.text,
    correct: question.choices[question.answer],
    choices: question.choices,
    explanation: question.explanation
  }))
};

const markdownRows = report.items
  .slice(0, 100)
  .map(
    (item) =>
      `| ${item.rank} | ${item.priorityScore} | ${item.stage} | ${item.tag} | ${item.text.replace(/\r?\n/g, " ")} | ${item.flags.join("、")} |`
  )
  .join("\n");
const queueRows = report.balancedReviewQueue
  .map(
    (item) =>
      `| ${item.queueOrder} | ${item.priorityScore} | ${item.riskScore} | ${item.stage} | ${item.tag} | ${item.text.replace(/\r?\n/g, " ")} | ${item.flags.join("、")} |`
  )
  .join("\n");
const markdown = `# 問題品質 優先監査レポート

生成日時: ${report.generatedAt}

- 全問題数: ${report.summary.questions}
- 優先確認対象: ${report.summary.priorityItems}
- 高リスク候補: ${report.summary.highRiskItems}
- 分野均等の着手用キュー: ${report.summary.balancedReviewQueue}
- 採点式: \`${report.scoring.priorityScore}\`

## 確認チェックリスト

${report.reviewChecklist.map((item) => `- ${item}`).join("\n")}

## 分野均等の着手用キュー

各分野の上位20問を抽出しています。まず、この順に人手確認します。

| 順番 | 優先点 | リスク点 | 分野 | タグ | 問題 | 理由 |
| ---: | ---: | ---: | --- | --- | --- | --- |
${queueRows}

## 優先確認 Top 100

| 順位 | 優先点 | 分野 | タグ | 問題 | 理由 |
| ---: | ---: | --- | --- | --- | --- |
${markdownRows}
`;

fs.writeFileSync("tools/question-priority-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/question-priority-report.md", markdown);

console.log(
  JSON.stringify(
    {
      generatedAt: report.generatedAt,
      summary: report.summary,
      top10: report.items.slice(0, 10).map(({ rank, id, priorityScore, stage, tag, text, flags }) => ({
        rank,
        id,
        priorityScore,
        stage,
        tag,
        text,
        flags
      }))
    },
    null,
    2
  )
);
