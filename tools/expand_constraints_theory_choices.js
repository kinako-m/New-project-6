const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "database/\u5236\u7d04",
  "technology/\u57fa\u790e\u7406\u8ad6"
]);

const SPECIAL_DISTRACTORS = {
  "2\u9032\u6570 101101 \u309210\u9032\u6570\u3067\u8868\u3059\u3068\u3069\u308c\u304b\u3002": [
    "37",
    "41",
    "43",
    "44",
    "46",
    "53"
  ]
};

const FALLBACK_POOLS = {
  "database/\u5236\u7d04/term": [
    "DEFAULT\u5236\u7d04",
    "\u30c9\u30e1\u30a4\u30f3\u5236\u7d04",
    "\u8868\u30ec\u30d9\u30eb\u5236\u7d04"
  ],
  "database/\u5236\u7d04/description": [
    "\u5024\u304c\u6307\u5b9a\u3055\u308c\u306a\u3044\u5834\u5408\u306b\u521d\u671f\u5024\u3092\u8a2d\u5b9a\u3059\u308b\u5236\u7d04\u3067\u3059\u3002",
    "\u5217\u306b\u683c\u7d0d\u3067\u304d\u308b\u30c7\u30fc\u30bf\u578b\u3084\u5024\u306e\u96c6\u5408\u3092\u5236\u9650\u3059\u308b\u5236\u7d04\u3067\u3059\u3002",
    "\u8907\u6570\u306e\u5217\u306e\u95a2\u4fc2\u3092\u8868\u5168\u4f53\u306b\u5bfe\u3057\u3066\u691c\u67fb\u3059\u308b\u5236\u7d04\u3067\u3059\u3002"
  ],
  "database/\u5236\u7d04/feature": [
    "\u672a\u5165\u529b\u6642\u306b\u521d\u671f\u5024\u3092\u8a2d\u5b9a\u3059\u308b",
    "\u5217\u306b\u683c\u7d0d\u3067\u304d\u308b\u5024\u306e\u96c6\u5408\u3092\u5236\u9650\u3059\u308b",
    "\u8907\u6570\u5217\u306b\u307e\u305f\u304c\u308b\u6761\u4ef6\u3092\u691c\u67fb\u3059\u308b"
  ],
  "technology/\u57fa\u790e\u7406\u8ad6/description": [
    "\u5165\u529b\u3055\u308c\u305f\u4e8c\u3064\u306e\u5024\u304c\u3069\u3061\u3089\u3082\u771f\u306e\u3068\u304d\u3060\u3051\u771f\u306b\u306a\u308b\u8ad6\u7406\u6f14\u7b97",
    "\u4e8b\u8c61\u306e\u767a\u751f\u78ba\u7387\u3092\u7528\u3044\u3066\u5e73\u5747\u7684\u306a\u7d50\u679c\u3092\u8868\u3059\u5024",
    "\u30c7\u30fc\u30bf\u306e\u4e2d\u5fc3\u7684\u306a\u50be\u5411\u3092\u4e2d\u592e\u306e\u5024\u3067\u8868\u3059\u6307\u6a19",
    "\u30c7\u30fc\u30bf\u3092\u5c0f\u3055\u3044\u9806\u306b\u4e26\u3079\u305f\u3068\u304d\u306e\u4e2d\u592e\u306b\u4f4d\u7f6e\u3059\u308b\u5024",
    "\u9650\u3089\u308c\u305f\u8cc7\u6e90\u3092\u6700\u3082\u52b9\u679c\u7684\u306b\u914d\u5206\u3059\u308b\u6761\u4ef6\u3092\u6c42\u3081\u308b\u624b\u6cd5",
    "\u72b6\u614b\u3068\u72b6\u614b\u9593\u306e\u9077\u79fb\u3067\u30b7\u30b9\u30c6\u30e0\u306e\u632f\u308b\u821e\u3044\u3092\u8868\u3059\u30e2\u30c7\u30eb"
  ]
};

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
  if (/^\u300c.+\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/.test(text)) return "term";
  if (/\u306e\u8aac\u660e\u3068\u3057\u3066/.test(text)) return "description";
  if (/\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) return "feature";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^\u300c(.+?)\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u306e\u8aac\u660e\u3068\u3057\u3066(?:\u6700\u3082)?\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066\u6700\u3082\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002$/)
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
  pools.get(key).push({ concept: concept(question.text), correct: choiceSets[question.text].correct });
}

const expanded = [];
const skipped = [];
for (const question of questions) {
  const target = `${question.stageId}/${question.tag}`;
  if (!TARGETS.has(target)) continue;
  const definition = choiceSets[question.text];
  if (SPECIAL_DISTRACTORS[question.text]) {
    if (JSON.stringify(definition.distractors) !== JSON.stringify(SPECIAL_DISTRACTORS[question.text])) {
      definition.distractors = [...SPECIAL_DISTRACTORS[question.text]];
      expanded.push({ text: question.text, target });
    }
    continue;
  }

  const questionFamily = family(question.text);
  if (!questionFamily || definition.distractors.length >= 6) continue;
  const existing = new Set([definition.correct, ...definition.distractors].map(normalize));
  const poolKey = `${target}/${questionFamily}`;
  const additions = [
    ...(pools.get(poolKey) || [])
      .filter((item) => item.concept !== concept(question.text))
      .map((item) => item.correct),
    ...(FALLBACK_POOLS[poolKey] || [])
  ]
    .filter((candidate, index, values) => values.indexOf(candidate) === index)
    .filter((candidate) => !existing.has(normalize(candidate)))
    .slice(0, 6 - definition.distractors.length);
  if (additions.length !== 6 - definition.distractors.length) {
    skipped.push({
      text: question.text,
      target,
      family: questionFamily,
      needed: 6 - definition.distractors.length,
      found: additions.length
    });
    continue;
  }
  definition.distractors.push(...additions);
  expanded.push({ text: question.text, target });
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
  targetQuestions: questions.filter((question) => TARGETS.has(`${question.stageId}/${question.tag}`)).length,
  expanded: expanded.length,
  byTarget: expanded.reduce((counts, item) => {
    counts[item.target] = (counts[item.target] || 0) + 1;
    return counts;
  }, {}),
  skipped
}, null, 2));
