const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

const TARGETS = new Set([
  "technology/頻出計算",
  "algorithm/擬似言語",
  "algorithm/トレース",
  "database/SQL",
  "database/正規化"
]);

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
  stage.questions.map((question) => ({ ...question, stageId: stage.id }))
);

function normalize(value) {
  return String(value).normalize("NFKC").replace(/\s+/g, "").toLowerCase();
}

function targetKey(question) {
  return `${question.stageId}/${question.tag}`;
}

function numericParts(value) {
  const match = String(value).match(/^(-?\d+(?:\.\d+)?)(MB|回|個)?$/);
  return match ? { number: Number(match[1]), suffix: match[2] || "", raw: match[1] } : null;
}

function questionFamily(question) {
  const text = question.text;
  if (numericParts(choiceSets[text].correct)) return "numeric";
  if (/計算量はどれか/.test(text)) return "complexity";
  if (/SQLの句はどれか|まとめる句はどれか/.test(text)) return "sql-clause";
  if (/SQL命令はどれか/.test(text)) return "sql-command";
  if (/に該当する用語はどれか/.test(text)) return "term";
  if (/の説明として/.test(text)) return "description";
  if (/を見分ける特徴として/.test(text)) return "feature";
  if (/主な目的はどれか/.test(text)) return "purpose";
  return null;
}

function numericCandidates(correct) {
  const parts = numericParts(correct);
  if (!parts) return [];
  const { number, suffix, raw } = parts;
  if (raw.includes(".")) {
    return [number - 0.01, number + 0.01, number - 0.05, number + 0.05, number - 0.1, number + 0.1, 1 - number, number / 2]
      .filter((value) => value >= 0)
      .map((value) => `${Number(value.toFixed(2))}${suffix}`);
  }
  const step = Math.max(1, Math.round(Math.abs(number) * 0.1));
  return [
    number - 1,
    number + 1,
    number - step,
    number + step,
    number - 2,
    number + 2,
    number - 3,
    number + 3,
    number * 2,
    number * 3,
    Math.max(0, Math.floor(number / 2))
  ].map((value) => `${value}${suffix}`);
}

const explicit = new Map([
  ["平均故障間隔を表す指標はどれか。", ["RPO", "可用性", "故障率"]],
  ["平均修復時間を表す指標はどれか。", ["RPO", "可用性", "故障率"]],
  ["キャッシュのヒット率が高いほど一般にどうなるか。", [
    "主記憶への参照回数が減る",
    "キャッシュミス率が高くなる",
    "平均アクセス時間は変化しない"
  ]],
  ["変数 flag がtrueのときだけ処理Aを実行する。flag=falseなら実行される処理はどれか。", [
    "処理Aの代わりに条件判定が繰り返される",
    "flagが自動的にtrueへ変更される",
    "処理Aの途中から実行される"
  ]],
  ["正規化の主な目的はどれか。", [
    "更新・追加・削除時の異常を減らす",
    "同じ事実を複数箇所へ保存する",
    "表間の依存関係を無視する"
  ]]
]);

const familyReferences = new Map([
  ["algorithm/擬似言語/term", ["分割統治法", "貪欲法", "バックトラッキング", "幅優先探索", "深さ優先探索"]],
  ["algorithm/擬似言語/feature", [
    "問題を分割して結果を統合する",
    "各段階で最良候補を選ぶ",
    "条件に合わなければ直前の状態へ戻る",
    "キューを使って近い頂点から調べる",
    "スタックを使って奥まで調べる"
  ]],
  ["database/SQL/sql-clause", ["SELECT", "FROM", "DISTINCT", "LIMIT", "OFFSET", "JOIN"]],
  ["database/SQL/sql-command", ["SELECT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP"]],
  ["database/SQL/description", [
    "条件に一致する行を抽出するSQL句です。",
    "表へ新しい行を追加するSQL命令です。",
    "既存の行を更新するSQL命令です。",
    "表から行を削除するSQL命令です。",
    "重複した検索結果を除外する指定です。"
  ]],
  ["database/SQL/feature", [
    "表から列を選択する",
    "表へ新しい行を追加する",
    "既存行の値を更新する",
    "表から行を削除する",
    "重複する結果を除外する"
  ]],
  ["database/正規化/term", ["非正規形", "BCNF", "第4正規形", "第5正規形"]],
  ["database/正規化/feature", [
    "全ての決定項を候補キーにする",
    "多値従属を取り除く",
    "結合従属性を取り除く",
    "繰返し項目を残す"
  ]],
  ["database/正規化/purpose", [
    "検索結果を必ず一件に限定する",
    "全ての表を物理的に一つへ統合する",
    "更新時の不整合を増やす"
  ]]
]);

const pools = new Map();
for (const question of questions) {
  if (!TARGETS.has(targetKey(question))) continue;
  const family = questionFamily(question);
  if (!family || family === "numeric") continue;
  const poolKey = `${targetKey(question)}/${family}`;
  if (!pools.has(poolKey)) pools.set(poolKey, []);
  pools.get(poolKey).push(choiceSets[question.text].correct);
}

const expanded = [];
const skipped = [];
for (const question of questions) {
  const key = targetKey(question);
  const definition = choiceSets[question.text];
  if (!TARGETS.has(key) || definition.distractors.length >= 6) continue;

  const family = questionFamily(question);
  let candidates = [...(explicit.get(question.text) || [])];
  if (family === "numeric") {
    candidates.push(...numericCandidates(definition.correct));
  } else if (family === "complexity") {
    candidates.push("O(1)", "O(log n)", "O(√n)", "O(n)", "O(n log n)", "O(n²)", "O(n³)", "O(2ⁿ)", "O(n!)");
  } else if (family) {
    candidates.push(...(pools.get(`${key}/${family}`) || []));
    candidates.push(...(familyReferences.get(`${key}/${family}`) || []));
  }

  const existing = new Set([definition.correct, ...definition.distractors].map(normalize));
  const additions = [...new Set(candidates)]
    .filter((candidate) => !existing.has(normalize(candidate)))
    .slice(0, 6 - definition.distractors.length);

  if (additions.length !== 6 - definition.distractors.length) {
    skipped.push({ text: question.text, key, family, needed: 6 - definition.distractors.length, found: additions.length });
    continue;
  }
  definition.distractors.push(...additions);
  expanded.push({ text: question.text, key, family, additions });
}

const output = `// Generated and maintained as the source of truth for per-question choices.
// Edit the correct answer, distractors, and optional choiceNotes for each question here.
// Add at least three distractors. Six or more allows varied choices between challenges.
globalThis.QUESTION_CHOICE_SETS = ${JSON.stringify(choiceSets, null, 2)};

if (typeof module !== "undefined") module.exports = globalThis.QUESTION_CHOICE_SETS;
`;

if (process.argv.includes("--write")) fs.writeFileSync("question-choice-sets.js", output);
console.log(JSON.stringify({
  mode: process.argv.includes("--write") ? "write" : "dry-run",
  expandedQuestions: expanded.length,
  byTarget: expanded.reduce((counts, item) => {
    counts[item.key] = (counts[item.key] || 0) + 1;
    return counts;
  }, {}),
  skipped
}, null, 2));
