const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "strategy/\u4f1a\u8a08",
  "management/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8"
]);

const SPECIAL_DISTRACTORS = {
  "\u58f2\u4e0a\u9ad8\u304b\u3089\u58f2\u4e0a\u539f\u4fa1\u3092\u5dee\u3057\u5f15\u3044\u305f\u5229\u76ca\u306f\u3069\u308c\u304b\u3002": [
    "\u55b6\u696d\u5229\u76ca",
    "\u7d4c\u5e38\u5229\u76ca",
    "\u7a0e\u5f15\u524d\u5f53\u671f\u7d14\u5229\u76ca",
    "\u5f53\u671f\u7d14\u5229\u76ca",
    "\u9650\u754c\u5229\u76ca",
    "\u55b6\u696d\u30ad\u30e3\u30c3\u30b7\u30e5\u30d5\u30ed\u30fc"
  ]
};

const FALLBACK_POOLS = {
  "management/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8/term": [
    "\u30de\u30a4\u30eb\u30b9\u30c8\u30fc\u30f3",
    "\u30ea\u30b9\u30af\u767b\u9332\u7c3f",
    "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u61b2\u7ae0",
    "\u30d9\u30fc\u30b9\u30e9\u30a4\u30f3"
  ],
  "management/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8/description": [
    "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u4e0a\u306e\u91cd\u8981\u306a\u7bc0\u76ee\u3092\u8868\u3059\u3082\u306e\u3067\u3059\u3002",
    "\u7279\u5b9a\u3057\u305f\u30ea\u30b9\u30af\u3068\u5bfe\u5fdc\u72b6\u6cc1\u3092\u7ba1\u7406\u3059\u308b\u6587\u66f8\u3067\u3059\u3002",
    "\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u306e\u76ee\u7684\u3084\u8cac\u4efb\u8005\u3092\u6b63\u5f0f\u306b\u5b9a\u3081\u308b\u6587\u66f8\u3067\u3059\u3002",
    "\u9032\u6357\u3068\u5b9f\u7e3e\u3092\u6bd4\u8f03\u3059\u308b\u57fa\u6e96\u3068\u3057\u3066\u627f\u8a8d\u3055\u308c\u305f\u8a08\u753b\u3067\u3059\u3002"
  ],
  "management/\u30d7\u30ed\u30b8\u30a7\u30af\u30c8/feature": [
    "\u91cd\u8981\u306a\u5b8c\u4e86\u6642\u70b9\u3092\u793a\u3059",
    "\u30ea\u30b9\u30af\u306e\u767a\u751f\u78ba\u7387\u3084\u5f71\u97ff\u3068\u5bfe\u5fdc\u3092\u8a18\u9332\u3059\u308b",
    "\u30d7\u30ed\u30b8\u30a7\u30af\u306e\u958b\u59cb\u3092\u6b63\u5f0f\u306b\u627f\u8a8d\u3059\u308b",
    "\u627f\u8a8d\u6e08\u307f\u306e\u8a08\u753b\u3068\u5b9f\u7e3e\u306e\u5dee\u3092\u6e2c\u5b9a\u3059\u308b"
  ],
  "strategy/\u4f1a\u8a08/term": [
    "\u7d4c\u5e38\u5229\u76ca",
    "\u9650\u754c\u5229\u76ca",
    "\u6e1b\u4fa1\u511f\u5374\u8cbb",
    "ROE"
  ],
  "strategy/\u4f1a\u8a08/description": [
    "\u672c\u696d\u3068\u8ca1\u52d9\u6d3b\u52d5\u3092\u542b\u3080\u901a\u5e38\u306e\u4f01\u696d\u6d3b\u52d5\u3067\u5f97\u305f\u5229\u76ca\u3067\u3059\u3002",
    "\u58f2\u4e0a\u9ad8\u304b\u3089\u5909\u52d5\u8cbb\u3092\u5dee\u3057\u5f15\u3044\u305f\u5229\u76ca\u3067\u3059\u3002",
    "\u56fa\u5b9a\u8cc7\u7523\u306e\u53d6\u5f97\u4fa1\u984d\u3092\u4f7f\u7528\u671f\u9593\u306b\u914d\u5206\u3059\u308b\u8cbb\u7528\u3067\u3059\u3002",
    "\u81ea\u5df1\u8cc7\u672c\u306b\u5bfe\u3059\u308b\u5f53\u671f\u7d14\u5229\u76ca\u306e\u5272\u5408\u3067\u3059\u3002"
  ],
  "strategy/\u4f1a\u8a08/feature": [
    "\u901a\u5e38\u306e\u4f01\u696d\u6d3b\u52d5\u5168\u4f53\u306e\u53ce\u76ca\u6027\u3092\u898b\u308b",
    "\u58f2\u4e0a\u304c\u56fa\u5b9a\u8cbb\u306e\u56de\u53ce\u306b\u3069\u308c\u3060\u3051\u8ca2\u732e\u3059\u308b\u304b\u3092\u898b\u308b",
    "\u56fa\u5b9a\u8cc7\u7523\u306e\u4fa1\u5024\u3092\u671f\u9593\u914d\u5206\u3059\u308b",
    "\u682a\u4e3b\u304c\u62e0\u51fa\u3057\u305f\u8cc7\u672c\u306e\u53ce\u76ca\u6027\u3092\u898b\u308b"
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
