const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "algorithm/\u5b9f\u6226\u30c8\u30ec\u30fc\u30b9",
  "algorithm/\u79d1\u76eeB\u30a2\u30eb\u30b4\u30ea\u30ba\u30e0",
  "algorithm/\u983b\u51fa\u51e6\u7406"
]);

const SPECIAL_DISTRACTORS = {
  "\u914d\u5217[3, 1, 4, 2]\u3092\u6607\u9806\u306b\u6574\u5217\u3057\u305f\u7d50\u679c\u306f\u3069\u308c\u304b\u3002": [
    "[1, 3, 2, 4]", "[2, 4, 1, 3]", "[4, 3, 2, 1]", "[1, 2, 4, 3]", "[2, 1, 3, 4]", "[3, 1, 2, 4]"
  ],
  "\u914d\u5217\u306e\u5168\u8981\u7d20\u304b\u3089\u6700\u5927\u5024\u3092\u6c42\u3081\u308b\u57fa\u672c\u51e6\u7406\u3067\u5fc5\u8981\u306a\u8003\u3048\u65b9\u306f\u3069\u308c\u304b\u3002": [
    "\u5148\u982d\u8981\u7d20\u3060\u3051\u3092\u78ba\u8a8d\u3057\u3066\u6b8b\u308a\u3092\u898b\u306a\u3044",
    "\u8981\u7d20\u6570\u30920\u306b\u3057\u3066\u304b\u3089\u6bd4\u8f03\u3092\u59cb\u3081\u308b",
    "\u5168\u8981\u7d20\u3092\u6587\u5b57\u5217\u3068\u3057\u3066\u7d50\u5408\u3057\u3066\u6bd4\u8f03\u3059\u308b",
    "\u6700\u5c0f\u5024\u3060\u3051\u3092\u66f4\u65b0\u3057\u3066\u6700\u5927\u5024\u3092\u6c42\u3081\u306a\u3044",
    "\u4e2d\u592e\u306e\u8981\u7d20\u3060\u3051\u3092\u6700\u5927\u5024\u3068\u3059\u308b",
    "\u8981\u7d20\u306e\u9806\u756a\u3092\u9006\u306b\u3059\u308b\u3060\u3051\u3067\u6700\u5927\u5024\u3092\u6c7a\u3081\u308b"
  ],
  "\u914d\u5217[1, 2, 3, 4, 5]\u304b\u3089\u5076\u6570\u3060\u3051\u3092\u53d6\u308a\u51fa\u3059\u3068\u3069\u308c\u304b\u3002": [
    "[1, 3, 5]", "[4, 5]", "[1, 2]", "[2, 3, 4]", "[1, 4]", "[2, 4, 5]"
  ],
  "\u30b9\u30bf\u30c3\u30af\u3092\u4f7f\u3046\u51e6\u7406\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u5370\u5237\u8981\u6c42\u3092\u53d7\u3051\u4ed8\u3051\u9806\u306b\u51e6\u7406\u3059\u308b",
    "\u512a\u5148\u5ea6\u304c\u9ad8\u3044\u8981\u6c42\u304b\u3089\u51e6\u7406\u3059\u308b",
    "\u914d\u5217\u3092\u6607\u9806\u306b\u4e26\u3079\u66ff\u3048\u308b",
    "\u6574\u5217\u6e08\u307f\u914d\u5217\u3092\u4e2d\u592e\u304b\u3089\u63a2\u7d22\u3059\u308b",
    "\u30ad\u30fc\u304b\u3089\u30cf\u30c3\u30b7\u30e5\u5024\u3092\u8a08\u7b97\u3057\u3066\u691c\u7d22\u3059\u308b",
    "\u30c7\u30fc\u30bf\u3092\u5148\u306b\u5165\u308c\u305f\u9806\u306b\u5fc5\u305a\u53d6\u308a\u51fa\u3059"
  ],
  "\u30ad\u30e5\u30fc\u3092\u4f7f\u3046\u51e6\u7406\u3068\u3057\u3066\u9069\u5207\u306a\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u76f4\u524d\u306e\u72b6\u614b\u3078\u623b\u308bUndo\u51e6\u7406",
    "\u95a2\u6570\u547c\u51fa\u3057\u306e\u623b\u308a\u5148\u3092\u5f8c\u5165\u308c\u5148\u51fa\u3057\u3067\u7ba1\u7406\u3059\u308b",
    "\u6574\u5217\u6e08\u307f\u914d\u5217\u3092\u4e2d\u592e\u304b\u3089\u63a2\u7d22\u3059\u308b",
    "\u512a\u5148\u5ea6\u304c\u9ad8\u3044\u8981\u7d20\u304b\u3089\u53d6\u308a\u51fa\u3059",
    "\u914d\u5217\u3092\u57fa\u6e96\u5024\u3067\u5206\u5272\u3057\u3066\u6574\u5217\u3059\u308b",
    "\u6700\u5f8c\u306b\u8ffd\u52a0\u3057\u305f\u8981\u7d20\u304b\u3089\u5fc5\u305a\u53d6\u308a\u51fa\u3059"
  ],
  "\u96a3\u63a5\u3059\u308b\u8981\u7d20\u3092\u6bd4\u8f03\u3057\u3001\u5fc5\u8981\u306a\u3089\u4ea4\u63db\u3059\u308b\u6574\u5217\u6cd5\u306f\u3069\u308c\u304b\u3002": [
    "\u9078\u629e\u30bd\u30fc\u30c8", "\u633f\u5165\u30bd\u30fc\u30c8", "\u30af\u30a4\u30c3\u30af\u30bd\u30fc\u30c8", "\u30de\u30fc\u30b8\u30bd\u30fc\u30c8", "\u30d2\u30fc\u30d7\u30bd\u30fc\u30c8", "\u57fa\u6570\u30bd\u30fc\u30c8"
  ],
  "\u30b0\u30e9\u30d5\u306e\u6700\u77ed\u624b\u6570\u3092\u8abf\u3079\u308b\u3068\u304d\u3001\u91cd\u307f\u304c\u306a\u3044\u5834\u5408\u306b\u4f7f\u3044\u3084\u3059\u3044\u63a2\u7d22\u306f\u3069\u308c\u304b\u3002": [
    "\u7dda\u5f62\u63a2\u7d22", "\u4e8c\u5206\u63a2\u7d22", "\u30cf\u30c3\u30b7\u30e5\u63a2\u7d22", "\u6df1\u3055\u512a\u5148\u63a2\u7d22", "\u88dc\u9593\u63a2\u7d22", "\u30b8\u30e3\u30f3\u30d7\u63a2\u7d22"
  ],
  "\u540c\u3058\u8a08\u7b97\u3092\u4f55\u5ea6\u3082\u884c\u3046\u518d\u5e30\u3092\u9ad8\u901f\u5316\u3059\u308b\u305f\u3081\u3001\u8a08\u7b97\u6e08\u307f\u7d50\u679c\u3092\u4fdd\u5b58\u3057\u3066\u518d\u5229\u7528\u3059\u308b\u8003\u3048\u65b9\u306f\u3069\u308c\u304b\u3002": [
    "\u5165\u51fa\u529b\u30c7\u30fc\u30bf\u3092\u4e00\u6642\u4fdd\u5b58\u3059\u308b\u30b9\u30d7\u30fc\u30ea\u30f3\u30b0",
    "\u540c\u3058\u30c7\u30fc\u30bf\u3092\u8907\u6570\u88c5\u7f6e\u3078\u8907\u88fd\u3059\u308b\u30df\u30e9\u30fc\u30ea\u30f3\u30b0",
    "\u5fc5\u8981\u306a\u5217\u3060\u3051\u3092\u53d6\u308a\u51fa\u3059\u5c04\u5f71",
    "\u57fa\u6e96\u5024\u3067\u5206\u5272\u3057\u3066\u6574\u5217\u3059\u308b\u30af\u30a4\u30c3\u30af\u30bd\u30fc\u30c8",
    "\u4e00\u5ea6\u5165\u308c\u305f\u30c7\u30fc\u30bf\u3092\u5148\u306b\u53d6\u308a\u51fa\u3059\u30ad\u30e5\u30fc",
    "\u901a\u4fe1\u76f8\u624b\u3092\u8a8d\u8a3c\u3057\u6697\u53f7\u5316\u3059\u308bTLS"
  ],
  "AND\u6761\u4ef6 A\u304b\u3064B \u304c\u771f\u3068\u306a\u308b\u7d44\u5408\u305b\u306f\u3069\u308c\u304b\u3002": [
    "A\u3060\u3051\u771f", "B\u3060\u3051\u771f", "A\u3082B\u3082\u507d", "A\u304c\u771f\u306a\u3089B\u306f\u4e0d\u554f", "B\u304c\u771f\u306a\u3089A\u306f\u4e0d\u554f", "A\u3068B\u306e\u3069\u3061\u3089\u304b\u304c\u771f"
  ],
  "OR\u6761\u4ef6 A\u307e\u305f\u306fB \u304c\u507d\u3068\u306a\u308b\u7d44\u5408\u305b\u306f\u3069\u308c\u304b\u3002": [
    "A\u3060\u3051\u771f", "B\u3060\u3051\u771f", "A\u3082B\u3082\u771f", "A\u304c\u507d\u306a\u3089B\u306f\u4e0d\u554f", "B\u304c\u507d\u306a\u3089A\u306f\u4e0d\u554f", "A\u3068B\u306e\u3069\u3061\u3089\u304b\u304c\u771f"
  ],
  "NOT A \u304c\u771f\u3068\u306a\u308b\u306e\u306f\u3069\u308c\u304b\u3002": [
    "A\u304c\u771f\u306e\u3068\u304d", "B\u304c\u771f\u306e\u3068\u304d", "\u5e38\u306b\u771f", "\u5e38\u306b\u507d", "A\u3068B\u304c\u3068\u3082\u306b\u771f\u306e\u3068\u304d", "A\u304c\u771f\u3067B\u304c\u507d\u306e\u3068\u304d"
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

function numericDistractors(correct) {
  const text = String(correct);
  const match = text.match(/^(\d+)(.*)$/);
  if (!match) return null;
  const value = Number(match[1]);
  const suffix = match[2] || "";
  return [value - 1, value + 1, value + 2, value * 2, Math.max(0, value - 2), value + 3, value + 5, 0]
    .filter((candidate) => candidate !== value && candidate >= 0)
    .map((candidate) => `${candidate}${suffix}`)
    .filter((candidate, index, values) => values.indexOf(candidate) === index)
    .slice(0, 6);
}

function sequenceDistractors(correct) {
  const text = String(correct);
  if (/^[A-C]$/.test(text)) return ["A", "B", "C", "\u4f55\u3082\u53d6\u308a\u51fa\u305b\u306a\u3044", "A\u3068B", "B\u3068C", "A\u3068C"].filter((x) => x !== text).slice(0, 6);
  if (/^[ABC]\u3001[ABC]$/.test(text)) return ["A\u3001B", "A\u3001C", "B\u3001A", "B\u3001C", "C\u3001A", "C\u3001B", "\u4f55\u3082\u53d6\u308a\u51fa\u305b\u306a\u3044"].filter((x) => x !== text).slice(0, 6);
  if (/^[1-4],[1-4],[1-4],[1-4]$/.test(text)) return ["1,2,3,4", "4,2,3,1", "1,3,2,4", "4,3,1,2", "2,1,4,3", "3,4,2,1"].filter((x) => x !== text).slice(0, 6);
  return null;
}

function arrayDistractors(correct) {
  const text = String(correct);
  const pools = {
    "[2, 8]": ["[5, 11]", "[2, 5, 8]", "[8, 11]", "[2, 5, 8, 11]", "[5, 8]", "[2, 11]"],
    "[2, 4]": ["[1, 3, 5]", "[4, 5]", "[1, 2]", "[2, 3, 4]", "[1, 4]", "[2, 4, 5]"]
  };
  return pools[text] || null;
}

const expanded = [];
const skipped = [];
for (const question of questions) {
  const target = `${question.stageId}/${question.tag}`;
  if (!TARGETS.has(target)) continue;
  const definition = choiceSets[question.text];
  if (definition.distractors.length >= 6) continue;
  const generated = SPECIAL_DISTRACTORS[question.text]
    || arrayDistractors(definition.correct)
    || sequenceDistractors(definition.correct)
    || numericDistractors(definition.correct);
  if (!generated || generated.length < 6) {
    skipped.push({ text: question.text, target, correct: definition.correct, found: generated?.length || 0 });
    continue;
  }
  definition.distractors = generated.slice(0, 6);
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
