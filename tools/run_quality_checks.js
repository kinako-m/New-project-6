const { execFileSync } = require("child_process");
const fs = require("fs");

const node = process.execPath;

function runJson(label, args, options = {}) {
  const output = execFileSync(node, args, {
    encoding: "utf8",
    stdio: options.silent ? ["ignore", "pipe", "pipe"] : ["ignore", "pipe", "pipe"]
  });
  if (options.silent) return null;
  try {
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`${label} did not output JSON: ${error.message}`);
  }
}

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function printResult(label, ok, detail) {
  const status = ok ? "OK" : "NG";
  console.log(`${status} ${label}${detail ? ` - ${detail}` : ""}`);
}

const failures = [];
const warnings = [];

function check(label, ok, detail, collection = failures) {
  printResult(label, ok, detail);
  if (!ok) collection.push(`${label}: ${detail || "failed"}`);
}

const choiceSets = runJson("question choice sets", ["tools/audit_question_choice_sets.js"]);
check(
  "question choice sets",
  choiceSets.hardErrors === 0,
  `${choiceSets.appQuestions} app questions, ${choiceSets.questionChoiceSets} choice sets, hardErrors ${choiceSets.hardErrors}`
);

const concept = runJson("concept answer consistency", ["tools/audit_concept_answer_consistency.js"]);
check(
  "concept answer consistency",
  concept.findingCount === 0,
  `${concept.conceptGroups} concept groups, findings ${concept.findingCount}`
);

const contentQuality = runJson("question content quality", ["tools/audit_question_content_quality.js"]);
const contentHigh = contentQuality.severityCounts.high || 0;
const contentMedium = contentQuality.severityCounts.medium || 0;
const contentLow = contentQuality.severityCounts.low || 0;
check(
  "question content quality",
  contentHigh === 0,
  `findings ${contentQuality.findingCount}, high ${contentHigh}, medium ${contentMedium}, low ${contentLow}`
);
if (contentMedium > 0 || contentLow > 0) {
  warnings.push(`question content quality: medium ${contentMedium}, low ${contentLow}`);
}

const acronymCoverage = runJson("acronym coverage", ["tools/audit_acronym_coverage.js"]);
check(
  "acronym coverage",
  acronymCoverage.missingCount === 0,
  `${acronymCoverage.registeredCount} registered, missing ${acronymCoverage.missingCount}`
);

const explanationQuality = runJson("explanation quality", ["tools/audit_explanation_quality.js"]);
const explanationHigh = explanationQuality.severityCounts.high || 0;
const explanationMedium = explanationQuality.severityCounts.medium || 0;
const explanationLow = explanationQuality.severityCounts.low || 0;
check(
  "explanation quality",
  explanationHigh === 0,
  `findings ${explanationQuality.findingCount}, high ${explanationHigh}, medium ${explanationMedium}, low ${explanationLow}`
);
if (explanationMedium > 0 || explanationLow > 0) {
  warnings.push(`explanation quality: medium ${explanationMedium}, low ${explanationLow}`);
}

runJson("choice candidate quality", ["tools/audit_choice_candidate_quality.js"], { silent: true });
const choiceQuality = readJson("tools/choice-candidate-quality-report.json");
const highSeverity = choiceQuality.summary.severityCounts.high || 0;
const mediumSeverity = choiceQuality.summary.severityCounts.medium || 0;
const lowSeverity = choiceQuality.summary.severityCounts.low || 0;
check(
  "choice candidate quality",
  highSeverity === 0,
  `high ${highSeverity}, medium ${mediumSeverity}, low ${lowSeverity}`
);
if (mediumSeverity > 0 || lowSeverity > 0) {
  warnings.push(`choice candidate quality: medium ${mediumSeverity}, low ${lowSeverity}`);
}

const exam = runJson("full exam generation", ["tools/audit_full_exam_generation.js", "--iterations=100"]);
check(
  "full exam generation",
  exam.findingCount === 0,
  `A counts ${exam.subjectAQuestionCounts.join("/")}, B counts ${exam.subjectBQuestionCounts.join("/")}, findings ${exam.findingCount}`
);

const examStateFlow = runJson("exam state flow", ["tools/audit_exam_state_flow.js"]);
check(
  "exam state flow",
  examStateFlow.findingCount === 0,
  `${examStateFlow.scenarioCount} scenarios, ${examStateFlow.assertionCount} assertions, findings ${examStateFlow.findingCount}`
);

const examResultFlow = runJson("exam result flow", ["tools/audit_exam_result_flow.js"]);
check(
  "exam result flow",
  examResultFlow.findingCount === 0,
  `${examResultFlow.scenarioCount} scenarios, ${examResultFlow.assertionCount} assertions, findings ${examResultFlow.findingCount}`
);

const responsiveLayout = runJson("responsive layout", ["tools/audit_responsive_layout.js"]);
check(
  "responsive layout",
  responsiveLayout.findingCount === 0,
  `${responsiveLayout.assertionCount} assertions, findings ${responsiveLayout.findingCount}`
);

const battleFlow = runJson("battle flow", ["tools/audit_battle_flow.js"]);
check(
  "battle flow",
  battleFlow.findingCount === 0,
  `${battleFlow.scenarioCount} scenarios, ${battleFlow.assertionCount} assertions, findings ${battleFlow.findingCount}`
);

const subjectBDifficulty = runJson("subject B difficulty", ["tools/audit_subject_b_difficulty.js", "--iterations=100"]);
check(
  "subject B difficulty",
  subjectBDifficulty.findingCount === 0,
  `${subjectBDifficulty.subjectBPool} candidates, basic ${subjectBDifficulty.difficultyCounts.basic || 0}, standard ${subjectBDifficulty.difficultyCounts.standard || 0}, advanced ${subjectBDifficulty.difficultyCounts.advanced || 0}`
);

const reinforcement = runJson("reinforcement generation", ["tools/audit_reinforcement_generation.js"]);
check(
  "reinforcement generation",
  reinforcement.findingCount === 0,
  `${reinforcement.expectedQuestionCount} questions, minimum ${reinforcement.minimumPerStage} per stage, findings ${reinforcement.findingCount}`
);

const readiness = runJson("pass readiness", ["tools/audit_pass_readiness.js"]);
check(
  "pass readiness",
  readiness.findingCount === 0,
  `${readiness.caseCount} calibration cases, findings ${readiness.findingCount}`
);

check(
  "full exam size",
  exam.subjectAQuestionCounts.length === 1
    && exam.subjectAQuestionCounts[0] === 60
    && exam.subjectBQuestionCounts.length === 1
    && exam.subjectBQuestionCounts[0] === 20,
  `A ${exam.subjectAQuestionCounts.join("/")}, B ${exam.subjectBQuestionCounts.join("/")}`
);

const publish = runJson("publish readiness", ["tools/audit_publish_readiness.js"]);
check(
  "publish readiness",
  publish.findingCount === 0,
  `${publish.referenceCount} refs, ${publish.runtimeAssetsNotPrecached} runtime assets not precached`
);

if (warnings.length) {
  console.log("\nWarnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (failures.length) {
  console.error("\nQuality checks failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("\nAll required quality checks passed.");
