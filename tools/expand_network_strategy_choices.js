const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "technology/\u30cd\u30c3\u30c8\u30ef\u30fc\u30af",
  "strategy/\u7d4c\u55b6\u6226\u7565"
]);

const SPECIAL_DISTRACTORS = {
  "HTTP\u30b9\u30c6\u30fc\u30bf\u30b9\u30b3\u30fc\u30c9 404 \u304c\u8868\u3059\u72b6\u614b\u306f\u3069\u308c\u304b\u3002": [
    "\u8981\u6c42\u306f\u6b63\u5e38\u306b\u51e6\u7406\u3055\u308c\u305f",
    "\u8981\u6c42\u3057\u305f\u8cc7\u6e90\u306f\u6c38\u7d9a\u7684\u306b\u79fb\u52d5\u3057\u305f",
    "\u8981\u6c42\u306e\u5f62\u5f0f\u304c\u4e0d\u6b63\u3067\u3042\u308b",
    "\u8a8d\u8a3c\u304c\u5fc5\u8981\u3067\u3042\u308b",
    "\u8cc7\u6e90\u3078\u306e\u30a2\u30af\u30bb\u30b9\u304c\u62d2\u5426\u3055\u308c\u305f",
    "\u30b5\u30fc\u30d0\u5185\u90e8\u3067\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u305f"
  ],
  "SWOT\u5206\u6790\u3067\u3001\u81ea\u793e\u306e\u5185\u90e8\u74b0\u5883\u306b\u5206\u985e\u3055\u308c\u308b\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u6a5f\u4f1a\u3068\u8105\u5a01",
    "\u5f37\u307f\u3068\u6a5f\u4f1a",
    "\u5f31\u307f\u3068\u8105\u5a01",
    "\u5f37\u307f\u3068\u8105\u5a01",
    "\u5f31\u307f\u3068\u6a5f\u4f1a",
    "\u5e02\u5834\u6210\u9577\u7387\u3068\u5e02\u5834\u5360\u6709\u7387"
  ]
};

const FALLBACK_POOLS = {
  "strategy/\u7d4c\u55b6\u6226\u7565/term": [
    "VRIO\u5206\u6790",
    "PEST\u5206\u6790",
    "\u30a2\u30f3\u30be\u30d5\u306e\u6210\u9577\u30de\u30c8\u30ea\u30af\u30b9",
    "\u30d0\u30e9\u30f3\u30b9\u30c8\u30b9\u30b3\u30a2\u30ab\u30fc\u30c9"
  ],
  "strategy/\u7d4c\u55b6\u6226\u7565/feature": [
    "\u7d4c\u55b6\u8cc7\u6e90\u3092\u4fa1\u5024\u30fb\u5e0c\u5c11\u6027\u30fb\u6a21\u5023\u56f0\u96e3\u6027\u30fb\u7d44\u7e54\u306e\u8996\u70b9\u3067\u8a55\u4fa1\u3059\u308b",
    "\u653f\u6cbb\u30fb\u7d4c\u6e08\u30fb\u793e\u4f1a\u30fb\u6280\u8853\u306e\u5916\u90e8\u74b0\u5883\u3092\u5206\u6790\u3059\u308b",
    "\u88fd\u54c1\u3068\u5e02\u5834\u306e\u65b0\u65e7\u3067\u6210\u9577\u6226\u7565\u3092\u5206\u985e\u3059\u308b",
    "\u8ca1\u52d9\u30fb\u9867\u5ba2\u30fb\u696d\u52d9\u30d7\u30ed\u30bb\u30b9\u30fb\u5b66\u7fd2\u3068\u6210\u9577\u306e\u8996\u70b9\u3067\u696d\u7e3e\u3092\u8a55\u4fa1\u3059\u308b"
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
