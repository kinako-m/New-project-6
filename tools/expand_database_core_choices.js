const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set(["database/\u30ad\u30fc", "database/DB\u983b\u51fa", "database/SQL\u8aad\u89e3"]);

const SPECIAL_DISTRACTORS = {
  "\u8868\u306e\u5404\u884c\u3092\u4e00\u610f\u306b\u8b58\u5225\u3059\u308b\u305f\u3081\u306e\u9805\u76ee\u306f\u3069\u308c\u304b\u3002": [
    "\u5916\u90e8\u30ad\u30fc", "\u5019\u88dc\u30ad\u30fc", "\u8907\u5408\u30ad\u30fc", "\u4ee3\u7406\u30ad\u30fc", "\u4e00\u610f\u30ad\u30fc", "\u975e\u30ad\u30fc\u5c5e\u6027"
  ],
  "\u9867\u5ba2\u8868\u304b\u3089\u6c0f\u540d\u5217\u3060\u3051\u3092\u53d6\u308a\u51fa\u3059\u64cd\u4f5c\u306f\u3069\u308c\u304b\u3002": [
    "\u9078\u629e", "\u7d50\u5408", "\u548c\u96c6\u5408", "\u5dee\u96c6\u5408", "\u76f4\u7a4d", "\u5171\u901a\u96c6\u5408"
  ],
  "\u9867\u5ba2\u8868\u304b\u3089\u6771\u4eac\u90fd\u306e\u884c\u3060\u3051\u3092\u53d6\u308a\u51fa\u3059\u64cd\u4f5c\u306f\u3069\u308c\u304b\u3002": [
    "\u5c04\u5f71", "\u7d50\u5408", "\u5dee\u96c6\u5408", "\u548c\u96c6\u5408", "\u76f4\u7a4d", "\u91cd\u8907\u6392\u9664"
  ],
  "\u4e8c\u3064\u306e\u8868\u3092\u5171\u901a\u5217\u3067\u5bfe\u5fdc\u4ed8\u3051\u308b\u64cd\u4f5c\u306f\u3069\u308c\u304b\u3002": [
    "\u9078\u629e", "\u5c04\u5f71", "\u76f4\u7a4d", "\u548c\u96c6\u5408", "\u5dee\u96c6\u5408", "\u91cd\u8907\u6392\u9664"
  ],
  "\u8868\u304b\u3089\u91cd\u8907\u884c\u3092\u53d6\u308a\u9664\u304f\u96c6\u5408\u6f14\u7b97\u306f\u3069\u308c\u304b\u3002": [
    "\u7d50\u5408", "\u5c04\u5f71", "\u9078\u629e", "\u76f4\u7a4d", "\u5dee\u96c6\u5408", "\u5171\u901a\u96c6\u5408"
  ],
  "\u58f2\u4e0a\u8868\u304b\u3089\u5546\u54c1\u3054\u3068\u306e\u58f2\u4e0a\u5408\u8a08\u3092\u6c42\u3081\u308bSQL\u3067\u5fc5\u8981\u306a\u6307\u5b9a\u306f\u3069\u308c\u304b\u3002": [
    "ORDER BY \u5546\u54c1", "WHERE \u5546\u54c1", "HAVING \u5546\u54c1", "SELECT \u5546\u54c1", "JOIN \u5546\u54c1", "DISTINCT \u5546\u54c1"
  ],
  "WHERE\u53e5\u3068HAVING\u53e5\u306e\u9055\u3044\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "WHERE\u306f\u4e26\u3079\u66ff\u3048\u3001HAVING\u306f\u5217\u540d\u306e\u5225\u540d\u3092\u4ed8\u3051\u308b",
    "WHERE\u306f\u8868\u3092\u7d50\u5408\u3057\u3001HAVING\u306f\u884c\u3092\u633f\u5165\u3059\u308b",
    "WHERE\u306f\u66f4\u65b0\u3092\u78ba\u5b9a\u3057\u3001HAVING\u306f\u66f4\u65b0\u3092\u53d6\u308a\u6d88\u3059",
    "WHERE\u306f\u96c6\u8a08\u5f8c\u3001HAVING\u306f\u96c6\u8a08\u524d\u306e\u884c\u306b\u6761\u4ef6\u3092\u4ed8\u3051\u308b",
    "WHERE\u306f\u30b0\u30eb\u30fc\u30d7\u5316\u3001HAVING\u306f\u4e26\u3079\u66ff\u3048\u3092\u6307\u5b9a\u3059\u308b",
    "WHERE\u306f\u5217\u306e\u9078\u629e\u3001HAVING\u306f\u8868\u306e\u4f5c\u6210\u3092\u884c\u3046"
  ],
  "\u6ce8\u6587\u8868\u3067\u6ce8\u6587ID\u3060\u3051\u3067\u306f\u5546\u54c1\u3092\u4e00\u610f\u306b\u8b58\u5225\u3067\u304d\u305a\u3001\u6ce8\u6587ID\u3068\u5546\u54c1ID\u306e\u7d44\u3067\u4e00\u610f\u306b\u306a\u308b\u3002\u3053\u306e\u30ad\u30fc\u306f\u3069\u308c\u304b\u3002": [
    "\u4e3b\u30ad\u30fc", "\u5916\u90e8\u30ad\u30fc", "\u5019\u88dc\u30ad\u30fc", "\u4ee3\u7406\u30ad\u30fc", "\u4e00\u610f\u30ad\u30fc", "\u975e\u30ad\u30fc\u5c5e\u6027"
  ],
  "\u5546\u54c1\u540d\u304c\u5546\u54c1ID\u306b\u4f9d\u5b58\u3057\u3001\u6ce8\u6587ID\u306b\u306f\u4f9d\u5b58\u3057\u306a\u3044\u3002\u6ce8\u6587ID\u3068\u5546\u54c1ID\u306e\u8907\u5408\u30ad\u30fc\u8868\u3067\u8d77\u304d\u308b\u554f\u984c\u306f\u3069\u308c\u304b\u3002": [
    "\u63a8\u79fb\u7684\u95a2\u6570\u5f93\u5c5e", "\u5b8c\u5168\u95a2\u6570\u5f93\u5c5e", "\u591a\u5024\u5f93\u5c5e", "\u7e70\u8fd4\u3057\u9805\u76ee", "\u975e\u6b63\u898f\u5f62", "\u53c2\u7167\u6574\u5408\u6027\u9055\u53cd"
  ],
  "\u90e8\u7f72\u540d\u304c\u90e8\u7f72ID\u306b\u4f9d\u5b58\u3057\u3001\u793e\u54e1ID\u304b\u3089\u90e8\u7f72ID\u304c\u6c7a\u307e\u308b\u3068\u304d\u3001\u793e\u54e1ID\u304b\u3089\u90e8\u7f72\u540d\u304c\u9593\u63a5\u7684\u306b\u6c7a\u307e\u308b\u95a2\u4fc2\u306f\u3069\u308c\u304b\u3002": [
    "\u90e8\u5206\u95a2\u6570\u5f93\u5c5e", "\u5b8c\u5168\u95a2\u6570\u5f93\u5c5e", "\u591a\u5024\u5f93\u5c5e", "\u7e70\u8fd4\u3057\u9805\u76ee", "\u7b2c1\u6b63\u898f\u5f62", "\u5019\u88dc\u30ad\u30fc"
  ],
  "\u66f4\u65b0\u9014\u4e2d\u306e\u30c7\u30fc\u30bf\u3092\u4ed6\u306e\u51e6\u7406\u304c\u8aad\u307e\u306a\u3044\u3088\u3046\u306b\u3059\u308b\u5236\u5fa1\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u30ed\u30fc\u30eb\u30d0\u30c3\u30af", "\u30b3\u30df\u30c3\u30c8", "\u6b63\u898f\u5316", "\u30a4\u30f3\u30c7\u30c3\u30af\u30b9", "\u30d0\u30c3\u30af\u30a2\u30c3\u30d7", "\u30ec\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3"
  ],
  "\u8aa4\u3063\u3066\u66f4\u65b0\u3057\u305f\u76f4\u5f8c\u3001\u307e\u3060COMMIT\u3057\u3066\u3044\u306a\u3044\u3002\u66f4\u65b0\u3092\u53d6\u308a\u6d88\u3059\u64cd\u4f5c\u306f\u3069\u308c\u304b\u3002": [
    "COMMIT", "SAVEPOINT", "LOCK", "GRANT", "REVOKE", "CHECKPOINT"
  ],
  "\u691c\u7d22\u983b\u5ea6\u304c\u9ad8\u3044\u5217\u306b\u30a4\u30f3\u30c7\u30c3\u30af\u30b9\u3092\u4f5c\u6210\u3059\u308b\u4e3b\u306a\u52b9\u679c\u306f\u3069\u308c\u304b\u3002": [
    "\u53c2\u7167\u6574\u5408\u6027\u306e\u81ea\u52d5\u4fdd\u8a3c", "\u30c7\u30fc\u30bf\u306e\u81ea\u52d5\u6697\u53f7\u5316", "\u30c6\u30fc\u30d6\u30eb\u5bb9\u91cf\u306e\u5fc5\u305a\u306e\u524a\u6e1b", "\u66f4\u65b0\u51e6\u7406\u306e\u5fc5\u305a\u306e\u9ad8\u901f\u5316", "\u91cd\u8907\u884c\u306e\u81ea\u52d5\u524a\u9664", "\u30c8\u30e9\u30f3\u30b6\u30af\u30b7\u30e7\u30f3\u306e\u81ea\u52d5\u78ba\u5b9a"
  ]
};

const FALLBACK_POOLS = {
  "database/\u30ad\u30fc/term": ["\u4ee3\u7406\u30ad\u30fc", "\u4e00\u610f\u30ad\u30fc", "\u975e\u30ad\u30fc\u5c5e\u6027"],
  "database/\u30ad\u30fc/feature": [
    "\u4ee3\u66ff\u3068\u3057\u3066\u4eba\u5de5\u7684\u306b\u5272\u308a\u5f53\u3066\u305f\u5024\u3067\u8b58\u5225\u3059\u308b",
    "\u91cd\u8907\u3092\u8a31\u3055\u306a\u3044\u5217\u307e\u305f\u306f\u5217\u306e\u7d44\u5408\u305b\u3067\u7ba1\u7406\u3059\u308b",
    "\u884c\u306e\u8b58\u5225\u306b\u76f4\u63a5\u306f\u4f7f\u308f\u306a\u3044\u5c5e\u6027\u3067\u3042\u308b"
  ],
  "database/DB\u983b\u51fa/description": [
    "\u30c8\u30e9\u30f3\u30b6\u30af\u30b7\u30e7\u30f3\u306e\u66f4\u65b0\u3092\u78ba\u5b9a\u3059\u308b\u51e6\u7406",
    "\u30c8\u30e9\u30f3\u30b6\u30af\u30b7\u30e7\u30f3\u306e\u672a\u78ba\u5b9a\u66f4\u65b0\u3092\u53d6\u308a\u6d88\u3059\u51e6\u7406",
    "\u691c\u7d22\u3092\u9ad8\u901f\u5316\u3059\u308b\u305f\u3081\u306b\u5217\u306b\u4f5c\u6210\u3059\u308b\u7d22\u5f15\u60c5\u5831"
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
  if (/\u306e\u8aac\u660e\u3068\u3057\u3066/.test(text) || /\u306e\u76ee\u7684\u306f\u3069\u308c\u304b\u3002$/.test(text) || /\u4e3b\u306a\u76ee\u7684\u306f\u3069\u308c\u304b\u3002$/.test(text)) return "description";
  if (/\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) return "feature";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^\u300c(.+?)\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/),
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
  const special = SPECIAL_DISTRACTORS[question.text];
  if (special) {
    if (JSON.stringify(definition.distractors) !== JSON.stringify(special)) {
      definition.distractors = [...special];
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
