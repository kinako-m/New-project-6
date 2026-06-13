const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "technology/ハードウェア",
  "technology/ネットワーク",
  "technology/セキュリティ",
  "algorithm/データ構造",
  "algorithm/探索",
  "algorithm/整列",
  "algorithm/計算量",
  "database/SQL",
  "database/キー",
  "database/トランザクション",
  "database/制約",
  "management/テスト"
]);

function normalize(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function keyOf(definition) {
  return `${definition.stageId}/${definition.tag}`;
}

function questionFamily(text) {
  if (text.includes("に該当する用語はどれか")) return "term-from-description";
  if (text.includes("の説明として")) return "description";
  if (text.includes("を見分ける特徴として")) return "feature";
  return null;
}

function poolKey(text, definition) {
  const family = questionFamily(text);
  return family ? `${keyOf(definition)}/${family}` : null;
}

function scoreCandidate(candidate, currentChoices) {
  const averageLength = currentChoices.reduce((sum, choice) => sum + choice.length, 0)
    / currentChoices.length;
  return Math.abs(candidate.length - averageLength);
}

const pools = new Map();
for (const [text, definition] of Object.entries(choiceSets)) {
  const key = keyOf(definition);
  if (!TARGETS.has(key)) continue;
  const candidatePoolKey = poolKey(text, definition);
  if (!candidatePoolKey) continue;
  if (!pools.has(candidatePoolKey)) pools.set(candidatePoolKey, []);
  pools.get(candidatePoolKey).push(definition.correct);
}

const expanded = [];
for (const [text, definition] of Object.entries(choiceSets)) {
  const key = keyOf(definition);
  if (!TARGETS.has(key) || definition.distractors.length >= 6) continue;

  const candidatePoolKey = poolKey(text, definition);
  if (!candidatePoolKey) continue;
  const currentChoices = [definition.correct, ...definition.distractors];
  const existing = new Set(currentChoices.map(normalize));
  const candidates = [...new Set(pools.get(candidatePoolKey) || [])]
    .filter((candidate) => !existing.has(normalize(candidate)))
    .sort((a, b) => scoreCandidate(a, currentChoices) - scoreCandidate(b, currentChoices));

  const additions = candidates.slice(0, 6 - definition.distractors.length);
  if (additions.length < 3) continue;

  definition.distractors.push(...additions);
  expanded.push({
    text,
    key,
    family: questionFamily(text),
    added: additions
  });
}

const output = `// Generated and maintained as the source of truth for per-question choices.
// Edit the correct answer, distractors, and optional choiceNotes for each question here.
// Add at least three distractors. Six or more allows varied choices between challenges.
globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};

if (typeof module !== "undefined") module.exports = globalThis.QUESTION_CHOICE_SETS;
`;

if (process.argv.includes("--write")) {
  fs.writeFileSync("question-choice-sets.js", output);
}

const summary = {};
for (const item of expanded) summary[item.key] = (summary[item.key] || 0) + 1;
console.log(JSON.stringify({
  mode: process.argv.includes("--write") ? "write" : "dry-run",
  expandedQuestions: expanded.length,
  summary,
  samples: expanded.slice(0, 20)
}, null, 2));
