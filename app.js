/*************************
 BASIC TAB SYSTEM
**************************/
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  const el = document.getElementById(tab);
  if (el) el.style.display = "block";

  if (tab === "schedule") renderSchedule();
  if (tab === "standings") renderStandings();
  if (tab === "stats") showStats(teams);
  if (tab === "history") renderHistory();
  if (tab === "budget") renderBudget();
}

showTab("home");

/*************************
 GAME STATE
**************************/
let gameState = {
  season: 1,
  history: {
    champions: [],
    tables: [],
    retirements: []
  }
};

/*************************
 INIT TEAMS (CRITICAL)
**************************/
teams.forEach(t => {
  t.players = t.players || [];
  t.played = 0;
  t.won = 0;
  t.lost = 0;
  t.points = 0;
  t.nrr = 0;
  t.pitch = t.pitch || "flat";
});

/*************************
 FIXTURES
**************************/
let fixtures = [];
let currentFixtureIndex = 0;

function regenerateSchedule() {
  fixtures = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({ home: teams[i], away: teams[j] });
      fixtures.push({ home: teams[j], away: teams[i] });
    }
  }
}

regenerateSchedule();

/*************************
 HOME TAB
**************************/
document.getElementById("home").innerHTML = `
  <h2>Welcome to PSL Manager</h2>
  <p>Season ${gameState.season}</p>
  <p>Select a tab on the left to begin.</p>
`;

/*************************
 SCHEDULE
**************************/
function renderSchedule() {
  let html = `<h2>Fixtures</h2>`;

  fixtures.forEach((f, i) => {
    html += `
      <p ${i === currentFixtureIndex ? "style='font-weight:bold'" : ""}>
        ${f.home.name} vs ${f.away.name}
      </p>
    `;
  });

  html += `<button onclick="playNextMatch()">Play Next Match</button>`;
  document.getElementById("schedule").innerHTML = html;
}

function playNextMatch() {
  if (currentFixtureIndex >= fixtures.length) {
    endSeason();
    return;
  }

  const f = fixtures[currentFixtureIndex];
  const result = simulateMatch(f.home, f.away);

  updateTable(f.home, f.away, result.winner);

  showTab("match");
  renderScorecard(result.innings1);

  currentFixtureIndex++;
}

/*************************
 MATCH
**************************/
let matchData = null;
let ballPointer = 0;

function playBallUI() {
  if (!matchData) return;
  let log = matchData.innings1.log;
  if (ballPointer < log.length) {
    document.getElementById("commentary").innerText += "\n" + log[ballPointer];
    ballPointer++;
  }
}

function playOverUI() {
  for (let i = 0; i < 6; i++) playBallUI();
}

function simulateFull() {
  if (!matchData) return;
  document.getElementById("commentary").innerText =
    matchData.innings1.log.join("\n") + "\nWinner: " + matchData.winner;
}

/*************************
 STANDINGS
**************************/
function renderStandings() {
  let table = [...teams].sort((a, b) =>
    b.points - a.points || b.nrr - a.nrr
  );

  let html = `
    <h2>Standings</h2>
    <table border="1" cellpadding="5">
      <tr>
        <th>Team</th>
        <th>P</th>
        <th>W</th>
        <th>L</th>
        <th>Pts</th>
        <th>NRR</th>
      </tr>
  `;

  table.forEach(t => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.won}</td>
        <td>${t.lost}</td>
        <td>${t.points}</td>
        <td>${t.nrr.toFixed(2)}</td>
      </tr>
    `;
  });

  html += "</table>";
  document.getElementById("standings").innerHTML = html;
}

/*************************
 HISTORY
**************************/
function renderHistory() {
  let html = `<h2>PSL History</h2>`;

  gameState.history.champions.forEach(c => {
    html += `<p>Season ${c.season}: <b>${c.winner}</b></p>`;
  });

  html += `<h3>Retirements</h3>`;
  gameState.history.retirements.forEach(r => {
    html += `<p>${r.name} (${r.team}) retired at ${r.age}</p>`;
  });

  document.getElementById("history").innerHTML = html;
}

/*************************
 BUDGET
**************************/
function renderBudget() {
  let html = `<h2>Team Budgets</h2>`;
  teams.forEach(t => {
    html += `<p>${t.name}: £${t.budget}m</p>`;
  });
  document.getElementById("budget").innerHTML = html;
}

/*************************
 SEASON END
**************************/
function endSeason() {
  let table = [...teams].sort((a, b) =>
    b.points - a.points || b.nrr - a.nrr
  );

  gameState.history.champions.push({
    season: gameState.season,
    winner: table[0].name
  });

  gameState.season++;

  teams.forEach(t => {
    t.played = t.won = t.lost = t.points = t.nrr = 0;
  });

  regenerateSchedule();
  currentFixtureIndex = 0;

  alert("Season Complete!");
}
