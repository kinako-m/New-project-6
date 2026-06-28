const CHECKS = [
  ["ホーム", ["主要ボタンと説明文が重ならない", "合格準備度と3日間プランが画面幅に収まる", "キャラクター画像と吹き出しが欠けない"]],
  ["通常演習", ["選択した回答が明確に見える", "回答前に別の選択肢へ変更できる", "次の問題で同じ問題が重複しない", "キャラクターと問題が同じ画面内に収まる"]],
  ["本番模試", ["回答選択・変更・見直し指定ができる", "問題一覧から任意の問題へ移動できる", "中断後に残り時間と回答状態を復元できる", "終了確認で未回答数を確認できる"]],
  ["結果・復習", ["得点と分野別内訳が読める", "誤答の自分の回答・正解・解説を確認できる", "おすすめ復習ボタンが正しい画面を開く"]],
  ["成績・データ", ["履歴詳細と合格準備度グラフが表示される", "バックアップを書き出して復元できる", "進捗リセットで確認ダイアログが出る"]],
  ["進化・表示", ["進化図鑑の画像が切れずに表示される", "画面回転やウィンドウ幅変更で要素が重ならない", "文字を拡大しても操作ボタンが隠れない"]]
];

const STORAGE_KEY = "fe-device-qa";
const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || { device: "smartphone", checks: {}, issues: [] };
const checklist = document.querySelector("#checklist");
const deviceSwitch = document.querySelector("#deviceSwitch");
const progressSummary = document.querySelector("#progressSummary");
const issueForm = document.querySelector("#issueForm");
const issueList = document.querySelector("#issueList");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function checkId(group, text) {
  return `${group}:${text}`;
}

function renderChecks() {
  deviceSwitch.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.device === state.device));
  const deviceChecks = state.checks[state.device] || {};
  checklist.innerHTML = CHECKS.map(([group, items]) => `
    <div class="check-group">
      <h3>${group}</h3>
      ${items.map((text) => {
        const id = checkId(group, text);
        const status = deviceChecks[id] || "pending";
        return `<div class="check-item"><p>${text}</p><div class="status-switch" data-check-id="${id}">
          <button type="button" data-status="pending" class="${status === "pending" ? "active" : ""}">未確認</button>
          <button type="button" data-status="ok" class="${status === "ok" ? "active" : ""}">OK</button>
          <button type="button" data-status="needs-fix" class="${status === "needs-fix" ? "active" : ""}">要修正</button>
        </div></div>`;
      }).join("")}
    </div>
  `).join("");
  const allIds = CHECKS.flatMap(([group, items]) => items.map((text) => checkId(group, text)));
  const ok = allIds.filter((id) => deviceChecks[id] === "ok").length;
  const needsFix = allIds.filter((id) => deviceChecks[id] === "needs-fix").length;
  progressSummary.innerHTML = `<strong>${ok}/${allIds.length} OK</strong>要修正 ${needsFix}件`;
}

function renderIssues() {
  issueList.innerHTML = state.issues.length ? state.issues.map((issue) => `
    <article class="issue-card ${issue.severity}">
      <div><strong>${escapeHtml(issue.summary)}</strong><small>${escapeHtml(issue.device)} / ${escapeHtml(issue.screen)} / 重要度 ${escapeHtml(issue.severity)}</small><p>${escapeHtml(issue.steps)}</p></div>
      <button type="button" data-delete-issue="${issue.id}">削除</button>
    </article>
  `).join("") : `<div class="empty">記録された不具合はありません。</div>`;
}

deviceSwitch.addEventListener("click", (event) => {
  const device = event.target.dataset.device;
  if (!device) return;
  state.device = device;
  save();
  renderChecks();
});

checklist.addEventListener("click", (event) => {
  const status = event.target.dataset.status;
  const container = event.target.closest("[data-check-id]");
  if (!status || !container) return;
  state.checks[state.device] = state.checks[state.device] || {};
  state.checks[state.device][container.dataset.checkId] = status;
  save();
  renderChecks();
});

document.querySelector("#resetChecklist").addEventListener("click", () => {
  if (!window.confirm(`${state.device === "pc" ? "PC" : "スマートフォン"}の確認結果をリセットしますか？`)) return;
  state.checks[state.device] = {};
  save();
  renderChecks();
});

issueForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(issueForm);
  state.issues.unshift({
    id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
    summary: data.get("summary"),
    screen: data.get("screen"),
    severity: data.get("severity"),
    steps: data.get("steps"),
    device: state.device === "pc" ? "PC" : "スマートフォン",
    createdAt: new Date().toISOString()
  });
  save();
  issueForm.reset();
  renderIssues();
});

issueList.addEventListener("click", (event) => {
  const id = event.target.dataset.deleteIssue;
  if (!id) return;
  state.issues = state.issues.filter((issue) => issue.id !== id);
  save();
  renderIssues();
});

document.querySelector("#exportIssues").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fe-device-qa-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
});

renderChecks();
renderIssues();
