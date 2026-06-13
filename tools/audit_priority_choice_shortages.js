const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "擬似言語",
  "トレース",
  "頻出計算",
  "SQL",
  "正規化"
]);

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

const rows = context.result
  .flatMap((stage) => stage.questions.map((question) => ({ ...question, stageId: stage.id })))
  .filter((question) => TARGETS.has(question.tag))
  .map((question) => ({
    stageId: question.stageId,
    tag: question.tag,
    text: question.text,
    correct: choiceSets[question.text].correct,
    distractors: choiceSets[question.text].distractors
  }));

const summary = {};
for (const row of rows) {
  const key = `${row.stageId}/${row.tag}`;
  summary[key] ||= { total: 0, short: 0, six: 0 };
  summary[key].total += 1;
  if (row.distractors.length < 6) summary[key].short += 1;
  else summary[key].six += 1;
}

console.log(JSON.stringify({
  total: rows.length,
  short: rows.filter((row) => row.distractors.length < 6).length,
  summary,
  shortages: rows.filter((row) => row.distractors.length < 6)
}, null, 2));
