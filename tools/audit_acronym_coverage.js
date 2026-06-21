const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const dataEnd = source.indexOf("const els =");
const acronymStart = source.indexOf("const ACRONYM_EXPLANATIONS =");
const acronymEnd = source.indexOf("\n};", acronymStart) + 3;
const dataSource = `${source.slice(0, dataEnd)}
${source.slice(acronymStart, acronymEnd)}
result = { stages, ACRONYM_EXPLANATIONS };`;
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

const { stages, ACRONYM_EXPLANATIONS } = context.result;
const registered = new Set(Object.keys(ACRONYM_EXPLANATIONS || {}).map((key) => key.toLowerCase()));

const ignoredTerms = new Set(
  [
    "a", "b", "c", "d", "n", "x", "true", "false", "null",
    "select", "from", "where", "group", "by", "order", "having", "insert", "update", "delete",
    "count", "sum", "avg", "max", "min", "join", "inner", "left", "right", "outer", "as",
    "and", "or", "not", "like", "in", "on", "into", "values", "set",
    "check", "commit", "unique", "rollback", "savepoint", "lock", "cross", "get",
    "if", "then", "else", "for", "while", "return",
    "kb", "mb", "gb", "tb", "bps", "dpi", "px",
    "utf", "unicode", "ascii",
    "aa", "aaa", "aaabbccdaa", "aabbbaac", "aabcda", "abac", "abcd", "abcda",
    "banana", "banaxa", "baxana", "baxaxa", "bb", "bbb", "cc", "cd", "ff", "xxxxxx",
  ].map((item) => item.toLowerCase())
);

function isAcronymCandidate(token) {
  const normalized = token.replace(/[.]+$/g, "");
  if (normalized.length < 2) return false;
  if (ignoredTerms.has(normalized.toLowerCase())) return false;
  if (/^\d+(?:KB|MB|GB|TB)$/i.test(normalized)) return false;
  if (/^O\(.+\)$/i.test(normalized)) return false;
  if (/^[a-z]$/i.test(normalized)) return false;
  if (/^[A-Z]{2,}[0-9]*$/.test(normalized)) return true;
  if (/^[A-Z][a-z]*[A-Z][A-Za-z0-9]*$/.test(normalized)) return true;
  if (/^[0-9]+[A-Z][A-Za-z0-9]*$/.test(normalized)) return true;
  if (/^[A-Z][A-Za-z]+-[A-Za-z0-9]+$/.test(normalized)) return true;
  return false;
}

function extractAcronyms(value) {
  const text = String(value || "");
  const result = new Set();
  for (const match of text.matchAll(/[A-Za-z0-9][A-Za-z0-9+.-]*[A-Za-z0-9]/g)) {
    const token = match[0].replace(/[.]+$/g, "");
    if (isAcronymCandidate(token)) result.add(token);
  }
  return [...result];
}

function questionTexts(question) {
  return [
    question.text,
    question.explanation,
    ...(Array.isArray(question.choices) ? question.choices : []),
  ];
}

const questions = stages.flatMap((stage) =>
  stage.questions.map((question, index) => ({
    ...question,
    id: `${stage.id}-${String(index + 1).padStart(3, "0")}`,
    stageId: stage.id,
    stageName: stage.name,
  }))
);

const byTerm = new Map();
for (const question of questions) {
  const terms = new Set(questionTexts(question).flatMap(extractAcronyms));
  for (const term of terms) {
    const key = term.toLowerCase();
    if (registered.has(key) || ignoredTerms.has(key)) continue;
    if (!byTerm.has(key)) {
      byTerm.set(key, {
        term,
        count: 0,
        samples: [],
      });
    }
    const entry = byTerm.get(key);
    entry.count += 1;
    if (entry.samples.length < 5) {
      entry.samples.push({
        id: question.id,
        stage: question.stageName,
        tag: question.tag,
        text: question.text,
      });
    }
  }
}

const missing = [...byTerm.values()].sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
const report = {
  generatedAt: new Date().toISOString(),
  questionCount: questions.length,
  registeredCount: registered.size,
  missingCount: missing.length,
  missing,
};

const markdown = [
  "# Acronym Coverage Report",
  "",
  `Generated: ${report.generatedAt}`,
  `Questions: ${report.questionCount}`,
  `Registered acronyms: ${report.registeredCount}`,
  `Missing acronyms: ${report.missingCount}`,
  "",
  ...missing.map((entry) => [
    `## ${entry.term}`,
    "",
    `- Count: ${entry.count}`,
    ...entry.samples.map((sample) => `- ${sample.id} / ${sample.stage} / ${sample.tag}: ${sample.text}`),
    "",
  ].join("\n")),
].join("\n");

fs.writeFileSync("tools/acronym-coverage-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/acronym-coverage-report.md", markdown);

console.log(JSON.stringify({
  questionCount: report.questionCount,
  registeredCount: report.registeredCount,
  missingCount: report.missingCount,
  missing: report.missing.slice(0, 30),
}, null, 2));

if (missing.length) process.exit(1);
