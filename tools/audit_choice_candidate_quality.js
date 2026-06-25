const fs = require("fs");
const vm = require("vm");
const choiceSets = require("../question-choice-sets.js");

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
  stage.questions.map((question, index) => ({
    ...question,
    id: `${stage.id}-${String(index + 1).padStart(3, "0")}`,
    stageId: stage.id,
    stageName: stage.name
  }))
);

function compact(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[。、，,.・:：;；!?！？「」『』（）()[\]{}]/g, "");
}

function choiceKind(value) {
  const text = String(value).trim();
  if (/^-?[\d,]+(?:\.\d+)?(?:回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/.test(text)) return "numeric";
  if (/^(?:O\(.+\)|[A-Z][A-Z0-9 /+.-]*|第\d正規形)$/.test(text)) return "term";
  if (/^(?:復旧までの目標時間|復旧手順の実行時間|ハッシュ値を暗号化しない鍵|データの自動暗号化)$/.test(text)) return "term";
  if (/(?:性質です。?|取り消す|禁じる)$/.test(text)) return "sentence";
  if (/[をにへでからがはとの]/.test(text) && /(?:表す|支える|変える|重ねる|切り離|両立|計算|戻る|小さい|使える|前提|見る|回す|呼び出す|残す|なくす|除く|復旧|防止|評価|承認|識別|選ぶ|決める|守る|求める|比較|保存|管理|暗号化|保持|追加|交換|出力|反転|絞る|絞り込む|広げる|進む|左右する|合意|重視|抑える|果たす|移行|作る|付ける|並べ替える|備える|渡す|減る|探す|重複している|連続させる|示す)/.test(text)) return "sentence";
  if (/(?:絞り込む|組み合わせる|並べ替える|増える|探す|示す)$/.test(text)) return "sentence";
  if (/(?:する|しない|できる|行う|扱う|求める|取り出す|格納|保存|利用|提供|保護|防ぐ|減らす|増やす|変える|構造|操作|方法|仕組み|性質|権利|活動|手法|方式|考え方|SQL句|です|である|なる|ない)$/.test(text)) return "sentence";
  return compact(text).length <= 14 ? "term" : "sentence";
}

function numericUnit(value) {
  const match = String(value).trim().match(/^-?\d+(?:\.\d+)?(回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/);
  return match ? match[1] || "(none)" : null;
}

function bigrams(value) {
  const text = compact(value);
  const result = new Set();
  for (let i = 0; i < text.length - 1; i += 1) result.add(text.slice(i, i + 2));
  return result;
}

function similarity(left, right) {
  const a = bigrams(left);
  const b = bigrams(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((item) => b.has(item)).length;
  return intersection / new Set([...a, ...b]).size;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function inSet(value, values) {
  return values.has(String(value || "").trim());
}

function isReusableSameStageCandidate(correct, candidate) {
  const correctText = String(correct || "").trim();
  const candidateText = String(candidate || "").trim();
  const paired = [correctText, candidateText];
  if (paired.every((text) => /^O\(.+\)$/.test(text))) return true;
  if (paired.every((text) => /^\[[^\]]*\]$/.test(text))) return true;
  if (paired.every((text) => /^[A-Z](?:、[A-Z])*$/.test(text))) return true;

  const sqlTerms = new Set(["SELECT", "FROM", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "INSERT", "UPDATE", "DELETE"]);
  if (paired.every((text) => inSet(text, sqlTerms))) return true;

  const algorithmTerms = new Set([
    "線形探索", "二分探索", "ハッシュ探索", "幅優先探索", "深さ優先探索",
    "バブルソート", "選択ソート", "挿入ソート", "クイックソート", "マージソート",
    "スタック", "キュー", "ヒープ", "連想配列", "二分木", "優先度付きキュー",
    "隣接行列", "リングバッファ"
  ]);
  if (paired.every((text) => inSet(text, algorithmTerms))) return true;

  const databaseTerms = new Set([
    "主キー", "外部キー", "候補キー", "複合キー", "リレーションシップ",
    "第1正規形", "第2正規形", "第3正規形", "推移的関数従属",
    "共有ロック", "専有ロック", "楽観ロック", "ロストアップデート", "更新競合",
    "ダーティリード", "ファントムリード", "ノンリピータブルリード", "参照整合性違反", "正規化不足"
  ]);
  if (paired.every((text) => inSet(text, databaseTerms))) return true;

  const managementTerms = new Set([
    "ウォータフォールモデル", "アジャイル開発", "DevOps",
    "EVM", "ガントチャート", "WBS",
    "問題管理", "インシデント管理", "変更管理", "構成管理", "品質改善"
  ]);
  if (paired.every((text) => inSet(text, managementTerms))) return true;

  return false;
}

function isSameStageCandidateNoise(correct, candidate) {
  if (isReusableSameStageCandidate(correct, candidate)) return true;
  return choiceKind(correct) === choiceKind(candidate);
}

const correctOwners = new Map();
for (const question of questions) {
  const correct = compact(choiceSets[question.text].correct);
  if (!correctOwners.has(correct)) correctOwners.set(correct, []);
  correctOwners.get(correct).push({ stageId: question.stageId, tag: question.tag });
}

const findings = [];
function add(question, type, severity, points, detail) {
  findings.push({
    id: question.id,
    stage: question.stageName,
    stageId: question.stageId,
    tag: question.tag,
    text: question.text,
    correct: choiceSets[question.text].correct,
    type,
    severity,
    points,
    detail
  });
}

for (const question of questions) {
  const definition = choiceSets[question.text];
  const choices = [definition.correct, ...definition.distractors];
  const normalized = choices.map(compact);
  const kinds = choices.map(choiceKind);
  const kindCounts = kinds.reduce((counts, kind) => {
    counts[kind] = (counts[kind] || 0) + 1;
    return counts;
  }, {});
  const majorityKind = Object.entries(kindCounts).sort((a, b) => b[1] - a[1])[0][0];

  if (new Set(normalized).size !== normalized.length) {
    const duplicateGroups = [...new Set(normalized)]
      .map((value) => choices.filter((choice) => compact(choice) === value))
      .filter((group) => group.length > 1);
    add(question, "duplicate-candidate", "high", 10, { duplicateGroups });
  }

  if (kindCounts[majorityKind] >= choices.length - 1) {
    choices.forEach((choice, index) => {
      if (kinds[index] !== majorityKind) {
        const contextualException =
          /(?:ない|存在しない|該当しない|取り出せない)/.test(choice)
          || compact(question.text).includes(compact(choice))
          || /該当する用語/.test(question.text);
        if (contextualException) return;
        const severity = majorityKind === "numeric" && !contextualException ? "high" : "medium";
        add(question, "choice-style-outlier", severity, severity === "high" ? 8 : 5, {
          candidate: choice,
          candidateKind: kinds[index],
          majorityKind
        });
      }
    });
  } else if (new Set(kinds).size >= 3) {
    add(question, "mixed-choice-styles", "medium", 5, { kinds });
  }

  const units = choices.map(numericUnit);
  const numericUnits = units.filter((unit) => unit !== null);
  if (numericUnits.length === choices.length && new Set(numericUnits).size > 1) {
    add(question, "numeric-unit-mismatch", "high", 9, { units });
  }

  const correctLength = compact(definition.correct).length;
  const distractorLengths = definition.distractors.map((choice) => compact(choice).length);
  const distractorMedian = median(distractorLengths);
  if (distractorMedian >= 8 && (correctLength >= distractorMedian * 2.5 || correctLength <= distractorMedian * 0.4)) {
    add(question, "correct-length-outlier", "medium", 6, {
      correctLength,
      distractorMedian
    });
  }

  definition.distractors.forEach((candidate) => {
    const score = similarity(definition.correct, candidate);
    if (score >= 0.82 && compact(definition.correct) !== compact(candidate)) {
      add(question, "near-correct-candidate", "medium", 6, {
        candidate,
        similarity: Number(score.toFixed(2))
      });
    }

    if (numericUnit(candidate) !== null) return;
    const owners = correctOwners.get(compact(candidate)) || [];
    if (!owners.length || owners.some((owner) => owner.stageId === question.stageId && owner.tag === question.tag)) return;
    if (owners.some((owner) => owner.stageId === question.stageId)
      && isSameStageCandidateNoise(definition.correct, candidate)) return;
    const differentStage = owners.every((owner) => owner.stageId !== question.stageId);
    add(question, "foreign-tag-candidate", differentStage ? "medium" : "low", differentStage ? 5 : 3, {
      candidate,
      candidateOwners: owners
    });
  });
}

const groupedByQuestion = new Map();
for (const finding of findings) {
  if (!groupedByQuestion.has(finding.text)) {
    groupedByQuestion.set(finding.text, {
      id: finding.id,
      stage: finding.stage,
      tag: finding.tag,
      text: finding.text,
      correct: finding.correct,
      score: 0,
      findings: []
    });
  }
  const item = groupedByQuestion.get(finding.text);
  item.score += finding.points;
  item.findings.push(finding);
}

const reviewQueue = [...groupedByQuestion.values()]
  .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
  .map((item, index) => ({ rank: index + 1, ...item }));

const counts = findings.reduce((result, finding) => {
  result[finding.type] = (result[finding.type] || 0) + 1;
  return result;
}, {});
const severityCounts = findings.reduce((result, finding) => {
  result[finding.severity] = (result[finding.severity] || 0) + 1;
  return result;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    questions: questions.length,
    candidateSetsWithFindings: reviewQueue.length,
    findings: findings.length,
    severityCounts,
    counts
  },
  interpretation: {
    high: "形式・単位・重複など、機械的に修正判断しやすい候補",
    medium: "正解との類似、別分野候補、長さ差など、人手確認を優先する候補",
    low: "同じ大分野内の別タグ候補。無関係とは限らないため参考扱い"
  },
  reviewQueue
};

function shortDetail(finding) {
  if (typeof finding.detail === "string") return finding.detail;
  if (finding.detail.candidate) return `${finding.type}: ${finding.detail.candidate}`;
  return finding.type;
}

const markdownRows = reviewQueue.slice(0, 150).map((item) =>
  `| ${item.rank} | ${item.score} | ${item.stage} | ${item.tag} | ${item.text.replace(/\r?\n/g, " ")} | ${item.findings.map(shortDetail).join(" / ")} |`
).join("\n");
const markdown = `# 選択肢候補 品質監査レポート

生成日時: ${report.generatedAt}

- 全問題数: ${report.summary.questions}
- 要確認問題数: ${report.summary.candidateSetsWithFindings}
- 高確度の指摘: ${severityCounts.high || 0}
- 中確度の指摘: ${severityCounts.medium || 0}
- 参考指摘: ${severityCounts.low || 0}

## 判定件数

${Object.entries(counts).map(([type, count]) => `- ${type}: ${count}`).join("\n")}

## 優先確認キュー

| 順位 | 点数 | 分野 | タグ | 問題 | 指摘 |
| ---: | ---: | --- | --- | --- | --- |
${markdownRows}
`;

fs.writeFileSync("tools/choice-candidate-quality-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/choice-candidate-quality-report.md", `${markdown.trimEnd()}\n`);
console.log(JSON.stringify({
  summary: report.summary,
  top10: reviewQueue.slice(0, 10).map(({ rank, score, stage, tag, text, findings: itemFindings }) => ({
    rank,
    score,
    stage,
    tag,
    text,
    findings: itemFindings.map(({ type, severity, detail }) => ({ type, severity, detail }))
  }))
}, null, 2));
