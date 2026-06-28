const fs = require("fs");
const vm = require("vm");
const roundArg = process.argv.find((arg) => arg.startsWith("--round="));
const round = Math.max(1, Number(roundArg?.split("=")[1]) || 1);
const sampleFractions = [0.5, 0.2, 0.8, 0.35, 0.65, 0.05, 0.95];
const sampleFraction = sampleFractions[(round - 1) % sampleFractions.length];

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

const sample = context.result.flatMap((stage) => {
  const count = 10;
  const step = stage.questions.length / count;
  return Array.from({ length: count }, (_, index) => {
    const question = stage.questions[Math.min(stage.questions.length - 1, Math.floor(index * step + step * sampleFraction))];
    return {
      stageId: stage.id,
      stageName: stage.name,
      sampleIndex: index + 1,
      tag: question.tag,
      difficulty: question.difficulty || "",
      question: question.text,
      choices: question.choices,
      correctIndex: question.answer,
      correctChoice: question.choices[question.answer],
      explanation: question.explanation || ""
    };
  });
});

const report = {
  generatedAt: new Date().toISOString(),
  round,
  method: `各分野を問題配列上で等間隔に10問抽出（区間内位置 ${sampleFraction}）`,
  questionCount: sample.length,
  questions: sample
};

const outputPath = round === 1 ? "tools/manual-audit-sample.json" : `tools/manual-audit-sample-round${round}.json`;
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ round, outputPath, questionCount: sample.length, stages: [...new Set(sample.map((item) => item.stageName))] }, null, 2));
