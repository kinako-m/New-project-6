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
