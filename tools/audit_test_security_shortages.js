const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "management/\u30c6\u30b9\u30c8",
  "technology/\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3"
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
  .filter((question) => TARGETS.has(`${question.stageId}/${question.tag}`))
  .map((question) => ({
    stageId: question.stageId,
    tag: question.tag,
    text: question.text,
    correct: choiceSets[question.text].correct,
    distractors: choiceSets[question.text].distractors
  }));

console.log(JSON.stringify({
  total: rows.length,
  short: rows.filter((row) => row.distractors.length < 6).length,
  rows
}, null, 2));
