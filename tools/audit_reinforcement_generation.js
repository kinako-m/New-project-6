const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const functionName = "selectBalancedReinforcementCandidates";
const start = source.indexOf(`function ${functionName}`);
if (start < 0) throw new Error(`${functionName} was not found`);

let depth = 0;
let end = -1;
let opened = false;
for (let index = start; index < source.length; index += 1) {
  if (source[index] === "{") {
    depth += 1;
    opened = true;
  } else if (source[index] === "}") {
    depth -= 1;
    if (opened && depth === 0) {
      end = index + 1;
      break;
    }
  }
}
if (end < 0) throw new Error(`${functionName} could not be parsed`);

const context = { result: null };
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}; result = ${functionName};`, context);
const selectCandidates = context.result;
const stageIds = ["technology", "algorithm", "database", "management", "strategy"];
const findings = [];

for (let iteration = 1; iteration <= 100; iteration += 1) {
  const candidates = stageIds.flatMap((stageId, stageIndex) =>
    Array.from({ length: 30 }, (_, index) => ({
      id: `${stageId}-${index}`,
      stageId,
      reinforcementPriority: ((index * 37 + stageIndex * 19 + iteration * 11) % 997)
    }))
  ).sort((a, b) => b.reinforcementPriority - a.reinforcementPriority);
  const selected = selectCandidates(candidates, stageIds, 20, 2);
  const counts = Object.fromEntries(stageIds.map((stageId) => [stageId, selected.filter((item) => item.stageId === stageId).length]));
  const uniqueCount = new Set(selected.map((item) => item.id)).size;

  if (selected.length !== 20) findings.push({ iteration, type: "question-count", actual: selected.length });
  if (uniqueCount !== selected.length) findings.push({ iteration, type: "duplicate-question", uniqueCount });
  stageIds.forEach((stageId) => {
    if (counts[stageId] < 2) findings.push({ iteration, type: "stage-minimum", stageId, actual: counts[stageId] });
  });
}

console.log(JSON.stringify({
  iterations: 100,
  expectedQuestionCount: 20,
  minimumPerStage: 2,
  findingCount: findings.length,
  samples: findings.slice(0, 20)
}, null, 2));
