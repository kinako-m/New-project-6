const fs = require("fs");
const choiceSets = require("../question-choice-sets.js");

function compact(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "")
    .replace(/(?:です|である)$/g, "");
}

function kind(value) {
  const text = String(value || "").trim();
  if (/^-?[\d,.]+(?:%|回|日|秒|円|万円|個|件|台|人|倍)?$/.test(text)) return "numeric";
  if (/^[A-Z][A-Z0-9 /+.-]*$/.test(text) || compact(text).length <= 14) return "term";
  return "sentence";
}

function bigrams(value) {
  const text = compact(value);
  const result = new Set();
  for (let index = 0; index < text.length - 1; index += 1) result.add(text.slice(index, index + 2));
  return result;
}

function similarity(left, right) {
  const a = bigrams(left);
  const b = bigrams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / new Set([...a, ...b]).size;
}

const entries = Object.entries(choiceSets);
const repaired = [];

entries.forEach(([questionText, definition]) => {
  const original = Array.isArray(definition.distractors) ? definition.distractors : [];
  const seen = new Set();
  const correctKey = compact(definition.correct);
  const distractors = original.filter((candidate) => {
    const key = compact(candidate);
    if (!key || key === correctKey || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (distractors.length === original.length) return;

  const targetKind = kind(definition.correct);
  const candidates = entries
    .filter(([otherText, other]) =>
      otherText !== questionText
      && other.stageId === definition.stageId
      && other.tag === definition.tag
    )
    .flatMap(([otherText, other]) => [other.correct, ...(other.distractors || [])].map((choice) => ({
      choice,
      sourceText: otherText,
      score: similarity(questionText, otherText)
    })))
    .filter(({ choice }) => {
      const key = compact(choice);
      return key && key !== correctKey && !seen.has(key) && kind(choice) === targetKind;
    })
    .sort((left, right) => right.score - left.score || Math.abs(String(left.choice).length - String(definition.correct).length) - Math.abs(String(right.choice).length - String(definition.correct).length));

  for (const candidate of candidates) {
    if (distractors.length >= 6) break;
    const key = compact(candidate.choice);
    if (seen.has(key)) continue;
    distractors.push(candidate.choice);
    seen.add(key);
  }

  definition.distractors = distractors;
  repaired.push({
    question: questionText,
    before: original.length,
    after: distractors.length,
    removed: original.length - new Set(original.map(compact)).size
  });
});

const header = `// Generated and maintained as the source of truth for per-question choices.\n// Edit the correct answer, distractors, and optional choiceNotes for each question here.\n// Add at least three distractors. Six or more allows varied choices between challenges.\n`;
const output = `${header}globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};\n\nif (typeof module !== 'undefined') module.exports = globalThis.QUESTION_CHOICE_SETS;\n`;
fs.writeFileSync("question-choice-sets.js", output);
console.log(JSON.stringify({ repairedCount: repaired.length, repaired }, null, 2));
