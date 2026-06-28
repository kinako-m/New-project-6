const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("app.js", "utf8");
const functionName = "calculatePassReadinessScore";
const start = source.indexOf(`function ${functionName}`);
if (start < 0) throw new Error(`${functionName} was not found`);

let depth = 0;
let end = -1;
for (let index = source.indexOf("{", start); index < source.length; index += 1) {
  if (source[index] === "{") depth += 1;
  if (source[index] === "}") {
    depth -= 1;
    if (depth === 0) {
      end = index + 1;
      break;
    }
  }
}

const context = { result: null, stages: Array.from({ length: 5 }) };
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}; result = ${functionName};`, context);
const calculate = context.result;
const cases = [
  { name: "no-data", args: [0, 0, 0, 0, 0, 0], expected: 0 },
  { name: "borderline-pass", args: [600, 600, 40, 40, 70, 5], expected: 96 },
  { name: "stable-pass", args: [600, 600, 50, 50, 70, 5], expected: 100 },
  { name: "score-is-capped", args: [1000, 1000, 100, 100, 100, 5], expected: 100 }
];
const findings = cases.flatMap((item) => {
  const actual = calculate(...item.args);
  return actual === item.expected ? [] : [{ name: item.name, expected: item.expected, actual }];
});

console.log(JSON.stringify({ caseCount: cases.length, findingCount: findings.length, findings }, null, 2));
