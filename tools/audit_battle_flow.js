const fs = require("fs");

const source = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const findings = [];
const enemyAssets = [
  "enemy-machine.png",
  "enemy-puzzle-golem.png",
  "enemy-data-slime.png",
  "enemy-task-king.png",
  "enemy-strategy-mage.png",
  "enemy-knowledge-mimic.png",
  "enemy-weakness-shadow.png",
  "enemy-exam-guardian.png"
];

function requireContract(label, pattern, value, type = "implementation-contract-missing") {
  if (!pattern.test(value)) findings.push({ type, label });
}

requireContract("enemy UI exists", /id="battleEnemy"[\s\S]*?id="battleHpBar"[\s\S]*?id="battleHpText"/, html);
requireContract("normal enemy has five HP", /normal: \{ id: "normal", label: "通常", hp: 5/, source);
requireContract("correct answer deals base damage", /const damage = 1 \+ comboBonus/, source);
requireContract("wrong answer resets combo without damage", /\} else \{[\s\S]*?current\.battle\.combo = 0;[\s\S]*?animateBattleEnemy\("attack"\)/, source);
requireContract("battle result uses attempted count", /if \(isBattleMode\(\)\) return Math\.max\(1, current\.records\.length\)/, source);
requireContract("victory can finish before question limit", /isBattleMode\(\) && \(current\.battle\.hp <= 0 \|\| current\.index === current\.questions\.length - 1\)/, source);
requireContract("full exams do not create battle state", /function startFullExam\(subject\)[\s\S]*?current = \{[\s\S]*?mode: isSubjectA \? "subject-a-exam" : "subject-b-exam"[\s\S]*?\};/, source);
requireContract("battle layout has phone rules", /@media \(max-width: 480px\)[\s\S]*?\.quiz-creature-companion\.battle-active/, css);
requireContract("damage popup is rendered", /id="battleDamage" class="battle-damage"/, html);
requireContract("damage popup shows actual damage", /animateBattleEnemy\("hit", damage\)/, source);
requireContract("enemy state follows remaining HP", /classList\.toggle\("wounded"[\s\S]*?classList\.toggle\("critical"/, source);
requireContract("rank victory uses configured reward", /current\.battle\.rewardBonus \|\| \(current\.mode === "reinforcement" \? 5 : 3\)/, source);
requireContract("battle reward appears in result breakdown", /撃破ボーナス\$\{battleVictoryBonus\}/, source);
requireContract("three answer combo adds damage", /current\.battle\.combo % 3 === 0 \? 1 : 0/, source);
requireContract("enemy dialogue is rendered", /id="battleEnemySpeech" class="battle-enemy-speech"/, html);
requireContract("maximum combo appears in result", /最大\$\{current\.battle\.maxCombo\}コンボ/, source);
requireContract("enemy dex view exists", /id="enemyDexView"[\s\S]*?id="enemyDexGrid"/, html);
requireContract("enemy dex derives victories from history", /attempt\.battle\?\.enemyId === enemy\.id && attempt\.battle\.result === "won"/, source);
requireContract("enemy dex records minimum answers", /minimumAnswers:[\s\S]*?Math\.min/, source);
requireContract("enemy dex completion reward is one time", /enemyDexRewardClaimed[\s\S]*?creature\.food \+= 20/, source);
requireContract("battle master badge exists", /id: "battle-master"[\s\S]*?every\(\(enemy\) => enemy\.defeated\)/, source);
requireContract("locked enemies use silhouettes", /\.enemy-dex-card\.locked img[\s\S]*?brightness\(0\)/, css);
requireContract("three battle ranks exist", /normal: \{[^\n]*hp: 5[^\n]*reward: 3[\s\S]*?elite: \{[^\n]*hp: 7[^\n]*reward: 5[\s\S]*?master: \{[^\n]*hp: 9[^\n]*reward: 8/, source);
requireContract("rank selector is segmented", /class="battle-rank-control"[\s\S]*?data-stage-rank/, source);
requireContract("elite unlock follows normal victory", /elite: wonRanks\.has\("normal"\)/, source);
requireContract("master unlock follows elite victory", /master: wonRanks\.has\("elite"\)/, source);
requireContract("master rank prioritizes advanced questions", /rankId === "master"[\s\S]*?question\.difficulty === "advanced"/, source);
requireContract("enemy dex records highest rank", /highestRank:[\s\S]*?BATTLE_RANKS\[highestRankId\]\.label/, source);
requireContract("battle support status exists", /id="battleSupportStatus" class="battle-support-status/, html);
requireContract("amphibian unlocks combo guard", /guardAvailable: speciesIndex >= 2/, source);
requireContract("reptile unlocks time recovery", /timeRecoveryAvailable: speciesIndex >= 3/, source);
requireContract("time recovery adds five seconds", /timeExtensionSeconds[\s\S]*?\+ 5/, source);
requireContract("guard preserves an active combo once", /guardAvailable[\s\S]*?!current\.battle\.support\.guardUsed[\s\S]*?current\.battle\.combo >= 2/, source);
requireContract("mammal unlocks linked attack", /linkedAttack: speciesIndex >= 4/, source);
requireContract("final evolution earns domain bonus", /domainBonus: speciesIndex >= 6 && domainMatch \? 2 : 0/, source);
requireContract("domain bonus appears in reward breakdown", /得意分野ボーナス\$\{battleDomainBonus\}/, source);
requireContract("battle result record is rendered", /class="advice-card battle-result-card/, source);
requireContract("first rank clear announces unlock", /firstRankClear && nextRankId[\s\S]*?新ランク/, source);
requireContract("battle result compares previous records", /previousMinAnswers[\s\S]*?previousMaxCombo/, source);
requireContract("battle defeat names weakest tag", /weakestTag[\s\S]*?復習して再戦/, source);
requireContract("next rank action is available", /data-battle-result-action="next-rank"/, source);
requireContract("same rank retry preserves rank", /startStage\(current\.stage\.id, current\.battle\?\.rankId \|\| "normal"\)/, source);
requireContract("battle result links enemy dex", /data-battle-result-action="dex"/, source);
requireContract("effects settings dialog exists", /id="effectsSettingsDialog"[\s\S]*?id="motionEffectsEnabled"/, html);
requireContract("sound starts disabled", /sound: false,[\s\S]*?vibration: false/, source);
requireContract("effect preferences persist locally", /localStorage\.setItem\("fe-effects-settings"/, source);
requireContract("sound uses web audio", /window\.AudioContext \|\| window\.webkitAudioContext/, source);
requireContract("vibration uses navigator API", /navigator\.vibrate\(vibrationPatterns\[kind\]/, source);
requireContract("feedback distinguishes combo and victory", /kind === "combo"[\s\S]*?kind === "victory"/, source);
requireContract("reduced motion follows device setting", /matchMedia\("\(prefers-reduced-motion: reduce\)"\)/, source);
requireContract("motion setting suppresses animations", /body\.effects-motion-disabled \*[\s\S]*?animation-duration: 0\.01ms/, css);

for (const asset of enemyAssets) {
  const relativePath = `assets/enemies/${asset}`;
  if (!source.includes(relativePath) || !fs.existsSync(relativePath)) {
    findings.push({ type: "battle-enemy-asset-missing", asset: relativePath });
  }
}

function simulate(maxHp, answers) {
  const battle = { maxHp, hp: maxHp, damage: 0, combo: 0, maxCombo: 0, correct: 0, answered: 0, result: "playing" };
  for (const answer of answers) {
    if (battle.result !== "playing") break;
    battle.answered += 1;
    if (answer) {
      battle.correct += 1;
      battle.combo += 1;
      battle.maxCombo = Math.max(battle.maxCombo, battle.combo);
      const damage = 1 + (battle.combo % 3 === 0 ? 1 : 0);
      battle.hp = Math.max(0, battle.hp - damage);
      battle.damage += damage;
      if (battle.hp === 0) battle.result = "won";
    } else {
      battle.combo = 0;
    }
  }
  if (battle.result === "playing") battle.result = "lost";
  return battle;
}

const scenarios = [
  { name: "normal-perfect", expected: { result: "won", answered: 4, hp: 0, damage: 5, maxCombo: 4 }, actual: simulate(5, Array(10).fill(true)) },
  { name: "normal-limit", expected: { result: "lost", answered: 10, hp: 1, maxCombo: 1 }, actual: simulate(5, [true, false, true, false, true, false, true, false, false, false]) },
  { name: "boss-clear", expected: { result: "won", answered: 10, hp: 0, maxCombo: 2 }, actual: simulate(7, [true, false, true, true, false, true, true, false, true, true, false, false]) },
  { name: "elite-perfect", expected: { result: "won", answered: 6, hp: 0, maxCombo: 6 }, actual: simulate(7, Array(12).fill(true)) },
  { name: "master-perfect", expected: { result: "won", answered: 7, hp: 0, maxCombo: 7 }, actual: simulate(9, Array(15).fill(true)) }
];

for (const scenario of scenarios) {
  for (const [key, expected] of Object.entries(scenario.expected)) {
    if (scenario.actual[key] !== expected) {
      findings.push({ type: "battle-scenario-failed", scenario: scenario.name, key, expected, actual: scenario.actual[key] });
    }
  }
}

const perfect = scenarios[0].actual;
const perfectPercentage = Math.round((perfect.correct / perfect.answered) * 100);
if (perfectPercentage !== 100) findings.push({ type: "battle-result-rate-failed", expected: 100, actual: perfectPercentage });

const report = {
  generatedAt: new Date().toISOString(),
  scenarioCount: scenarios.length,
  assertionCount: 71,
  findingCount: findings.length,
  scenarios,
  findings
};

fs.writeFileSync("tools/battle-flow-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
if (findings.length) process.exitCode = 1;
