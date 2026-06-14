const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "management/\u958b\u767a",
  "technology/OS",
  "strategy/\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0"
]);

const SPECIAL_DISTRACTORS = {
  "\u4eee\u60f3\u8a18\u61b6\u65b9\u5f0f\u3067\u3001\u4e3b\u8a18\u61b6\u306b\u306a\u3044\u30da\u30fc\u30b8\u3092\u53c2\u7167\u3057\u305f\u3068\u304d\u306b\u767a\u751f\u3059\u308b\u3082\u306e\u306f\u3069\u308c\u304b\u3002": [
    "\u30c7\u30c3\u30c9\u30ed\u30c3\u30af",
    "\u30b9\u30d7\u30fc\u30ea\u30f3\u30b0",
    "\u30b3\u30f3\u30d1\u30af\u30b7\u30e7\u30f3",
    "\u30d7\u30ed\u30bb\u30b9",
    "\u30b9\u30ec\u30c3\u30c9",
    "\u30bb\u30de\u30d5\u30a9"
  ],
  "4P\u306b\u542b\u307e\u308c\u308b\u8981\u7d20\u306f\u3069\u308c\u304b\u3002": [
    "Customer Value",
    "Cost",
    "Convenience",
    "Communication",
    "People",
    "Physical Evidence"
  ]
};

const FALLBACK_POOLS = {
  "technology/OS/term": [
    "\u4eee\u60f3\u8a18\u61b6",
    "\u30da\u30fc\u30b8\u30d5\u30a9\u30fc\u30eb\u30c8",
    "\u30b9\u30d7\u30fc\u30ea\u30f3\u30b0",
    "\u30c7\u30c3\u30c9\u30ed\u30c3\u30af",
    "\u30de\u30eb\u30c1\u30bf\u30b9\u30af",
    "\u30b9\u30b1\u30b8\u30e5\u30fc\u30ea\u30f3\u30b0",
    "\u30d7\u30ed\u30bb\u30b9",
    "\u30b9\u30ec\u30c3\u30c9",
    "\u30bb\u30de\u30d5\u30a9"
  ],
  "technology/OS/description": [
    "\u88dc\u52a9\u8a18\u61b6\u306e\u4e00\u90e8\u3092\u4e3b\u8a18\u61b6\u306e\u3088\u3046\u306b\u5229\u7528\u3059\u308b\u4ed5\u7d44\u307f",
    "\u5fc5\u8981\u306a\u30da\u30fc\u30b8\u304c\u4e3b\u8a18\u61b6\u306b\u306a\u3044\u3068\u304d\u306b\u767a\u751f\u3059\u308b\u4e8b\u8c61",
    "\u5165\u51fa\u529b\u30c7\u30fc\u30bf\u3092\u4e00\u6642\u4fdd\u5b58\u3057\u3001\u88c5\u7f6e\u304c\u51e6\u7406\u3067\u304d\u308b\u9806\u306b\u6e21\u3059\u65b9\u5f0f",
    "\u8907\u6570\u306e\u51e6\u7406\u304c\u4e92\u3044\u306e\u8cc7\u6e90\u89e3\u653e\u3092\u5f85\u3061\u7d9a\u3051\u308b\u72b6\u614b",
    "CPU\u3092\u4f7f\u7528\u3059\u308b\u51e6\u7406\u306e\u9806\u756a\u3084\u6642\u9593\u3092\u6c7a\u3081\u308b\u6a5f\u80fd",
    "\u5b9f\u884c\u4e2d\u306e\u30d7\u30ed\u30b0\u30e9\u30e0\u3068\u305d\u306e\u8cc7\u6e90\u3092\u7ba1\u7406\u3059\u308b\u5358\u4f4d"
  ],
  "technology/OS/feature": [
    "\u4e3b\u8a18\u61b6\u3088\u308a\u5927\u304d\u306a\u8a18\u61b6\u7a7a\u9593\u3092\u30d7\u30ed\u30bb\u30b9\u306b\u63d0\u4f9b\u3067\u304d\u308b",
    "\u53c2\u7167\u5bfe\u8c61\u306e\u30da\u30fc\u30b8\u3092\u88dc\u52a9\u8a18\u61b6\u304b\u3089\u4e3b\u8a18\u61b6\u3078\u8aad\u307f\u8fbc\u3080\u5951\u6a5f\u306b\u306a\u308b",
    "\u4f4e\u901f\u306a\u5165\u51fa\u529b\u88c5\u7f6e\u3068CPU\u306e\u901f\u5ea6\u5dee\u3092\u7de9\u548c\u3067\u304d\u308b",
    "\u8907\u6570\u306e\u51e6\u7406\u304c\u9032\u884c\u3067\u304d\u305a\u8cc7\u6e90\u3092\u4fdd\u6301\u3057\u305f\u307e\u307e\u306b\u306a\u308b",
    "CPU\u306e\u4f7f\u7528\u6642\u9593\u3092\u51e6\u7406\u3054\u3068\u306b\u5272\u308a\u5f53\u3066\u308b",
    "\u5171\u6709\u8cc7\u6e90\u3078\u306e\u540c\u6642\u30a2\u30af\u30bb\u30b9\u3092\u5236\u5fa1\u3059\u308b"
  ],
  "management/\u958b\u767a/term": [
    "\u30a6\u30a9\u30fc\u30bf\u30d5\u30a9\u30fc\u30eb\u30e2\u30c7\u30eb",
    "\u30a2\u30b8\u30e3\u30a4\u30eb\u958b\u767a",
    "\u30d7\u30ed\u30c8\u30bf\u30a4\u30d4\u30f3\u30b0",
    "\u30b9\u30d1\u30a4\u30e9\u30eb\u30e2\u30c7\u30eb",
    "DevOps",
    "CI",
    "CD",
    "\u30ea\u30d5\u30a1\u30af\u30bf\u30ea\u30f3\u30b0",
    "\u30b3\u30fc\u30c9\u30ec\u30d3\u30e5\u30fc",
    "\u30d0\u30fc\u30b8\u30e7\u30f3\u7ba1\u7406"
  ],
  "management/\u958b\u767a/description": [
    "\u5de5\u7a0b\u3092\u539f\u5247\u3068\u3057\u3066\u4e0a\u6d41\u304b\u3089\u4e0b\u6d41\u3078\u9806\u306b\u9032\u3081\u308b\u958b\u767a\u30e2\u30c7\u30eb",
    "\u77ed\u3044\u53cd\u5fa9\u3067\u8a2d\u8a08\u30fb\u5b9f\u88c5\u30fb\u30c6\u30b9\u30c8\u3092\u7e70\u308a\u8fd4\u3059\u958b\u767a\u624b\u6cd5",
    "\u8a66\u4f5c\u54c1\u3092\u4f5c\u6210\u3057\u3001\u5229\u7528\u8005\u306e\u78ba\u8a8d\u3092\u5f97\u306a\u304c\u3089\u8981\u4ef6\u3092\u660e\u78ba\u306b\u3059\u308b\u624b\u6cd5",
    "\u30ea\u30b9\u30af\u5206\u6790\u3068\u958b\u767a\u3092\u53cd\u5fa9\u3057\u306a\u304c\u3089\u6bb5\u968e\u7684\u306b\u9032\u3081\u308b\u30e2\u30c7\u30eb",
    "\u958b\u767a\u3068\u904b\u7528\u304c\u9023\u643a\u3057\u3001\u7d99\u7d9a\u7684\u306a\u6539\u5584\u3068\u63d0\u4f9b\u3092\u884c\u3046\u8003\u3048\u65b9",
    "\u5909\u66f4\u3092\u983b\u7e41\u306b\u7d71\u5408\u3057\u3001\u81ea\u52d5\u30d3\u30eb\u30c9\u3084\u30c6\u30b9\u30c8\u3067\u691c\u8a3c\u3059\u308b\u53d6\u7d44\u307f"
  ],
  "management/\u958b\u767a/feature": [
    "\u5404\u5de5\u7a0b\u306e\u5b8c\u4e86\u3092\u78ba\u8a8d\u3057\u3066\u304b\u3089\u6b21\u5de5\u7a0b\u3078\u9032\u3080",
    "\u5229\u7528\u8005\u306e\u53cd\u5fdc\u3092\u77ed\u3044\u5468\u671f\u3067\u53d6\u308a\u8fbc\u3081\u308b",
    "\u65e9\u671f\u306e\u8a66\u4f5c\u54c1\u3067\u4f7f\u7528\u611f\u3084\u8981\u4ef6\u3092\u78ba\u8a8d\u3067\u304d\u308b",
    "\u53cd\u5fa9\u3054\u3068\u306b\u30ea\u30b9\u30af\u3092\u8a55\u4fa1\u3057\u3066\u5bfe\u5fdc\u3059\u308b",
    "\u958b\u767a\u3068\u904b\u7528\u306e\u58c1\u3092\u6e1b\u3089\u3057\u3001\u63d0\u4f9b\u5f8c\u306e\u6539\u5584\u307e\u3067\u7d99\u7d9a\u3059\u308b",
    "\u30b3\u30fc\u30c9\u5909\u66f4\u306e\u305f\u3073\u306b\u81ea\u52d5\u691c\u8a3c\u3057\u3001\u7d71\u5408\u6642\u306e\u554f\u984c\u3092\u65e9\u671f\u767a\u898b\u3059\u308b"
  ],
  "strategy/\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0/term": [
    "\u30bb\u30b0\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3",
    "\u30bf\u30fc\u30b2\u30c6\u30a3\u30f3\u30b0",
    "\u30dd\u30b8\u30b7\u30e7\u30cb\u30f3\u30b0",
    "4P",
    "4C",
    "CRM",
    "\u5e02\u5834\u6d78\u900f\u6226\u7565",
    "\u5e02\u5834\u958b\u62d3\u6226\u7565",
    "\u30d7\u30ed\u30e2\u30fc\u30b7\u30e7\u30f3"
  ],
  "strategy/\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0/description": [
    "\u5e02\u5834\u3092\u9867\u5ba2\u306e\u5c5e\u6027\u3084\u30cb\u30fc\u30ba\u3067\u7d30\u5206\u5316\u3059\u308b\u3053\u3068",
    "\u7d30\u5206\u5316\u3057\u305f\u5e02\u5834\u304b\u3089\u81ea\u793e\u304c\u72d9\u3046\u5e02\u5834\u3092\u9078\u3076\u3053\u3068",
    "\u7af6\u5408\u3068\u6bd4\u8f03\u3057\u3066\u9867\u5ba2\u306e\u4e2d\u3067\u81ea\u793e\u88fd\u54c1\u306e\u4f4d\u7f6e\u4ed8\u3051\u3092\u660e\u78ba\u306b\u3059\u308b\u3053\u3068",
    "Product\u30fbPrice\u30fbPlace\u30fbPromotion\u3092\u7d44\u307f\u5408\u308f\u305b\u3066\u65bd\u7b56\u3092\u8a2d\u8a08\u3059\u308b\u8003\u3048\u65b9",
    "\u9867\u5ba2\u306e\u8996\u70b9\u3067\u4fa1\u5024\u30fb\u8cbb\u7528\u30fb\u5229\u4fbf\u6027\u30fb\u30b3\u30df\u30e5\u30cb\u30b1\u30fc\u30b7\u30e7\u30f3\u3092\u636e\u3048\u308b\u8003\u3048\u65b9",
    "\u9867\u5ba2\u60c5\u5831\u3068\u63a5\u70b9\u3092\u7ba1\u7406\u3057\u3001\u9577\u671f\u7684\u306a\u95a2\u4fc2\u3092\u5f37\u5316\u3059\u308b\u53d6\u7d44\u307f"
  ],
  "strategy/\u30de\u30fc\u30b1\u30c6\u30a3\u30f3\u30b0/feature": [
    "\u9867\u5ba2\u5c64\u3092\u5171\u901a\u3059\u308b\u7279\u5fb4\u3054\u3068\u306e\u96c6\u56e3\u306b\u5206\u3051\u308b",
    "\u81ea\u793e\u306e\u5f37\u307f\u3092\u751f\u304b\u305b\u308b\u9867\u5ba2\u5c64\u3092\u9078\u5b9a\u3059\u308b",
    "\u9867\u5ba2\u306b\u8a8d\u8b58\u3057\u3066\u3082\u3089\u3044\u305f\u3044\u4fa1\u5024\u3084\u5dee\u5225\u5316\u70b9\u3092\u5b9a\u3081\u308b",
    "\u88fd\u54c1\u30fb\u4fa1\u683c\u30fb\u6d41\u901a\u30fb\u8ca9\u58f2\u4fc3\u9032\u306e\u56db\u8981\u7d20\u3092\u8abf\u6574\u3059\u308b",
    "\u9867\u5ba2\u306e\u8cfc\u8cb7\u5c65\u6b74\u3084\u554f\u5408\u305b\u5c65\u6b74\u3092\u6d3b\u7528\u3057\u3066\u95a2\u4fc2\u3092\u7dad\u6301\u3059\u308b",
    "\u73fe\u5728\u306e\u5e02\u5834\u3067\u65e2\u5b58\u88fd\u54c1\u306e\u8ca9\u58f2\u91cf\u62e1\u5927\u3092\u76ee\u6307\u3059"
  ]
};

const OWN_FALLBACK_MARKERS = {
  "\u4eee\u60f3\u8a18\u61b6": ["\u88dc\u52a9\u8a18\u61b6\u306e\u4e00\u90e8", "\u4e3b\u8a18\u61b6\u3088\u308a\u5927\u304d\u306a\u8a18\u61b6\u7a7a\u9593"],
  "\u30da\u30fc\u30b8\u30d5\u30a9\u30fc\u30eb\u30c8": ["\u5fc5\u8981\u306a\u30da\u30fc\u30b8\u304c\u4e3b\u8a18\u61b6\u306b\u306a\u3044", "\u53c2\u7167\u5bfe\u8c61\u306e\u30da\u30fc\u30b8"],
  "\u30b9\u30d7\u30fc\u30ea\u30f3\u30b0": ["\u5165\u51fa\u529b\u30c7\u30fc\u30bf\u3092\u4e00\u6642\u4fdd\u5b58", "\u4f4e\u901f\u306a\u5165\u51fa\u529b\u88c5\u7f6e"],
  "\u30c7\u30c3\u30c9\u30ed\u30c3\u30af": ["\u4e92\u3044\u306e\u8cc7\u6e90\u89e3\u653e\u3092\u5f85\u3061", "\u51e6\u7406\u304c\u9032\u884c\u3067\u304d\u305a\u8cc7\u6e90\u3092\u4fdd\u6301"],
  "\u30a6\u30a9\u30fc\u30bf\u30d5\u30a9\u30fc\u30eb\u30e2\u30c7\u30eb": ["\u5de5\u7a0b\u3092\u539f\u5247\u3068\u3057\u3066\u4e0a\u6d41", "\u5404\u5de5\u7a0b\u306e\u5b8c\u4e86\u3092\u78ba\u8a8d"],
  "\u30a2\u30b8\u30e3\u30a4\u30eb\u958b\u767a": ["\u77ed\u3044\u53cd\u5fa9\u3067\u8a2d\u8a08", "\u5229\u7528\u8005\u306e\u53cd\u5fdc\u3092\u77ed\u3044\u5468\u671f"],
  "\u30d7\u30ed\u30c8\u30bf\u30a4\u30d4\u30f3\u30b0": ["\u8a66\u4f5c\u54c1\u3092\u4f5c\u6210", "\u65e9\u671f\u306e\u8a66\u4f5c\u54c1"],
  "\u30b9\u30d1\u30a4\u30e9\u30eb\u30e2\u30c7\u30eb": ["\u30ea\u30b9\u30af\u5206\u6790\u3068\u958b\u767a\u3092\u53cd\u5fa9", "\u53cd\u5fa9\u3054\u3068\u306b\u30ea\u30b9\u30af"],
  "DevOps": ["\u958b\u767a\u3068\u904b\u7528\u304c\u9023\u643a", "\u958b\u767a\u3068\u904b\u7528\u306e\u58c1"],
  "CI": ["\u5909\u66f4\u3092\u983b\u7e41\u306b\u7d71\u5408", "\u30b3\u30fc\u30c9\u5909\u66f4\u306e\u305f\u3073\u306b\u81ea\u52d5\u691c\u8a3c"],
  "\u30bb\u30b0\u30e1\u30f3\u30c6\u30fc\u30b7\u30e7\u30f3": ["\u5e02\u5834\u3092\u9867\u5ba2\u306e\u5c5e\u6027\u3084\u30cb\u30fc\u30ba\u3067\u7d30\u5206\u5316", "\u9867\u5ba2\u5c64\u3092\u5171\u901a\u3059\u308b\u7279\u5fb4\u3054\u3068"],
  "\u30bf\u30fc\u30b2\u30c6\u30a3\u30f3\u30b0": ["\u7d30\u5206\u5316\u3057\u305f\u5e02\u5834\u304b\u3089\u81ea\u793e\u304c\u72d9\u3046", "\u81ea\u793e\u306e\u5f37\u307f\u3092\u751f\u304b\u305b\u308b\u9867\u5ba2\u5c64"],
  "\u30dd\u30b8\u30b7\u30e7\u30cb\u30f3\u30b0": ["\u7af6\u5408\u3068\u6bd4\u8f03\u3057\u3066\u9867\u5ba2\u306e\u4e2d\u3067", "\u9867\u5ba2\u306b\u8a8d\u8b58\u3057\u3066\u3082\u3089\u3044\u305f\u3044\u4fa1\u5024"],
  "4P": ["Product\u30fbPrice\u30fbPlace\u30fbPromotion\u3092\u7d44\u307f\u5408\u308f\u305b", "\u88fd\u54c1\u30fb\u4fa1\u683c\u30fb\u6d41\u901a\u30fb\u8ca9\u58f2\u4fc3\u9032"]
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

function isOwnFallback(questionConcept, candidate) {
  return (OWN_FALLBACK_MARKERS[questionConcept] || []).some((marker) => candidate.includes(marker));
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
  const definition = choiceSets[question.text];
  const questionFamily = family(question.text);
  if (!TARGETS.has(target)) continue;
  if (SPECIAL_DISTRACTORS[question.text]) {
    if (JSON.stringify(definition.distractors) !== JSON.stringify(SPECIAL_DISTRACTORS[question.text])) {
      definition.distractors = [...SPECIAL_DISTRACTORS[question.text]];
      expanded.push({ text: question.text, target });
    }
    continue;
  }
  if (!questionFamily) continue;
  const questionConcept = concept(question.text);
  definition.distractors = definition.distractors.filter((candidate) => !isOwnFallback(questionConcept, candidate));
  if (definition.distractors.length >= 6) continue;
  const existing = new Set([definition.correct, ...definition.distractors].map(normalize));
  const poolKey = `${target}/${questionFamily}`;
  const additions = [
    ...(pools.get(poolKey) || []).map((item) => ({ concept: item.concept, candidate: item.correct })),
    ...(FALLBACK_POOLS[poolKey] || []).map((candidate) => ({ concept: candidate, candidate }))
  ]
    .filter((item) => item.concept !== questionConcept)
    .map((item) => item.candidate)
    .filter((candidate) => !isOwnFallback(questionConcept, candidate))
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
