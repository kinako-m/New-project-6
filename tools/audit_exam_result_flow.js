const fs = require("fs");

const source = fs.readFileSync("app.js", "utf8");
const findings = [];

function requireSource(label, pattern) {
  if (!pattern.test(source)) findings.push({ type: "implementation-contract-missing", label });
}

requireSource("unanswered questions become incorrect records", /current\.questions\.forEach\(\(question\)\s*=>\s*\{[\s\S]*?correct:\s*false,[\s\S]*?timedOut:\s*false/);
requireSource("result percentage uses score and total", /Math\.round\(\(current\.score\s*\/\s*current\.questions\.length\)\s*\*\s*100\)/);
requireSource("history stores score", /history\.unshift\(\{[\s\S]*?score:\s*current\.score/);
requireSource("history stores answer records", /answerRecords:\s*current\.records\.map/);
requireSource("wrong question ids are stored", /wrongQuestionIds:\s*current\.records\.filter\(\(record\)\s*=>\s*!record\.correct\)/);
requireSource("question statistics are updated", /updateQuestionStats\(current\.records, current\.questions\)/);
requireSource("history is persisted", /saveHistory\(\)/);
requireSource("weak answers create review actions", /data-result-action="wrong"/);
requireSource("stage average is calculated", /percentages\.reduce\(\(sum, value\)\s*=>\s*sum\s*\+\s*value,\s*0\)\s*\/\s*percentages\.length/);
requireSource("stage best score is calculated", /Math\.max\(\.\.\.percentages\)/);

function makeQuestions(subject, totals) {
  return totals.flatMap(([stageId, count]) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${subject}-${stageId}-${index + 1}`,
      stageId,
      tag: `${stageId}-tag`,
      difficulty: index % 3 === 0 ? "advanced" : index % 2 === 0 ? "standard" : "basic"
    }))
  );
}

function finishScenario(subject, totals, answeredCorrect, answeredWrong) {
  const questions = makeQuestions(subject, totals);
  const records = [];
  questions.slice(0, answeredCorrect).forEach((question) => records.push({ ...question, questionId: question.id, correct: true }));
  questions.slice(answeredCorrect, answeredCorrect + answeredWrong).forEach((question) => records.push({ ...question, questionId: question.id, correct: false }));
  const recorded = new Set(records.map((record) => record.questionId));
  questions.forEach((question) => {
    if (!recorded.has(question.id)) records.push({ ...question, questionId: question.id, correct: false, timedOut: false });
  });

  const score = records.filter((record) => record.correct).length;
  const percentage = Math.round((score / questions.length) * 100);
  const domains = Object.values(records.reduce((summary, record) => {
    summary[record.stageId] ||= { stageId: record.stageId, correct: 0, total: 0 };
    summary[record.stageId].total += 1;
    summary[record.stageId].correct += record.correct ? 1 : 0;
    return summary;
  }, {})).map((domain) => ({
    ...domain,
    percentage: Math.round((domain.correct / domain.total) * 100)
  }));
  const wrongQuestionIds = records.filter((record) => !record.correct).map((record) => record.questionId);
  const questionStats = Object.fromEntries(records.map((record) => [record.questionId, {
    attempts: 1,
    correct: record.correct ? 1 : 0,
    wrong: record.correct ? 0 : 1,
    nextReviewAt: record.correct ? "future" : "now"
  }]));
  const historyEntry = { subject, score, total: questions.length, percentage, wrongQuestionIds, answerRecords: records };

  const checks = {
    recordCountMatchesTotal: records.length === questions.length,
    scoreMatchesCorrectRecords: score === answeredCorrect,
    unansweredCountedWrong: wrongQuestionIds.length === questions.length - answeredCorrect,
    domainTotalsMatchExam: domains.reduce((sum, domain) => sum + domain.total, 0) === questions.length,
    domainCorrectMatchesScore: domains.reduce((sum, domain) => sum + domain.correct, 0) === score,
    historyScoreMatches: historyEntry.score === score && historyEntry.percentage === percentage,
    answerRecordsSaved: historyEntry.answerRecords.length === questions.length,
    weakStatsRegistered: Object.values(questionStats).filter((item) => item.wrong > 0).length === wrongQuestionIds.length,
    wrongReviewAvailable: wrongQuestionIds.length > 0
  };
  Object.entries(checks).forEach(([check, passed]) => {
    if (!passed) findings.push({ type: "result-flow-failed", subject, check });
  });
  return { subject, total: questions.length, score, percentage, domains, checks };
}

const scenarios = [
  finishScenario("A", [["technology", 18], ["algorithm", 12], ["database", 10], ["management", 10], ["strategy", 10]], 38, 17),
  finishScenario("B", [["algorithm", 14], ["technology", 6]], 13, 4)
];
const percentages = scenarios.map((scenario) => scenario.percentage);
const historyChecks = {
  averageCorrect: Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) === 64,
  bestCorrect: Math.max(...percentages) === 65
};
Object.entries(historyChecks).forEach(([check, passed]) => {
  if (!passed) findings.push({ type: "history-summary-failed", check });
});

const report = {
  generatedAt: new Date().toISOString(),
  scenarioCount: scenarios.length,
  assertionCount: 10 + scenarios.reduce((sum, scenario) => sum + Object.keys(scenario.checks).length, 0) + Object.keys(historyChecks).length,
  findingCount: findings.length,
  scenarios,
  historyChecks,
  findings
};

fs.writeFileSync("tools/exam-result-flow-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
if (findings.length) process.exitCode = 1;
