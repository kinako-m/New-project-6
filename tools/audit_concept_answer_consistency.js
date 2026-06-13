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

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question) => ({ ...question, stageId: stage.id, stageName: stage.name }))
);

function compact(value) {
  return String(value || "").normalize("NFKC").toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function concept(text) {
  const patterns = [
    /^「(.+?)」に該当する用語はどれか。$/,
    /^(.+?)の説明として最も適切なものはどれか。$/,
    /^(.+?)の説明として適切なものはどれか。$/,
    /^(.+?)を見分ける特徴として最も適切なものはどれか。$/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function bigrams(value) {
  const text = compact(value);
  const result = new Set();
  for (let index = 0; index < text.length - 1; index += 1) result.add(text.slice(index, index + 2));
  return result;
}

function similarity(left, right) {
  const a = bigrams(left);
  const b = bigrams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / new Set([...a, ...b]).size;
}

const groups = new Map();
for (const question of questions) {
  const name = concept(question.text);
  if (!name) continue;
  const key = `${question.stageId}/${question.tag}/${name}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({
    text: question.text,
    correct: choiceSets[question.text].correct,
    distractors: choiceSets[question.text].distractors
  });
}

const findings = [];
for (const [key, items] of groups) {
  if (items.length < 2) continue;
  for (const item of items) {
    for (const other of items) {
      if (item === other) continue;
      const otherCorrect = compact(other.correct);
      const matchingDistractor = item.distractors.find((choice) => compact(choice) === otherCorrect);
      if (matchingDistractor) {
        findings.push({
          key,
          type: "sibling-correct-used-as-distractor",
          question: item.text,
          correct: item.correct,
          conflictingQuestion: other.text,
          conflictingCorrect: other.correct,
          matchingDistractor
        });
      }
      for (const distractor of item.distractors) {
        if (compact(distractor) === otherCorrect) continue;
        const score = similarity(distractor, other.correct);
        if (score >= 0.82) {
          findings.push({
            key,
            type: "sibling-correct-near-distractor",
            question: item.text,
            correct: item.correct,
            conflictingQuestion: other.text,
            conflictingCorrect: other.correct,
            matchingDistractor: distractor,
            similarity: Number(score.toFixed(2))
          });
        }
      }
    }
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  conceptGroups: groups.size,
  multiQuestionGroups: [...groups.values()].filter((items) => items.length >= 2).length,
  findingCount: findings.length,
  findings
};
fs.writeFileSync("tools/concept-answer-consistency-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
