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
  SUBJECT_B_CASE_QUESTIONS_2: require("../subject-b-case-questions-2.js")
};
vm.createContext(context);
vm.runInContext(dataSource, context);

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question) => ({ ...question, stageId: stage.id, stageName: stage.name }))
);

function compact(value) {
  return String(value || "").normalize("NFKC").replace(/\s+/g, "").replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function choiceKind(choice) {
  const value = String(choice).trim();
  if (/^-?\d+(?:\.\d+)?(?:回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/.test(value)) return "numeric";
  if (/^(?:O\(.+\)|[A-Z][A-Z0-9 /+.-]*|第\d正規形)$/.test(value)) return "term";
  return compact(value).length <= 12 ? "term" : "sentence";
}

function numbers(value) {
  return [...String(value).matchAll(/\d+(?:\.\d+)?/g)].map((match) => match[0]);
}

const findings = [];
function add(type, question, detail) {
  findings.push({
    type,
    stage: question.stageName,
    tag: question.tag,
    text: question.text,
    correct: question.choices[question.answer],
    choices: question.choices,
    explanation: question.explanation,
    detail
  });
}

questions.forEach((question) => {
  const correct = String(question.choices[question.answer]);
  const explanation = String(question.explanation || "");
  const kinds = question.choices.map(choiceKind);
  const uniqueKinds = new Set(kinds);

  if (uniqueKinds.has("sentence") && uniqueKinds.has("term")) {
    add("mixed-choice-style", question, kinds);
  }

  if (/(説明|特徴|役割|とは)/.test(question.text) && compact(question.text).includes(compact(correct))) {
    add("answer-echoes-explanation-question", question, "説明を問う問題で、対象語そのものが正解選択肢です。");
  }

  const correctNumbers = numbers(correct);
  const explanationNumbers = numbers(explanation);
  if (
    choiceKind(correct) === "numeric" &&
    correctNumbers.length &&
    explanationNumbers.length &&
    !correctNumbers.some((number) => explanationNumbers.includes(number))
  ) {
    add("numeric-answer-explanation-mismatch", question, { correctNumbers, explanationNumbers });
  }

  const answerStatement = explanation.match(/(?:正解|答え|該当するの)は[「『]?([^。、「』]+)[」』]?/);
  if (answerStatement) {
    const stated = compact(answerStatement[1]);
    const normalizedCorrect = compact(correct);
    const statedCore = stated.replace(/(?:制約|テスト|仕組み|こと)$/g, "");
    const correctCore = normalizedCorrect.replace(/(?:制約|テスト|仕組み|こと)$/g, "");
    if (!stated.includes(normalizedCorrect) && !normalizedCorrect.includes(stated) && !statedCore.includes(correctCore) && !correctCore.includes(statedCore)) {
      add("explicit-answer-mismatch", question, answerStatement[1]);
    }
  }
});

const grouped = Object.fromEntries(
  [...new Set(findings.map((finding) => finding.type))].map((type) => [
    type,
    findings.filter((finding) => finding.type === type)
  ])
);

const report = {
  generatedAt: new Date().toISOString(),
  questionCount: questions.length,
  findingCount: findings.length,
  counts: Object.fromEntries(Object.entries(grouped).map(([type, items]) => [type, items.length])),
  findings: grouped
};

fs.writeFileSync("tools/question-consistency-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
