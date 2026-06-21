const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const dataSource = `${source.slice(0, source.indexOf("const els ="))}
result = stages;`;
const context = {
  result: null,
  console,
  explainChoice: () => "",
  getExplanationTip: () => "",
  IMPROVEMENT_QUESTIONS: require("../improvement-questions.js"),
  SUBJECT_B_CASE_QUESTIONS: require("../subject-b-case-questions.js"),
  SUBJECT_B_CASE_QUESTIONS_2: require("../subject-b-case-questions-2.js"),
  SAMPLE_DERIVED_QUESTIONS: require("../sample-derived-questions.js"),
  QUESTION_CHOICE_SETS: require("../question-choice-sets.js"),
};
vm.createContext(context);
vm.runInContext(dataSource, context);

const questions = context.result.flatMap((stage) =>
  stage.questions.map((question, index) => ({
    ...question,
    id: `${stage.id}-${String(index + 1).padStart(3, "0")}`,
    stageId: stage.id,
    stageName: stage.name,
  }))
);

function compact(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；「」『』"'（）()\[\]{}]/g, "");
}

function isNumericLike(value) {
  return /^[-+]?\d+(?:\.\d+)?(?:%|回|個|件|秒|分|時間|KB|MB|GB|TB|ビット)?$/.test(String(value || "").trim());
}

function isGenericExplanation(value) {
  const text = compact(value);
  return (
    /^正解は.+です(?:データベース分野の定番論点です|開発運用管理でよく問われます|ストラテジ系で出やすい用語です)?$/.test(text) ||
    /定番論点です$/.test(text) ||
    /よく問われます$/.test(text) ||
    /出やすい用語です$/.test(text)
  );
}

function containsMeaningfulReason(value, correctChoice) {
  const text = compact(value);
  const correct = compact(correctChoice);
  if (!text) return false;
  if (text.length >= 36 && !isGenericExplanation(value)) return true;
  if (correct && text.includes(correct) && text.length >= correct.length + 18) return true;
  return false;
}

function hasDistractorExplanation(question) {
  const explanation = String(question.explanation || "");
  const wrongChoices = question.choices.filter((_, index) => index !== question.answer);
  if (question.choiceNotes && Object.keys(question.choiceNotes).length >= Math.min(2, wrongChoices.length)) return true;
  const matched = wrongChoices.filter((choice) => {
    const normalized = compact(choice);
    if (!normalized || normalized.length <= 1 || isNumericLike(choice)) return false;
    return compact(explanation).includes(normalized);
  });
  return matched.length >= Math.min(2, wrongChoices.length);
}

function hasAcronym(value) {
  return /(?:^|[^A-Za-z0-9])[A-Z]{2,}[0-9]*(?:[^A-Za-z0-9]|$)|[A-Z][a-z]+[A-Z]/.test(String(value || ""));
}

function hasAcronymMeaningInExplanation(value) {
  return /(?:略|とは|は[A-Z][A-Za-z ]{3,}|、[^。]{2,}(?:を表す|のこと|という意味))/.test(String(value || ""));
}

function addFinding(findings, question, type, severity, detail = {}) {
  findings.push({
    id: question.id,
    stage: question.stageName,
    stageId: question.stageId,
    tag: question.tag,
    type,
    severity,
    text: question.text,
    correct: question.choices[question.answer],
    explanation: question.explanation || "",
    detail,
  });
}

const findings = [];

for (const question of questions) {
  const explanation = String(question.explanation || "").trim();
  const correctChoice = question.choices[question.answer];
  const explanationLength = compact(explanation).length;
  const textLength = compact(question.text).length;
  const subjectBLike = question.difficulty === "advanced" || /科目B|長文|ケース|トレース/.test(String(question.tag || ""));
  const definitionLike = /説明|目的|役割|特徴|どれか|該当する用語/.test(question.text);
  const allNumericChoices = question.choices.every(isNumericLike);

  if (!explanation) {
    addFinding(findings, question, "empty-explanation", "high");
    continue;
  }

  if (!containsMeaningfulReason(explanation, correctChoice)) {
    addFinding(findings, question, "weak-correct-reason", "medium", {
      explanationLength,
      reason: "正解名だけ、または汎用文だけで理由が不足している可能性があります。",
    });
  }

  if (isGenericExplanation(explanation)) {
    addFinding(findings, question, "generic-explanation", "medium", {
      reason: "分野の定番という説明だけでは、なぜ正解かが残りにくい可能性があります。",
    });
  }

  if (subjectBLike && explanationLength < 55) {
    addFinding(findings, question, "short-subject-b-explanation", "medium", {
      explanationLength,
      minimum: 55,
    });
  } else if (!allNumericChoices && definitionLike && explanationLength < 32) {
    addFinding(findings, question, "short-definition-explanation", "medium", {
      explanationLength,
      minimum: 32,
    });
  }

  if (subjectBLike && !allNumericChoices && question.choices.length >= 4 && !hasDistractorExplanation(question)) {
    addFinding(findings, question, "weak-distractor-explanation", "low", {
      reason: "誤答選択肢の説明が本文またはchoiceNotesに十分含まれていない可能性があります。",
    });
  }

  const acronymSources = [question.text, correctChoice, explanation, ...(question.choices || [])].join(" ");
  if (hasAcronym(acronymSources) && hasAcronymMeaningInExplanation(explanation)) {
    addFinding(findings, question, "possible-acronym-duplication", "low", {
      reason: "略語補足と既存解説の内容が重複する可能性があります。",
    });
  }

  if (textLength >= 80 && explanationLength < 45) {
    addFinding(findings, question, "long-question-short-explanation", "medium", {
      questionLength: textLength,
      explanationLength,
    });
  }
}

const severityCounts = findings.reduce((counts, finding) => {
  counts[finding.severity] = (counts[finding.severity] || 0) + 1;
  return counts;
}, {});

function countBy(items, keyFn) {
  return items.reduce((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function topEntries(counts, limit = 20) {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

const report = {
  generatedAt: new Date().toISOString(),
  questionCount: questions.length,
  findingCount: findings.length,
  severityCounts,
  typeCounts: countBy(findings, (finding) => finding.type),
  stageCounts: countBy(findings, (finding) => finding.stageId),
  topTypes: topEntries(countBy(findings, (finding) => finding.type)),
  topStages: topEntries(countBy(findings, (finding) => finding.stageId)),
  findings,
};

const markdown = [
  "# Explanation Quality Report",
  "",
  `Generated: ${report.generatedAt}`,
  `Questions: ${report.questionCount}`,
  `Findings: ${report.findingCount}`,
  `High: ${severityCounts.high || 0}`,
  `Medium: ${severityCounts.medium || 0}`,
  `Low: ${severityCounts.low || 0}`,
  "",
  "## Top Finding Types",
  "",
  ...report.topTypes.map((entry) => `- ${entry.key}: ${entry.count}`),
  "",
  "## Findings By Stage",
  "",
  ...report.topStages.map((entry) => `- ${entry.key}: ${entry.count}`),
  "",
  ...findings.slice(0, 120).map((finding) => [
    `## ${finding.severity.toUpperCase()} ${finding.type}`,
    "",
    `- ID: ${finding.id}`,
    `- Stage: ${finding.stage}`,
    `- Tag: ${finding.tag}`,
    `- Question: ${finding.text}`,
    `- Correct: ${finding.correct}`,
    `- Explanation: ${finding.explanation}`,
    `- Detail: \`${JSON.stringify(finding.detail)}\``,
    "",
  ].join("\n")),
].join("\n");

fs.writeFileSync("tools/explanation-quality-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/explanation-quality-report.md", markdown);

console.log(JSON.stringify({
  questionCount: report.questionCount,
  findingCount: report.findingCount,
  severityCounts,
  topTypes: report.topTypes,
  topStages: report.topStages,
  findings: findings.slice(0, 30),
}, null, 2));

if ((severityCounts.high || 0) > 0) process.exit(1);
