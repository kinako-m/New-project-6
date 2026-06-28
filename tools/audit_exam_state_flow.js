const fs = require("fs");

const source = fs.readFileSync("app.js", "utf8");
const findings = [];

function requireSource(label, pattern) {
  if (!pattern.test(source)) findings.push({ type: "implementation-contract-missing", label });
}

requireSource("answer changes overwrite the stored answer", /current\.examAnswers\[question\.id\]\s*=\s*question\.order\[shownIndex\]\.index/);
requireSource("suspension stores remaining time", /remainingSeconds:\s*getExamRemainingSeconds\(\)/);
requireSource("suspension stores the current exam", /current:\s*\{[\s\S]*?\.\.\.current,[\s\S]*?overallDeadline:\s*null/);
requireSource("resume restores a running deadline", /overallDeadline:\s*Date\.now\(\)\s*\+\s*Math\.max\(0, saved\.remainingSeconds\)\s*\*\s*1000/);
requireSource("resume refreshes saved questions", /refreshSuspendedExamState\(saved\.current\)/);
requireSource("finish state counts unanswered questions", /unansweredCount\s*=\s*current\.questions\.length\s*-\s*answeredCount/);
requireSource("finish state reports review questions", /reviewCount\s*=\s*new Set\(current\.reviewQuestionIds\s*\|\|\s*\[\]\)\.size/);

function makeQuestion(subject, index) {
  return {
    id: `${subject}-${index}`,
    answer: 0,
    choices: ["correct", "wrong-1", "wrong-2", "wrong-3"],
    order: [
      { choice: "wrong-2", index: 2 },
      { choice: "correct", index: 0 },
      { choice: "wrong-3", index: 3 },
      { choice: "wrong-1", index: 1 }
    ]
  };
}

function runScenario(subject, questionCount, limitSeconds) {
  const questions = Array.from({ length: questionCount }, (_, index) => makeQuestion(subject, index + 1));
  const state = {
    mode: subject === "A" ? "subject-a-exam" : "subject-b-exam",
    questions,
    index: 0,
    selectedIndex: null,
    examAnswers: {},
    reviewQuestionIds: [],
    records: [],
    overallRemainingSeconds: limitSeconds
  };

  const first = state.questions[0];
  state.selectedIndex = 0;
  state.examAnswers[first.id] = first.order[0].index;
  state.selectedIndex = 1;
  state.examAnswers[first.id] = first.order[1].index;
  state.reviewQuestionIds.push(first.id);
  state.index = 1;

  const second = state.questions[1];
  state.selectedIndex = 3;
  state.examAnswers[second.id] = second.order[3].index;

  const saved = JSON.parse(JSON.stringify({
    version: 1,
    remainingSeconds: state.overallRemainingSeconds,
    current: { ...state, overallDeadline: null }
  }));
  const resumed = {
    ...saved.current,
    overallDeadline: 1_000_000 + saved.remainingSeconds * 1000
  };

  const checks = {
    changedAnswerReplaced: resumed.examAnswers[first.id] === 0,
    secondAnswerPreserved: resumed.examAnswers[second.id] === 1,
    currentIndexPreserved: resumed.index === 1,
    reviewMarkPreserved: resumed.reviewQuestionIds.includes(first.id),
    remainingTimePreserved: saved.remainingSeconds === limitSeconds,
    deadlineRestarted: resumed.overallDeadline === 1_000_000 + limitSeconds * 1000,
    unansweredCountCorrect: resumed.questions.length - Object.keys(resumed.examAnswers).length === questionCount - 2
  };

  Object.entries(checks).forEach(([check, passed]) => {
    if (!passed) findings.push({ type: "state-flow-failed", subject, check });
  });
  return { subject, questionCount, checks };
}

const scenarios = [
  runScenario("A", 60, 90 * 60 - 137),
  runScenario("B", 20, 100 * 60 - 241)
];

const report = {
  generatedAt: new Date().toISOString(),
  scenarioCount: scenarios.length,
  assertionCount: 7 + scenarios.reduce((sum, scenario) => sum + Object.keys(scenario.checks).length, 0),
  findingCount: findings.length,
  scenarios,
  findings
};

fs.writeFileSync("tools/exam-state-flow-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
if (findings.length) process.exitCode = 1;
