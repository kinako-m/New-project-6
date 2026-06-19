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

function compact(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：?？「」『』()[\]{}]/g, "");
}

function inspectExam(subject, questions, iteration) {
  const findings = [];
  const seenTexts = new Set();

  questions.forEach((question, index) => {
    const textKey = compact(question.text);
    if (seenTexts.has(textKey)) {
      findings.push({
        type: "duplicate-question-in-exam",
        subject,
        iteration,
        index,
        text: question.text
      });
    }
    seenTexts.add(textKey);

    const choices = question.choices || [];
    const order = question.order || [];
    const correctChoice = question.correctChoice || choices[question.answer];
    const normalizedChoices = choices.map(compact);
    const uniqueChoices = new Set(normalizedChoices);
    const correctCount = normalizedChoices.filter((choice) => choice === compact(correctChoice)).length;

    if (choices.length !== 4) {
      findings.push({
        type: "choice-count-not-four",
        subject,
        iteration,
        index,
        text: question.text,
        count: choices.length
      });
    }

    if (uniqueChoices.size !== normalizedChoices.length) {
      findings.push({
        type: "duplicate-choice",
        subject,
        iteration,
        index,
        text: question.text,
        choices
      });
    }

    if (correctCount !== 1) {
      findings.push({
        type: "correct-choice-count-invalid",
        subject,
        iteration,
        index,
        text: question.text,
        correctChoice,
        correctCount,
        choices
      });
    }

    if (order.length !== choices.length) {
      findings.push({
        type: "order-count-mismatch",
        subject,
        iteration,
        index,
        text: question.text,
        choiceCount: choices.length,
        orderCount: order.length
      });
    }

    const orderIndexes = order.map((item) => item.index);
    if (new Set(orderIndexes).size !== orderIndexes.length || orderIndexes.some((value) => value < 0 || value >= choices.length)) {
      findings.push({
        type: "invalid-choice-order",
        subject,
        iteration,
        index,
        text: question.text,
        order
      });
    }
  });

  return findings;
}

const iterations = Number(process.argv.find((arg) => arg.startsWith("--iterations="))?.split("=")[1] || 100);
const allFindings = [];
const stages = context.result;

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function questionUniqueKey(question) {
  return String(question.text || "")
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：?？「」『』()[\]{}]/g, "")
    .toLowerCase();
}

function uniqueQuestionsByText(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = questionUniqueKey(question);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function questionId(stageId, question) {
  return `${stageId}:${question.tag}:${question.text}`;
}

function selectQuestionChoices(question) {
  const correctChoice = question.correctChoice || question.choices[question.answer];
  const choicePool = question.choicePool || question.choices.filter((_, index) => index !== question.answer);
  const distractors = shuffle([...new Set(choicePool.filter((choice) => choice !== correctChoice))]).slice(0, 3);
  return {
    ...question,
    correctChoice,
    choicePool: [...choicePool],
    choices: [correctChoice, ...distractors],
    answer: 0
  };
}

function withQuestionOrder(question) {
  const selectedQuestion = selectQuestionChoices(question);
  return {
    ...selectedQuestion,
    order: shuffle(selectedQuestion.choices.map((choice, index) => ({ choice, index })))
  };
}

function examQuestion(question, stage) {
  return {
    ...question,
    id: questionId(stage.id, question),
    stageId: stage.id,
    sourceStageName: stage.name,
    tag: `${stage.name} / ${question.tag}`
  };
}

function takeExamQuestions(stageId, count, filter = () => true) {
  const stage = stages.find((item) => item.id === stageId);
  return uniqueQuestionsByText(shuffle(stage.questions.filter(filter).map((question) => examQuestion(question, stage))))
    .slice(0, count);
}

function buildSubjectAExam() {
  const distribution = [
    ["technology", 18],
    ["algorithm", 12],
    ["database", 10],
    ["management", 10],
    ["strategy", 10]
  ];
  return shuffle(distribution.flatMap(([stageId, count]) => takeExamQuestions(stageId, count))).map(withQuestionOrder);
}

function buildSubjectBExam() {
  const isSubjectBLongAlgorithm = (question) => /科目B長文アルゴリズム/.test(question.tag);
  const isSubjectBAlgorithm = (question) =>
    question.tag !== "科目B長文アルゴリズム"
    && /科目Bアルゴリズム|探索トレース|整列トレース|再帰トレース|条件分岐|データ構造応用|グラフ問題|計算量判断|配列操作|文字列処理|状態遷移|フラグ処理|境界値|擬似言語|トレース|実戦トレース/.test(question.tag);
  const isSubjectBLongSecurity = (question) => /科目B長文セキュリティ/.test(question.tag);
  const questions = [
    ...takeExamQuestions("algorithm", 12, isSubjectBLongAlgorithm),
    ...takeExamQuestions("algorithm", 4, isSubjectBAlgorithm),
    ...takeExamQuestions("technology", 4, isSubjectBLongSecurity)
  ];
  return shuffle(questions).map(withQuestionOrder);
}

const coverage = { A: new Set(), B: new Set() };
const counts = { A: [], B: [] };

for (let iteration = 1; iteration <= iterations; iteration += 1) {
  const subjectA = buildSubjectAExam();
  const subjectB = buildSubjectBExam();
  counts.A.push(subjectA.length);
  counts.B.push(subjectB.length);
  subjectA.forEach((question) => coverage.A.add(question.id));
  subjectB.forEach((question) => coverage.B.add(question.id));
  allFindings.push(...inspectExam("A", subjectA, iteration));
  allFindings.push(...inspectExam("B", subjectB, iteration));
}

const summary = {
  generatedAt: new Date().toISOString(),
  iterations,
  subjectAQuestionCounts: [...new Set(counts.A)].sort((a, b) => a - b),
  subjectBQuestionCounts: [...new Set(counts.B)].sort((a, b) => a - b),
  subjectAUniqueQuestionsSeen: coverage.A.size,
  subjectBUniqueQuestionsSeen: coverage.B.size,
  findingCount: allFindings.length,
  counts: allFindings.reduce((acc, finding) => {
    acc[finding.type] = (acc[finding.type] || 0) + 1;
    return acc;
  }, {}),
  samples: allFindings.slice(0, 20)
};

fs.writeFileSync("tools/full-exam-generation-report.json", JSON.stringify({ summary, findings: allFindings }, null, 2));
console.log(JSON.stringify(summary, null, 2));
