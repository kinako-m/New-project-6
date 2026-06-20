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
  SUBJECT_B_CASE_QUESTIONS: require("../subject-b-case-questions.js"),
  SUBJECT_B_CASE_QUESTIONS_2: require("../subject-b-case-questions-2.js"),
  SAMPLE_DERIVED_QUESTIONS: require("../sample-derived-questions.js"),
  QUESTION_CHOICE_SETS: require("../question-choice-sets.js")
};

vm.createContext(context);
vm.runInContext(dataSource, context);

const stages = context.result;
const iterations = Number(process.argv.find((arg) => arg.startsWith("--iterations="))?.split("=")[1] || 100);

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function examQuestion(question, stage) {
  return {
    ...question,
    stageId: stage.id,
    sourceStageName: stage.name,
    tag: `${stage.name} / ${question.tag}`
  };
}

function questionKey(question) {
  return String(question.text || "").replace(/\s+/g, "");
}

function uniqueByText(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = questionKey(question);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function takeExamQuestions(stageId, count, filter = () => true) {
  const stage = stages.find((item) => item.id === stageId);
  return uniqueByText(shuffle(stage.questions.filter(filter).map((question) => examQuestion(question, stage))))
    .slice(0, count);
}

function takeExamQuestionsByDifficulty(stageId, quotas, filter = () => true) {
  const stage = stages.find((item) => item.id === stageId);
  const candidates = uniqueByText(stage.questions.filter(filter).map((question) => examQuestion(question, stage)));
  const selected = [];
  const used = new Set();
  Object.entries(quotas).forEach(([difficulty, count]) => {
    shuffle(candidates.filter((question) => question.difficulty === difficulty && !used.has(questionKey(question))))
      .slice(0, count)
      .forEach((question) => {
        selected.push(question);
        used.add(questionKey(question));
      });
  });
  const expectedCount = Object.values(quotas).reduce((sum, count) => sum + count, 0);
  if (selected.length < expectedCount) {
    shuffle(candidates.filter((question) => !used.has(questionKey(question))))
      .slice(0, expectedCount - selected.length)
      .forEach((question) => {
        selected.push(question);
        used.add(questionKey(question));
      });
  }
  return selected;
}

function buildSubjectBExam() {
  const algorithmTags = new Set(["科目Bアルゴリズム", "探索トレース", "整列トレース", "再帰トレース", "条件分岐", "データ構造応用", "グラフ問題", "計算量判断", "配列操作", "文字列処理", "状態遷移", "フラグ処理", "境界値", "擬似言語", "トレース", "実戦トレース"]);
  return shuffle([
    ...takeExamQuestionsByDifficulty("algorithm", { basic: 2, standard: 5, advanced: 3 }, (question) => question.tag === "科目B長文アルゴリズム"),
    ...takeExamQuestionsByDifficulty("algorithm", { basic: 1, standard: 2, advanced: 1 }, (question) => algorithmTags.has(question.tag)),
    ...takeExamQuestionsByDifficulty("technology", { basic: 1, standard: 3, advanced: 2 }, (question) => question.tag === "科目B長文セキュリティ")
  ]);
}

function countBy(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

const subjectBAlgorithmTags = new Set(["科目Bアルゴリズム", "科目B長文アルゴリズム", "探索トレース", "整列トレース", "再帰トレース", "条件分岐", "データ構造応用", "グラフ問題", "計算量判断", "配列操作", "文字列処理", "状態遷移", "フラグ処理", "境界値", "擬似言語", "トレース", "実戦トレース"]);
const subjectBPool = stages.flatMap((stage) =>
  stage.questions
    .filter((question) =>
      (stage.id === "algorithm" && subjectBAlgorithmTags.has(question.tag))
      || (stage.id === "technology" && question.tag === "科目B長文セキュリティ")
    )
    .map((question) => ({ ...question, stageId: stage.id, stageName: stage.name }))
);

const validDifficulties = new Set(["basic", "standard", "advanced"]);
const findings = [];

subjectBPool.forEach((question) => {
  if (!validDifficulties.has(question.difficulty)) {
    findings.push({
      type: "missing-or-invalid-difficulty",
      stageId: question.stageId,
      tag: question.tag,
      difficulty: question.difficulty || null,
      text: question.text
    });
  }
});

const poolDifficultyCounts = countBy(subjectBPool, (question) => question.difficulty || "(missing)");
["basic", "standard", "advanced"].forEach((difficulty) => {
  if (!poolDifficultyCounts[difficulty]) {
    findings.push({ type: "difficulty-bucket-empty", difficulty });
  }
});

const generatedExamDifficultyCounts = [];
for (let iteration = 1; iteration <= iterations; iteration += 1) {
  const exam = buildSubjectBExam();
  const difficultyCounts = countBy(exam, (question) => question.difficulty || "(missing)");
  generatedExamDifficultyCounts.push(difficultyCounts);
  if (exam.some((question) => !validDifficulties.has(question.difficulty))) {
    findings.push({ type: "exam-question-missing-difficulty", iteration });
  }
  if (difficultyCounts.basic !== 4 || difficultyCounts.standard !== 10 || difficultyCounts.advanced !== 6) {
    findings.push({ type: "exam-difficulty-distribution-mismatch", iteration, difficultyCounts });
  }
}

const examAverages = ["basic", "standard", "advanced"].reduce((averages, difficulty) => {
  averages[difficulty] = Math.round(
    (generatedExamDifficultyCounts.reduce((sum, counts) => sum + (counts[difficulty] || 0), 0) / iterations) * 10
  ) / 10;
  return averages;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  iterations,
  summary: {
    subjectBPool: subjectBPool.length,
    difficultyCounts: poolDifficultyCounts,
    examAverageDifficultyCounts: examAverages,
    findingCount: findings.length
  },
  byTag: countBy(subjectBPool, (question) => `${question.stageName} / ${question.tag} / ${question.difficulty || "(missing)"}`),
  findings: findings.slice(0, 50)
};

fs.writeFileSync("tools/subject-b-difficulty-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
