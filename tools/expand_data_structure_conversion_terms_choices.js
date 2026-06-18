const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "algorithm/\u30c7\u30fc\u30bf\u69cb\u9020",
  "technology/\u57fa\u6570\u5909\u63db",
  "technology/\u983b\u51fa\u7528\u8a9e"
]);

const FALLBACK_POOLS = {
  "algorithm/\u30c7\u30fc\u30bf\u69cb\u9020/term": [
    "\u914d\u5217",
    "\u30cf\u30c3\u30b7\u30e5\u8868",
    "\u30b0\u30e9\u30d5",
    "\u30c7\u30c3\u30af",
    "\u96c6\u5408"
  ],
  "algorithm/\u30c7\u30fc\u30bf\u69cb\u9020/feature": [
    "\u6dfb\u5b57\u3092\u7528\u3044\u3066\u4efb\u610f\u306e\u8981\u7d20\u306b\u76f4\u63a5\u30a2\u30af\u30bb\u30b9\u3059\u308b",
    "\u30ad\u30fc\u3068\u5024\u306e\u7d44\u3092\u683c\u7d0d\u3057\u3001\u30ad\u30fc\u304b\u3089\u5024\u3092\u63a2\u3059",
    "\u9802\u70b9\u3068\u8fba\u3067\u8981\u7d20\u9593\u306e\u95a2\u4fc2\u3092\u8868\u3059",
    "\u4e21\u7aef\u304b\u3089\u8981\u7d20\u306e\u8ffd\u52a0\u3068\u53d6\u51fa\u3057\u304c\u3067\u304d\u308b",
    "\u91cd\u8907\u3057\u306a\u3044\u8981\u7d20\u306e\u96c6\u307e\u308a\u3092\u7ba1\u7406\u3059\u308b"
  ],
  "technology/\u983b\u51fa\u7528\u8a9e/description": [
    "\u30c7\u30fc\u30bf\u306e\u9001\u53d7\u4fe1\u306b\u4f7f\u3046\u7aef\u672b\u5074\u306e\u8b58\u5225\u60c5\u5831",
    "\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u3092\u8ad6\u7406\u7684\u306b\u5206\u5272\u3059\u308b\u305f\u3081\u306e\u7bc4\u56f2\u6307\u5b9a",
    "\u30db\u30b9\u30c8\u540d\u304b\u3089IP\u30a2\u30c9\u30ec\u30b9\u3092\u5f97\u308b\u540d\u524d\u89e3\u6c7a\u306e\u4ed5\u7d44\u307f",
    "\u6697\u53f7\u5316\u3055\u308c\u305fWeb\u901a\u4fe1\u306b\u4f7f\u308f\u308c\u308b\u901a\u4fe1\u65b9\u5f0f",
    "\u30d7\u30e9\u30a4\u30d9\u30fc\u30c8IP\u30a2\u30c9\u30ec\u30b9\u3068\u30b0\u30ed\u30fc\u30d0\u30ebIP\u30a2\u30c9\u30ec\u30b9\u3092\u5909\u63db\u3059\u308b\u4ed5\u7d44\u307f"
  ]
};

const CHOICE_REPLACEMENTS = {
  "\u5404\u7bc0\u304c\u6700\u5927\u4e8c\u3064\u306e\u5b50\u3092\u6301\u3064": "\u5404\u7bc0\u70b9\u304c\u6700\u5927\u4e8c\u3064\u306e\u5b50\u3092\u6301\u3064\u69cb\u9020\u3067\u7ba1\u7406\u3059\u308b"
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
  if (/\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) return "feature";
  if (/\u306b\u3064\u3044\u3066\u6b63\u3057\u3044\u8aac\u660e\u306f\u3069\u308c\u304b\u3002$/.test(text)) return "description";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^\u300c(.+?)\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066\u6700\u3082\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u306b\u3064\u3044\u3066\u6b63\u3057\u3044\u8aac\u660e\u306f\u3069\u308c\u304b\u3002$/)
  ];
  return matches.find(Boolean)?.[1] || text;
}

function baseConversionDistractors(question, correct) {
  const match = question.match(/^2\u9032\u6570 ([01]+) \u309210\u9032\u6570\u3067\u8868\u3059\u3068\u3069\u308c\u304b\u3002$/);
  if (!match) return null;
  const value = Number(correct);
  const candidates = [
    value - 1,
    value + 1,
    value + 2,
    value * 2,
    value - 2,
    value + 4,
    Math.max(0, value - 4)
  ]
    .filter((candidate) => Number.isInteger(candidate) && candidate >= 0 && candidate !== value)
    .map(String);
  return candidates.filter((candidate, index, values) => values.indexOf(candidate) === index).slice(0, 6);
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
  if (CHOICE_REPLACEMENTS[definition.correct]) definition.correct = CHOICE_REPLACEMENTS[definition.correct];
  definition.distractors = definition.distractors.map((candidate) => CHOICE_REPLACEMENTS[candidate] || candidate);

  const numericDistractors = baseConversionDistractors(question.text, definition.correct);
  if (numericDistractors) {
    if (numericDistractors.length < 6) {
      skipped.push({ text: question.text, target, family: "numeric", needed: 6, found: numericDistractors.length });
      continue;
    }
    if (JSON.stringify(definition.distractors) !== JSON.stringify(numericDistractors)) {
      definition.distractors = numericDistractors;
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
