const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const dataSource = source.slice(0, source.indexOf("const els =")) + "\nresult = stages;";
const context = {
  result: null,
  console,
  explainChoice: () => "",
  getExplanationTip: () => "",
  IMPROVEMENT_QUESTIONS: require("../improvement-questions.js"),
};
vm.createContext(context);
vm.runInContext(dataSource, context);

const stages = context.result;

function clean(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function template(value) {
  return clean(value)
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[a-z]\d*/g, "x")
    .replace(/#[#x,+\-*/]+/g, "#");
}

function answerKey(question) {
  const correct = clean(question.choices[question.answer]);
  if (/^[#\d.+\-*/%]+$/.test(correct) || correct.length <= 2) {
    return `stem:${template(question.text)}`;
  }
  return `answer:${correct}`;
}

function ngrams(value, size = 3) {
  const normalized = template(value);
  const result = new Set();
  for (let i = 0; i <= normalized.length - size; i += 1) {
    result.add(normalized.slice(i, i + size));
  }
  return result;
}

function similarity(a, b) {
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const item of a) if (b.has(item)) overlap += 1;
  return overlap / Math.min(a.size, b.size);
}

function topCounts(items, keyFn, limit = 12) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function unionFind(size) {
  const parent = Array.from({ length: size }, (_, index) => index);
  const find = (index) => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  };
  const join = (a, b) => {
    a = find(a);
    b = find(b);
    if (a !== b) parent[b] = a;
  };
  return { parent, find, join };
}

function cluster(items) {
  const uf = unionFind(items.length);
  const grams = items.map((item) => ngrams(item.text));
  const keys = items.map(answerKey);
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (items[i].tag !== items[j].tag) continue;
      const sameKnowledge = keys[i] === keys[j];
      const sameForm = similarity(grams[i], grams[j]) >= 0.72;
      if (sameKnowledge || sameForm) uf.join(i, j);
    }
  }
  return new Set(items.map((_, index) => uf.find(index))).size;
}

const all = stages.flatMap((stage) =>
  stage.questions.map((question) => ({ ...question, stageId: stage.id, stageName: stage.name }))
);

const exactUnique = new Set(all.map((q) => `${q.stageId}:${clean(q.text)}`)).size;
const templateUnique = new Set(all.map((q) => `${q.stageId}:${q.tag}:${template(q.text)}`)).size;
const knowledgeUnique = new Set(all.map((q) => `${q.stageId}:${q.tag}:${answerKey(q)}`)).size;
const definitionStyle = all.filter((q) =>
  /(説明|目的|役割|特徴|適切なもの|正しい説明|見分ける特徴)/.test(q.text)
).length;
const calculationStyle = all.filter((q) =>
  /(計算|求め|何回|何秒|何ビット|利益|確率|稼働率|CPI|SPI|ROI|配列|変数)/.test(q.text)
).length;
const subjectBAlgorithmTags = new Set(["擬似言語", "トレース", "実戦トレース", "ループ", "配列", "再帰", "科目Bアルゴリズム", "探索トレース", "整列トレース", "再帰トレース", "条件分岐", "データ構造応用", "グラフ問題", "計算量判断", "配列操作", "文字列処理", "状態遷移", "フラグ処理", "境界値"]);
const subjectBAlgorithm = all.filter(
  (q) => q.stageId === "algorithm" && subjectBAlgorithmTags.has(q.tag)
).length;
const subjectBSecurity = all.filter(
  (q) =>
    q.stageId === "technology" &&
    (q.tag === "セキュリティ" || q.tag === "実戦ケース" || q.tag === "科目Bセキュリティ" || q.tag === "インシデント対応" || q.tag === "アクセス制御" || q.tag === "認証設計" || q.tag === "Webセキュリティ" || q.tag === "ログ分析") &&
    /(場合|対応|攻撃|対策|確認|ログ|委託|障害|不正|安全)/.test(q.text)
).length;

const stageRows = stages.map((stage) => {
  const items = all.filter((q) => q.stageId === stage.id);
  const tagCounts = topCounts(items, (q) => q.tag, 100);
  const largestTag = tagCounts[0] || ["", 0];
  return {
    id: stage.id,
    name: stage.name,
    questions: items.length,
    exactUnique: new Set(items.map((q) => clean(q.text))).size,
    templateUnique: new Set(items.map((q) => `${q.tag}:${template(q.text)}`)).size,
    knowledgeUnique: new Set(items.map((q) => `${q.tag}:${answerKey(q)}`)).size,
    clusteredVariety: cluster(items),
    tags: tagCounts.length,
    largestTag: largestTag[0],
    largestTagCount: largestTag[1],
    largestTagShare: Math.round((largestTag[1] / items.length) * 1000) / 10,
  };
});

const repeatedAnswers = topCounts(all, (q) => `${q.stageId} / ${q.tag} / ${q.choices[q.answer]}`, 18)
  .filter(([, count]) => count >= 3);
const repeatedTemplates = topCounts(all, (q) => `${q.stageId} / ${q.tag} / ${template(q.text)}`, 18)
  .filter(([, count]) => count >= 2);
const tagCounts = topCounts(all, (q) => `${q.stageId} / ${q.tag}`, 25);
const validation = {
  invalidAnswerIndex: all.filter((q) => !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length).length,
  wrongChoiceCount: all.filter((q) => q.choices.length !== 4).length,
  duplicateChoices: all.filter((q) => new Set(q.choices.map(clean)).size !== q.choices.length).length,
  emptyExplanations: all.filter((q) => !String(q.explanation || "").trim()).length,
};

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    questions: all.length,
    exactUnique,
    templateUnique,
    knowledgeUnique,
    clusteredVariety: stageRows.reduce((sum, row) => sum + row.clusteredVariety, 0),
    definitionStyle,
    calculationStyle,
    subjectBAlgorithm,
    subjectBSecurity,
  },
  stages: stageRows,
  topTags: tagCounts,
  repeatedAnswers,
  repeatedTemplates,
  validation,
};

fs.writeFileSync("tools/question-variety-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
