const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "strategy/\u6cd5\u52d9",
  "strategy/\u30b7\u30b9\u30c6\u30e0\u6226\u7565",
  "strategy/\u7d4c\u55b6\u983b\u51fa"
]);

const SPECIAL_DISTRACTORS = {
  "\u500b\u4eba\u60c5\u5831\u4fdd\u8b77\u6cd5\u3067\u4fdd\u8b77\u5bfe\u8c61\u3068\u306a\u308b\u60c5\u5831\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u5275\u4f5c\u7684\u306a\u8868\u73fe\u3092\u4fdd\u8b77\u3059\u308b\u6a29\u5229",
    "\u767a\u660e\u3092\u4fdd\u8b77\u3059\u308b\u7523\u696d\u8ca1\u7523\u6a29",
    "\u5546\u54c1\u3084\u30b5\u30fc\u30d3\u30b9\u306e\u8b58\u5225\u6a19\u8b58\u3092\u4fdd\u8b77\u3059\u308b\u6a29\u5229",
    "\u88fd\u54c1\u306e\u30c7\u30b6\u30a4\u30f3\u3092\u4fdd\u8b77\u3059\u308b\u6a29\u5229",
    "\u55b6\u696d\u4e0a\u306e\u79d8\u5bc6\u3068\u3057\u3066\u7ba1\u7406\u3055\u308c\u308b\u6280\u8853\u60c5\u5831",
    "\u6cd5\u4eba\u306e\u4f1a\u793e\u540d\u3060\u3051\u3092\u793a\u3059\u516c\u958b\u60c5\u5831"
  ],
  "\u696d\u52d9\u30d7\u30ed\u30bb\u30b9\u3092\u629c\u672c\u7684\u306b\u898b\u76f4\u3057\u518d\u8a2d\u8a08\u3059\u308b\u8003\u3048\u65b9\u306f\u3069\u308c\u304b\u3002": [
    "BPM", "ERP", "BPO", "CRM", "SCM", "RFP"
  ]
};

const FALLBACK_POOLS = {
  "strategy/\u6cd5\u52d9/term": [
    "\u610f\u5320\u6a29",
    "\u4e0d\u6b63\u7af6\u4e89\u9632\u6b62\u6cd5",
    "\u8acb\u8ca0\u5951\u7d04",
    "\u6e96\u59d4\u4efb\u5951\u7d04",
    "\u55b6\u696d\u79d8\u5bc6"
  ],
  "strategy/\u6cd5\u52d9/feature": [
    "\u88fd\u54c1\u306a\u3069\u306e\u30c7\u30b6\u30a4\u30f3\u3092\u4fdd\u8b77\u3059\u308b",
    "\u4ed6\u793e\u306e\u5546\u54c1\u7b49\u8868\u793a\u306e\u4e0d\u6b63\u5229\u7528\u3092\u9632\u3050",
    "\u5b8c\u6210\u3057\u305f\u4ed5\u4e8b\u306e\u7d50\u679c\u306b\u5bfe\u3057\u3066\u5831\u916c\u3092\u652f\u6255\u3046",
    "\u4e8b\u52d9\u51e6\u7406\u306e\u904e\u7a0b\u306b\u5584\u7ba1\u6ce8\u610f\u7fa9\u52d9\u3092\u8ca0\u3046",
    "\u79d8\u5bc6\u3068\u3057\u3066\u7ba1\u7406\u3055\u308c\u6709\u7528\u3067\u516c\u7136\u3068\u77e5\u3089\u308c\u3066\u3044\u306a\u3044"
  ],
  "strategy/\u30b7\u30b9\u30c6\u30e0\u6226\u7565/description": [
    "\u696d\u52d9\u30d7\u30ed\u30bb\u30b9\u3092\u629c\u672c\u7684\u306b\u898b\u76f4\u3057\u518d\u8a2d\u8a08\u3059\u308b\u8003\u3048\u65b9",
    "\u696d\u52d9\u306e\u4e00\u90e8\u3092\u5916\u90e8\u306e\u5c02\u9580\u4e8b\u696d\u8005\u306b\u59d4\u8a17\u3059\u308b\u3053\u3068",
    "\u81ea\u793e\u3067\u30b5\u30fc\u30d0\u3084\u30bd\u30d5\u30c8\u3092\u6240\u6709\u3057\u904b\u7528\u3059\u308b\u5f62\u614b",
    "\u30a2\u30d7\u30ea\u5b9f\u884c\u57fa\u76e4\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5229\u7528\u3059\u308b\u5f62\u614b",
    "\u30b5\u30fc\u30d0\u3084\u30b9\u30c8\u30ec\u30fc\u30b8\u306a\u3069\u306e\u57fa\u76e4\u3092\u30b5\u30fc\u30d3\u30b9\u3068\u3057\u3066\u5229\u7528\u3059\u308b\u5f62\u614b"
  ],
  "strategy/\u7d4c\u55b6\u983b\u51fa/description": [
    "\u9867\u5ba2\u3092\u4e00\u5ea6\u7372\u5f97\u3057\u305f\u5f8c\u306e\u7d99\u7d9a\u7387\u3092\u9ad8\u3081\u3066\u53ce\u76ca\u3092\u5b89\u5b9a\u3055\u305b\u308b\u8003\u3048\u65b9",
    "\u7d4c\u55b6\u8cc7\u6e90\u3092\u4fa1\u5024\u30fb\u5e0c\u5c11\u6027\u30fb\u6a21\u5023\u56f0\u96e3\u6027\u30fb\u7d44\u7e54\u306e\u8996\u70b9\u3067\u5206\u6790\u3059\u308b\u624b\u6cd5",
    "\u653f\u6cbb\u30fb\u7d4c\u6e08\u30fb\u793e\u4f1a\u30fb\u6280\u8853\u306e\u5916\u90e8\u74b0\u5883\u3092\u5206\u6790\u3059\u308b\u624b\u6cd5",
    "\u8ca1\u52d9\u30fb\u9867\u5ba2\u30fb\u696d\u52d9\u30d7\u30ed\u30bb\u30b9\u30fb\u5b66\u7fd2\u3068\u6210\u9577\u306e\u8996\u70b9\u3067\u696d\u7e3e\u3092\u8a55\u4fa1\u3059\u308b\u624b\u6cd5",
    "\u81ea\u793e\u306e\u5f37\u307f\u3092\u751f\u304b\u3057\u3066\u4ed6\u793e\u3068\u5dee\u5225\u5316\u3059\u308b\u65b9\u91dd"
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
  if (/\u306e\u8aac\u660e(?:\u3068\u3057\u3066\u6700\u3082\u9069\u5207\u306a\u3082\u306e)?\u306f\u3069\u308c\u304b\u3002$/.test(text)) return "description";
  if (/\u3092\u898b\u5206\u3051\u308b\u7279\u5fb4\u3068\u3057\u3066/.test(text)) return "feature";
  return null;
}

function concept(text) {
  const matches = [
    text.match(/^\u300c(.+?)\u300d\u306b\u8a72\u5f53\u3059\u308b\u7528\u8a9e\u306f\u3069\u308c\u304b\u3002$/),
    text.match(/^(.+?)\u306e\u8aac\u660e(?:\u3068\u3057\u3066\u6700\u3082\u9069\u5207\u306a\u3082\u306e)?\u306f\u3069\u308c\u304b\u3002$/),
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
