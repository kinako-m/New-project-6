const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "technology/セキュリティ",
  "management/サービス管理",
  "management/テスト",
  "strategy/経営戦略",
  "strategy/法務"
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

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question) => ({ ...question, stageId: stage.id }))
);

function normalize(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function family(text) {
  if (/に該当する用語はどれか/.test(text)) return "term";
  if (/の説明として/.test(text)) return "description";
  if (/を見分ける特徴として/.test(text)) return "feature";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^「(.+?)」に該当する用語はどれか。$/),
    text.match(/^(.+?)の説明として(?:最も)?適切なものはどれか。$/),
    text.match(/^(.+?)を見分ける特徴として最も適切なものはどれか。$/)
  ];
  return matches.find(Boolean)?.[1] || text;
}

const pools = new Map();
for (const question of questions) {
  const target = `${question.stageId}/${question.tag}`;
  const questionFamily = family(question.text);
  if (!TARGETS.has(target) || !questionFamily) continue;
  const key = `${target}/${questionFamily}`;
  if (!pools.has(key)) pools.set(key, []);
  pools.get(key).push({
    concept: concept(question.text),
    correct: choiceSets[question.text].correct
  });
}

const expanded = [];
const skipped = [];
for (const question of questions) {
  const target = `${question.stageId}/${question.tag}`;
  const definition = choiceSets[question.text];
  const questionFamily = family(question.text);
  if (!TARGETS.has(target) || !questionFamily || definition.distractors.length >= 6) continue;

  const currentConcept = concept(question.text);
  const existing = new Set([definition.correct, ...definition.distractors].map(normalize));
  const candidates = (pools.get(`${target}/${questionFamily}`) || [])
    .filter((candidate) => candidate.concept !== currentConcept)
    .map((candidate) => candidate.correct)
    .filter((candidate, index, values) => values.indexOf(candidate) === index)
    .filter((candidate) => !existing.has(normalize(candidate)));
  const additions = candidates.slice(0, 6 - definition.distractors.length);
  if (additions.length !== 6 - definition.distractors.length) {
    skipped.push({ text: question.text, target, needed: 6 - definition.distractors.length, found: additions.length });
    continue;
  }
  definition.distractors.push(...additions);
  expanded.push({ text: question.text, target, additions });
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
  expanded: expanded.length,
  byTarget: expanded.reduce((counts, item) => {
    counts[item.target] = (counts[item.target] || 0) + 1;
    return counts;
  }, {}),
  skipped
}, null, 2));
