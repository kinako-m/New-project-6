const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

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
  stage.questions.map((question, index) => ({
    ...question,
    id: `${stage.id}-${String(index + 1).padStart(3, "0")}`,
    stageId: stage.id,
    stageName: stage.name
  }))
);

function compact(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function choiceKind(value) {
  const text = String(value).trim();
  if (/^-?[\d,]+(?:\.\d+)?(?:回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/.test(text)) return "numeric";
  if (/^(?:O\(.+\)|[A-Z][A-Z0-9 /+.-]*|第\d正規形)$/.test(text)) return "term";
  if (/(?:する|しない|できる|行う|扱う|求める|取り出す|格納|保存|利用|提供|保護|防ぐ|減らす|増やす|変える|構造|操作|方法|仕組み|性質|権利|活動|手法|方式|考え方|SQL句|です|である|なる|ない)$/.test(text)) return "sentence";
  return compact(text).length <= 14 ? "term" : "sentence";
}

function numericUnit(value) {
  const match = String(value).trim().match(/^-?\d+(?:\.\d+)?(回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/);
  return match ? match[1] || "(none)" : null;
}

function bigrams(value) {
  const text = compact(value);
  const result = new Set();
  for (let i = 0; i < text.length - 1; i += 1) result.add(text.slice(i, i + 2));
  return result;
}

function similarity(left, right) {
  const a = bigrams(left);
  const b = bigrams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / new Set([...a, ...b]).size;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

const correctOwners = new Map();
for (const question of questions) {
  const correct = compact(choiceSets[question.text].correct);
  if (!correctOwners.has(correct)) correctOwners.set(correct, []);
  correctOwners.get(correct).push({ stageId: question.stageId, tag: question.tag });
}

const findings = [];
function add(question, type, severity, points, detail) {
  findings.push({
    id: question.id,
    stage: question.stageName,
    stageId: question.stageId,
    tag: question.tag,
    text: question.text,
    correct: choiceSets[question.text].correct,
    type,
    severity,
    points,
    detail
  });
}

for (const question of questions) {
  const definition = choiceSets[question.text];
  const choices = [definition.correct, ...definition.distractors];
  const normalized = choices.map(compact);
  const kinds = choices.map(choiceKind);
  const kindCounts = kinds.reduce((counts, kind) => {
    counts[kind] = (counts[kind] || 0) + 1;
    return counts;
  }, {});
  const majorityKind = Object.entries(kindCounts).sort((a, b) => b[1] - a[1])[0][0];

  if (new Set(normalized).size !== normalized.length) {
    const duplicateGroups = [...new Set(normalized)]
      .map((value) => choices.filter((choice) => compact(choice) === value))
      .filter((group) => group.length > 1);
    add(question, "duplicate-candidate", "high", 10, { duplicateGroups });
  }

  if (kindCounts[majorityKind] >= choices.length - 1) {
    choices.forEach((choice, index) => {
      if (kinds[index] !== majorityKind) {
        const contextualException =
          /(?:ない|存在しない|該当しない|取り出せない)/.test(choice)
          || compact(question.text).includes(compact(choice));
        const severity = majorityKind === "numeric" && !contextualException ? "high" : "medium";
        add(question, "choice-style-outlier", severity, severity === "high" ? 8 : 5, {
          candidate: choice,
          candidateKind: kinds[index],
          majorityKind
        });
      }
    });
  } else if (new Set(kinds).size >= 3) {
    add(question, "mixed-choice-styles", "medium", 5, { kinds });
  }

  const units = choices.map(numericUnit);
  const numericUnits = units.filter((unit) => unit !== null);
  if (numericUnits.length === choices.length && new Set(numericUnits).size > 1) {
    add(question, "numeric-unit-mismatch", "high", 9, { units });
  }

  const correctLength = compact(definition.correct).length;
  const distractorLengths = definition.distractors.map((choice) => compact(choice).length);
  const distractorMedian = median(distractorLengths);
  if (distractorMedian >= 8 && (correctLength >= distractorMedian * 2.5 || correctLength <= distractorMedian * 0.4)) {
    add(question, "correct-length-outlier", "medium", 6, {
      correctLength,
      distractorMedian
    });
  }

  definition.distractors.forEach((candidate) => {
    const score = similarity(definition.correct, candidate);
    if (score >= 0.82 && compact(definition.correct) !== compact(candidate)) {
      add(question, "near-correct-candidate", "medium", 6, {
        candidate,
        similarity: Number(score.toFixed(2))
      });
    }

    if (numericUnit(candidate) !== null) return;
    const owners = correctOwners.get(compact(candidate)) || [];
    if (!owners.length || owners.some((owner) => owner.stageId === question.stageId && owner.tag === question.tag)) return;
    const differentStage = owners.every((owner) => owner.stageId !== question.stageId);
    add(question, "foreign-tag-candidate", differentStage ? "medium" : "low", differentStage ? 5 : 3, {
      candidate,
      candidateOwners: owners
    });
  });
}

const groupedByQuestion = new Map();
for (const finding of findings) {
  if (!groupedByQuestion.has(finding.text)) {
    groupedByQuestion.set(finding.text, {
      id: finding.id,
      stage: finding.stage,
      tag: finding.tag,
      text: finding.text,
      correct: finding.correct,
      score: 0,
      findings: []
    });
  }
  const item = groupedByQuestion.get(finding.text);
  item.score += finding.points;
  item.findings.push(finding);
}

const reviewQueue = [...groupedByQuestion.values()]
  .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  .map((item, index) => ({ rank: index + 1, ...item }));

const counts = findings.reduce((result, finding) => {
  result[finding.type] = (result[finding.type] || 0) + 1;
  return result;
}, {});
const severityCounts = findings.reduce((result, finding) => {
  result[finding.severity] = (result[finding.severity] || 0) + 1;
  return result;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    questions: questions.length,
    candidateSetsWithFindings: reviewQueue.length,
    findings: findings.length,
    severityCounts,
    counts
  },
  interpretation: {
    high: "形式・単位・重複など、機械的に修正判断しやすい候補",
    medium: "正解との類似、別分野候補、長さ差など、人手確認を優先する候補",
    low: "同じ大分野内の別タグ候補。無関係とは限らないため参考扱い"
  },
  reviewQueue
};

function shortDetail(finding) {
  if (typeof finding.detail === "string") return finding.detail;
  if (finding.detail.candidate) return `${finding.type}: ${finding.detail.candidate}`;
  return finding.type;
}

const markdownRows = reviewQueue.slice(0, 150).map((item) =>
  `| ${item.rank} | ${item.score} | ${item.stage} | ${item.tag} | ${item.text.replace(/\r?\n/g, " ")} | ${item.findings.map(shortDetail).join(" / ")} |`
).join("\n");
const markdown = `# 選択肢候補 品質監査レポート

生成日時: ${report.generatedAt}

- 全問題数: ${report.summary.questions}
- 要確認問題数: ${report.summary.candidateSetsWithFindings}
- 高確度の指摘: ${severityCounts.high || 0}
- 中確度の指摘: ${severityCounts.medium || 0}
- 参考指摘: ${severityCounts.low || 0}

## 判定件数

${Object.entries(counts).map(([type, count]) => `- ${type}: ${count}`).join("\n")}

## 優先確認キュー

| 順位 | 点数 | 分野 | タグ | 問題 | 指摘 |
| ---: | ---: | --- | --- | --- | --- |
${markdownRows}
`;

fs.writeFileSync("tools/choice-candidate-quality-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/choice-candidate-quality-report.md", markdown);
console.log(JSON.stringify({
  summary: report.summary,
  top10: reviewQueue.slice(0, 10).map(({ rank, score, stage, tag, text, findings: itemFindings }) => ({
    rank,
    score,
    stage,
    tag,
    text,
    findings: itemFindings.map(({ type, severity, detail }) => ({ type, severity, detail }))
  }))
}, null, 2));
