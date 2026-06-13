const choiceSets = require("../question-choice-sets.js");
const fs = require("fs");
const vm = require("vm");

function clean(value) {
  return String(value || "").normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

const findings = [];
Object.entries(choiceSets).forEach(([text, definition]) => {
  const distractors = Array.isArray(definition.distractors) ? definition.distractors : [];
  const normalized = distractors.map(clean);
  if (!String(definition.correct || "").trim()) findings.push({ type: "missing-correct", text });
  if (distractors.length < 3) findings.push({ type: "insufficient-distractors", text, count: distractors.length });
  if (distractors.length < 6) findings.push({ type: "recommended-pool-shortage", text, count: distractors.length });
  if (new Set(normalized).size !== normalized.length) findings.push({ type: "duplicate-distractors", text });
  if (normalized.includes(clean(definition.correct))) findings.push({ type: "correct-in-distractors", text });
});

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
const appQuestions = context.result.flatMap((stage) => stage.questions);
appQuestions.forEach((question) => {
  if (!choiceSets[question.text]) findings.push({ type: "missing-question-definition", text: question.text });
});
Object.keys(choiceSets).forEach((text) => {
  if (!appQuestions.some((question) => question.text === text)) findings.push({ type: "orphan-definition", text });
});

const counts = Object.fromEntries(
  [...new Set(findings.map((finding) => finding.type))].map((type) => [
    type,
    findings.filter((finding) => finding.type === type).length
  ])
);

console.log(
  JSON.stringify(
    {
      questionChoiceSets: Object.keys(choiceSets).length,
      appQuestions: appQuestions.length,
      hardErrors: findings.filter((finding) => finding.type !== "recommended-pool-shortage").length,
      counts,
      samples: findings.filter((finding) => finding.type !== "recommended-pool-shortage").slice(0, 20)
    },
    null,
    2
  )
);
