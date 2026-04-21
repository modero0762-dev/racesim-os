/* ============================================
   RaceSim OS Ver.Ω — app.js
   Core Logic for PWA + Mobile
   ============================================ */

/* -------------------------
   VIEW SWITCHING
------------------------- */
const navButtons = document.querySelectorAll(".bottom-nav button");
const views = document.querySelectorAll(".view");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");
  });
});

/* -------------------------
   URL INPUT → PHASE 0
------------------------- */
document.getElementById("run-btn").addEventListener("click", () => {
  const url = document.getElementById("race-url").value.trim();
  if (!url) return alert("URLを入力してください");

  runRaceSim(url);
});

/* -------------------------
   MAIN PIPELINE
   PHASE 0〜8（簡易版）
------------------------- */
async function runRaceSim(url) {
  console.log("PHASE 0: URL_INPUT", url);

  // 本来はクラウド側で PHASE 1〜8 を実行する
  // 今はデモ用にダミーデータを生成する
  const data = await fakeRaceSim(url);

  renderSimpleView(data);
  renderProView(data);
  renderDashboard(data);

  // Simple View を最初に表示
  document.getElementById("simple-view").classList.remove("hidden");
}

/* -------------------------
   SIMPLE VIEW
------------------------- */
function renderSimpleView(data) {
  const container = document.getElementById("simple-results");
  container.innerHTML = "";

  data.horses.forEach(horse => {
    const div = document.createElement("div");
    div.className = "simple-card";

    div.innerHTML = `
      <div><strong>${horse.name}</strong></div>
      <div>RSIM: ${horse.rsim}</div>
      <div>勝率: ${horse.winrate}%</div>
      <div class="${horse.danger}">danger: ${horse.danger}</div>
    `;

    container.appendChild(div);
  });
}

/* -------------------------
   PRO VIEW
------------------------- */
function renderProView(data) {
  const container = document.getElementById("pro-results");

  container.innerHTML = `
    <h3>ScenarioTensor</h3>
    <pre>${JSON.stringify(data.scenario, null, 2)}</pre>

    <h3>PaceTensor</h3>
    <pre>${JSON.stringify(data.pace, null, 2)}</pre>

    <h3>SurfaceTensor</h3>
    <pre>${JSON.stringify(data.surface, null, 2)}</pre>

    <h3>BloodlineEffect</h3>
    <pre>${JSON.stringify(data.bloodline, null, 2)}</pre>
  `;
}

/* -------------------------
   DASHBOARD
------------------------- */
function renderDashboard(data) {
  const rsimCtx = document.getElementById("rsim-chart").getContext("2d");
  const winCtx = document.getElementById("winrate-chart").getContext("2d");

  const labels = data.horses.map(h => h.name);
  const rsimValues = data.horses.map(h => h.rsim);
  const winValues = data.horses.map(h => h.winrate);

  new Chart(rsimCtx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "RSIM",
        data: rsimValues,
        backgroundColor: "#0A84FF"
      }]
    }
  });

  new Chart(winCtx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: winValues,
        backgroundColor: ["#0A84FF", "#00C853", "#FFD600", "#D50000"]
      }]
    }
  });
}

/* -------------------------
   FAKE DATA（デモ用）
   本番では RaceSim OS の
   PHASE 0〜8 出力に置き換える
------------------------- */
async function fakeRaceSim(url) {
  return {
    horses: [
      { name: "Horse A", rsim: 92, winrate: 34, danger: "safe" },
      { name: "Horse B", rsim: 81, winrate: 22, danger: "gray" },
      { name: "Horse C", rsim: 74, winrate: 18, danger: "danger" }
    ],
    scenario: { tensor: [0.2, 0.5, 0.3] },
    pace: { tensor: [12.1, 11.8, 12.4] },
    surface: { tensor: [0.8, 0.6, 0.7] },
    bloodline: { tensor: [0.9, 0.4, 0.3] }
  };
}
