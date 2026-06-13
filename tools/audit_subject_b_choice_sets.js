const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

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

const questions = context.result
  .flatMap((stage) => stage.questions.map((question) => ({ ...question, stageId: stage.id })))
  .filter((question) => /科目B長文/.test(question.tag))
  .map((question) => ({
    text: question.text,
    tag: question.tag,
    correct: choiceSets[question.text].correct,
    distractors: choiceSets[question.text].distractors
  }));

console.log(JSON.stringify({
  total: questions.length,
  distribution: questions.reduce((counts, question) => {
    counts[question.distractors.length] = (counts[question.distractors.length] || 0) + 1;
    return counts;
  }, {}),
  short: questions.filter((question) => question.distractors.length < 6)
}, null, 2));
