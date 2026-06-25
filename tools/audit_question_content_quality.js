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
  const text = String(value || "").trim();
  if (/^-?[\d,]+(?:\.\d+)?(?:回|個|秒|ビット|円|万円|台|人|通り|%|倍|件|文字|バイト|KB|MB|GB)?$/.test(text)) return "numeric";
  if (/^(?:O\(.+\)|[A-Z][A-Z0-9 /+.-]*|第\d正規形)$/.test(text)) return "term";
  if (/^(?:復旧までの目標時間|復旧手順の実行時間|ハッシュ値を暗号化しない鍵|データの自動暗号化)$/.test(text)) return "term";
  if (/(?:性質です。?|取り消す|禁じる)$/.test(text)) return "sentence";
  if (/[をにへでからがはとの]/.test(text) && /(?:表す|支える|変える|重ねる|切り離|両立|計算|戻る|小さい|使える|前提|見る|回す|呼び出す|残す|なくす|除く|復旧|防止|評価|承認|識別|選ぶ|決める|守る|求める|比較|保存|管理|暗号化|保持|追加|交換|出力|反転|絞る|絞り込む|広げる|進む|左右する|合意|重視|抑える|果たす|移行|作る|付ける|並べ替える|備える|渡す|減る|探す|重複している|連続させる|示す)/.test(text)) return "sentence";
  if (/(?:絞り込む|組み合わせる|並べ替える|増える|探す|示す)$/.test(text)) return "sentence";
  if (/[をにへでからがはと]/.test(text) && /(?:する|しない|できる|行う|扱う|求める|取り出す|格納|保存|利用|提供|保護|防ぐ|減らす|増やす|変える|構造|操作|方法|仕組み|性質|権利|活動|手法|方式|考え方|SQL句|です|である|なる|ない)$/.test(text)) return "sentence";
  if (compact(text).length <= 14 && !/[、。]/.test(text) && !/(?:する|しない|できる|行う|扱う|求める|取り出す|格納|保存|利用|提供|防ぐ|減らす|増やす|変える|構造|操作|作業|方式|権利|方法|仕組み|考え方|である|なる|ない)$/.test(text)) return "term";
  if (/(?:する|しない|できる|行う|扱う|求める|取り出す|格納|保存|利用|提供|保護|防ぐ|減らす|増やす|増える|変える|構造|操作|方法|仕組み|性質|権利|活動|手法|方式|考え方|SQL句|です|である|なる|ない)$/.test(text)) return "sentence";
  return compact(text).length <= 14 ? "term" : "sentence";
}

function expectedChoiceKind(question) {
  const text = String(question.text || "");
  if (/どうなるか/.test(text)) return "sentence";
  if (/(?:何回|最大何|最小何|何個|何秒|何ビット|何バイト|何通り|何件|何文字|何%|比較回数)/.test(text)) {
    return "numeric";
  }
  if (/(?:用語|名称|技法|規格|権利|法令|プロトコル|アルゴリズム|SQL句|技術として|指標として).*(?:どれか|何か|該当する|適切)/.test(text)) {
    return "term";
  }
  if (/(?:説明として|説明は|特徴として|目的として|理由として|役割として|対応はどれか|対応として|方法として|最も適切なもの|適切な対応)/.test(text)) {
    return "sentence";
  }
  return "";
}

function isGenericChoice(value) {
  const text = compact(value);
  if (!text || text.length <= 2) return true;
  if (["true", "false", "真", "偽"].includes(text)) return true;
  if (/^[abcd]$/.test(text)) return true;
  if (/^\d+$/.test(text)) return true;
  return false;
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

function addFinding(findings, question, type, severity, detail) {
  findings.push({
    id: question.id,
    stage: question.stageName,
    stageId: question.stageId,
    tag: question.tag,
    type,
    severity,
    text: question.text,
    correct: choiceSets[question.text]?.correct || question.choices?.[question.answer] || "",
    detail
  });
}

function extractedExplanationAnswer(explanation) {
  const text = String(explanation || "");
  const patterns = [
    /正解は[「"]([^」"]+)[」"]/,
    /答えは[「"]([^」"]+)[」"]/,
    /正答は[「"]([^」"]+)[」"]/,
    /正解[:：]\s*([^。]+)/,
    /答え[:：]\s*([^。]+)/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

const findings = [];

for (const question of questions) {
  const definition = choiceSets[question.text];
  if (!definition) {
    addFinding(findings, question, "missing-choice-definition", "high", {});
    continue;
  }

  const choices = [definition.correct, ...definition.distractors];
  const kinds = choices.map(choiceKind);
  const kindCounts = kinds.reduce((counts, kind) => {
    counts[kind] = (counts[kind] || 0) + 1;
    return counts;
  }, {});
  const entries = Object.entries(kindCounts).sort((a, b) => b[1] - a[1]);
  const majority = entries[0]?.[0] || "";

  if (majority && kindCounts[majority] === choices.length - 1) {
    const outlierIndex = kinds.findIndex((kind) => kind !== majority);
    const outlier = choices[outlierIndex];
    const allShortNumericOrList = choices.every((choice) => /^[\d,\s]+$/.test(String(choice).trim()));
    if (allShortNumericOrList) {
      // Sequence/count answer sets such as "13, 21" vs "21" are intentionally close.
    } else {
    const isCorrectOutlier = outlierIndex === 0;
    const severity = isCorrectOutlier ? "medium" : "low";
    addFinding(findings, question, "choice-granularity-outlier", severity, {
      majorityKind: majority,
      outlier,
      outlierKind: kinds[outlierIndex],
      isCorrectOutlier
    });
    }
  }

  const expectedKind = expectedChoiceKind(question);
  if (expectedKind) {
    const expectedCount = kinds.filter((kind) => kind === expectedKind).length;
    const correctKind = kinds[0];
    const questionAllowsTermChoices =
      expectedKind === "sentence" && /(?:該当する用語|用語は|名称は|技法は|方式は|規格は|権利は|法令は)/.test(question.text);
    if (!questionAllowsTermChoices && correctKind !== expectedKind) {
      addFinding(findings, question, "question-choice-format-mismatch", "medium", {
        expectedKind,
        correctKind,
        reason: "問題文の聞き方と正解選択肢の形式が一致していません"
      });
    } else if (!questionAllowsTermChoices && expectedCount < Math.ceil(choices.length * 0.7)) {
      addFinding(findings, question, "question-choice-format-mixed", "low", {
        expectedKind,
        kinds,
        reason: "問題文の聞き方に対して、選択肢の形式が混在しています"
      });
    }
  }

  const questionCompact = compact(question.text);
  choices.forEach((choice, index) => {
    const choiceCompact = compact(choice);
    if (isGenericChoice(choice) || choiceKind(choice) === "numeric") return;
    if (choiceCompact.length < 4) return;
    if (!questionCompact.includes(choiceCompact)) return;
    const isCorrect = index === 0;
    const asksDefinition =
      /説明|該当する用語|何か|どれか|特徴/.test(question.text)
      && choiceKind(choice) === "term";
    if (asksDefinition && !isCorrect) return;
    addFinding(findings, question, "question-choice-overlap", isCorrect ? "medium" : "low", {
      choice,
      isCorrect,
      reason: "選択肢の文字列が問題文にそのまま含まれています"
    });
  });

  const explanationAnswer = extractedExplanationAnswer(question.explanation);
  if (explanationAnswer) {
    const actual = definition.correct;
    const matchesActual =
      compact(explanationAnswer) === compact(actual)
      || compact(actual).includes(compact(explanationAnswer))
      || compact(explanationAnswer).includes(compact(actual))
      || similarity(explanationAnswer, actual) >= 0.7;
    if (!matchesActual) {
      const matchesDistractor = definition.distractors.find((choice) =>
        compact(choice) === compact(explanationAnswer)
        || compact(choice).includes(compact(explanationAnswer))
        || compact(explanationAnswer).includes(compact(choice))
      );
      addFinding(findings, question, "explanation-answer-mismatch", "high", {
        explanationAnswer,
        actual,
        matchesDistractor: matchesDistractor || ""
      });
    }
  }
}

const severityCounts = findings.reduce((counts, finding) => {
  counts[finding.severity] = (counts[finding.severity] || 0) + 1;
  return counts;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  questionCount: questions.length,
  findingCount: findings.length,
  severityCounts,
  findings
};

const markdown = [
  "# Question Content Quality Report",
  "",
  `Generated: ${report.generatedAt}`,
  `Questions: ${report.questionCount}`,
  `Findings: ${report.findingCount}`,
  `High: ${severityCounts.high || 0}`,
  `Medium: ${severityCounts.medium || 0}`,
  `Low: ${severityCounts.low || 0}`,
  "",
  ...findings.slice(0, 100).map((finding) => [
    `## ${finding.severity.toUpperCase()} ${finding.type}`,
    "",
    `- ID: ${finding.id}`,
    `- Stage: ${finding.stage}`,
    `- Tag: ${finding.tag}`,
    `- Question: ${finding.text}`,
    `- Correct: ${finding.correct}`,
    `- Detail: \`${JSON.stringify(finding.detail)}\``,
    ""
  ].join("\n"))
].join("\n");

fs.writeFileSync("tools/question-content-quality-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("tools/question-content-quality-report.md", markdown);
console.log(JSON.stringify(report, null, 2));
