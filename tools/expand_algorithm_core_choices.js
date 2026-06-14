const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "algorithm/\u63a2\u7d22",
  "algorithm/\u6574\u5217",
  "algorithm/\u8a08\u7b97\u91cf"
]);

const SPECIAL_DISTRACTORS = {
  "\u6607\u9806\u306b\u6574\u5217\u6e08\u307f\u306e\u914d\u5217\u304b\u3089\u5024\u3092\u63a2\u3059\u3068\u304d\u3001\u4e8c\u5206\u63a2\u7d22\u306e\u5e73\u5747\u7684\u306a\u8a08\u7b97\u91cf\u306f\u3069\u308c\u304b\u3002": [
    "O(1)", "O(\u221an)", "O(n)", "O(n log n)", "O(n\u00b2)", "O(2\u207f)"
  ],
  "\u30d0\u30d6\u30eb\u30bd\u30fc\u30c8\u306e\u57fa\u672c\u7684\u306a\u8003\u3048\u65b9\u306f\u3069\u308c\u304b\u3002": [
    "\u6700\u5c0f\u5024\u3092\u63a2\u3057\u3066\u672a\u6574\u5217\u90e8\u5206\u306e\u5148\u982d\u3078\u79fb\u3059",
    "\u6574\u5217\u6e08\u307f\u90e8\u5206\u3078\u8981\u7d20\u3092\u9069\u5207\u306a\u4f4d\u7f6e\u306b\u633f\u5165\u3059\u308b",
    "\u57fa\u6e96\u5024\u3067\u5206\u5272\u3057\u306a\u304c\u3089\u518d\u5e30\u7684\u306b\u6574\u5217\u3059\u308b",
    "\u5206\u5272\u3057\u305f\u5217\u3092\u6574\u5217\u3057\u306a\u304c\u3089\u4f75\u5408\u3059\u308b",
    "\u30d2\u30fc\u30d7\u3092\u69cb\u7bc9\u3057\u3066\u6700\u5927\u5024\u3092\u9806\u306b\u53d6\u308a\u51fa\u3059",
    "\u6841\u3054\u3068\u306b\u5206\u985e\u3057\u3066\u9806\u756a\u306b\u6574\u5217\u3059\u308b"
  ],
  "\u4e8c\u91cd\u30eb\u30fc\u30d7\u3067\u5916\u5074\u3082\u5185\u5074\u3082 n \u56de\u5b9f\u884c\u3055\u308c\u308b\u5358\u7d14\u306a\u51e6\u7406\u306e\u8a08\u7b97\u91cf\u306f\u3069\u308c\u304b\u3002": [
    "O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n\u00b3)", "O(2\u207f)"
  ],
  "\u7dda\u5f62\u63a2\u7d22\u306e\u7279\u5fb4\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306f\u3069\u308c\u304b\u3002": [
    "\u6574\u5217\u6e08\u307f\u30c7\u30fc\u30bf\u3092\u534a\u5206\u305a\u3064\u7d5e\u308a\u8fbc\u3093\u3067\u63a2\u3059",
    "\u30ad\u30fc\u304b\u3089\u683c\u7d0d\u4f4d\u7f6e\u3092\u8a08\u7b97\u3057\u3066\u63a2\u3059",
    "\u6728\u69cb\u9020\u3092\u6df1\u3055\u65b9\u5411\u306b\u305f\u3069\u3063\u3066\u63a2\u3059",
    "\u4e88\u6e2c\u3057\u305f\u4f4d\u7f6e\u304b\u3089\u6bd4\u8f03\u3092\u59cb\u3081\u308b",
    "\u30b4\u30fc\u30eb\u307e\u3067\u306e\u63a8\u5b9a\u8ddd\u96e2\u3092\u7528\u3044\u3066\u63a2\u3059",
    "\u59cb\u70b9\u3068\u7d42\u70b9\u306e\u4e21\u65b9\u5411\u304b\u3089\u63a2\u3059"
  ]
};

const LINEAR_SEARCH_FEATURE_DISTRACTORS = [
  "\u6574\u5217\u6e08\u307f\u30c7\u30fc\u30bf\u3092\u534a\u5206\u305a\u3064\u7d5e\u308a\u8fbc\u3093\u3067\u63a2\u3059",
  "\u30ad\u30fc\u304b\u3089\u683c\u7d0d\u4f4d\u7f6e\u3092\u8a08\u7b97\u3057\u3066\u63a2\u3059",
  "\u6728\u69cb\u9020\u3092\u6df1\u3055\u65b9\u5411\u306b\u305f\u3069\u3063\u3066\u63a2\u3059",
  "\u4e88\u6e2c\u3057\u305f\u4f4d\u7f6e\u304b\u3089\u6bd4\u8f03\u3092\u59cb\u3081\u308b",
  "\u30b4\u30fc\u30eb\u307e\u3067\u306e\u63a8\u5b9a\u8ddd\u96e2\u3092\u7528\u3044\u3066\u63a2\u3059",
  "\u59cb\u70b9\u3068\u7d42\u70b9\u306e\u4e21\u65b9\u5411\u304b\u3089\u63a2\u3059"
];

const FALLBACK_POOLS = {
  "algorithm/\u63a2\u7d22/term": [
    "\u88dc\u9593\u63a2\u7d22", "\u30b8\u30e3\u30f3\u30d7\u63a2\u7d22", "A*\u63a2\u7d22", "\u53cc\u65b9\u5411\u63a2\u7d22"
  ],
  "algorithm/\u63a2\u7d22/feature": [
    "\u5024\u306e\u5206\u5e03\u304b\u3089\u76ee\u7684\u5024\u306e\u4f4d\u7f6e\u3092\u4e88\u6e2c\u3059\u308b",
    "\u4e00\u5b9a\u9593\u9694\u3067\u98db\u3073\u306a\u304c\u3089\u63a2\u7d22\u7bc4\u56f2\u3092\u7d5e\u308b",
    "\u30b4\u30fc\u30eb\u307e\u3067\u306e\u63a8\u5b9a\u30b3\u30b9\u30c8\u3092\u7528\u3044\u308b",
    "\u59cb\u70b9\u3068\u7d42\u70b9\u306e\u4e21\u65b9\u304b\u3089\u63a2\u7d22\u3059\u308b"
  ],
  "algorithm/\u6574\u5217/term": [
    "\u30d2\u30fc\u30d7\u30bd\u30fc\u30c8", "\u30b7\u30a7\u30eb\u30bd\u30fc\u30c8", "\u57fa\u6570\u30bd\u30fc\u30c8", "\u30ab\u30a6\u30f3\u30c6\u30a3\u30f3\u30b0\u30bd\u30fc\u30c8"
  ],
  "algorithm/\u6574\u5217/feature": [
    "\u30d2\u30fc\u30d7\u304b\u3089\u6700\u5927\u5024\u307e\u305f\u306f\u6700\u5c0f\u5024\u3092\u9806\u306b\u53d6\u308a\u51fa\u3059",
    "\u9593\u9694\u3092\u7e2e\u3081\u306a\u304c\u3089\u96e2\u308c\u305f\u8981\u7d20\u3092\u6bd4\u8f03\u3059\u308b",
    "\u6570\u5024\u3092\u6841\u3054\u3068\u306b\u5206\u985e\u3059\u308b",
    "\u5024\u3054\u3068\u306e\u51fa\u73fe\u56de\u6570\u3092\u6570\u3048\u3066\u4e26\u3079\u308b"
  ],
  "algorithm/\u8a08\u7b97\u91cf/term": [
    "O(\u221an)", "O(n\u00b3)", "O(2\u207f)", "O(n!)"
  ],
  "algorithm/\u8a08\u7b97\u91cf/feature": [
    "\u5165\u529b\u4ef6\u6570\u306e\u5e73\u65b9\u6839\u306b\u6bd4\u4f8b\u3057\u3066\u5897\u3048\u308b",
    "\u4e09\u91cd\u306b\u5168\u4ef6\u3092\u51e6\u7406\u3059\u308b",
    "\u5165\u529b\u304c1\u5897\u3048\u308b\u3054\u3068\u306b\u51e6\u7406\u91cf\u304c\u304a\u304a\u3080\u306d2\u500d\u306b\u306a\u308b",
    "\u5165\u529b\u8981\u7d20\u306e\u4e26\u3079\u65b9\u3092\u3059\u3079\u3066\u8abf\u3079\u308b"
  ]
};

const source = fs.readFileSync("app.js", "utf8");
const dataSource = source.slice(0, source.indexOf("const els =")) + "\nresult = stages;";
const context = {
  result: null, console, explainChoice: () => "", getExplanationTip: () => "",
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
  if (/\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) return "feature";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^\u300c(.+?)\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066\u6700\u3082\u9069\u5207\u306a\u3082\u306f\u3069\u308c\u304b\u3002$/)
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
  const specialDistractors = question.text.startsWith("\u7dda\u5f62\u63a2\u7d22\u306e\u7279\u5fb4\u3068\u3057\u3066")
    ? LINEAR_SEARCH_FEATURE_DISTRACTORS
    : SPECIAL_DISTRACTORS[question.text];
  if (specialDistractors) {
    if (JSON.stringify(definition.distractors) !== JSON.stringify(specialDistractors)) {
      definition.distractors = [...specialDistractors];
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
    skipped.push({ text: question.text, target, family: questionFamily, needed: 6 - definition.distractors.length, found: additions.length });
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
