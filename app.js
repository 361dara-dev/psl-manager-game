/**************** TAB SYSTEM ****************/
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  const el = document.getElementById(tab);
  if (el) el.style.display = "block";

  // auto-render when opening tabs
  if (tab === "schedule") renderSchedule();
  if (tab === "standings") renderStandings();
  if (tab === "stats") showStats(teams);
  if (tab === "history") renderHistory();
  if (tab === "budget") renderBudget();
}

showTab("home");

/**************** INIT ****************/
teams.forEach(t => {
  t.played = 0;
  t.won = 0;
  t.lost = 0;
  t.points = 0;
  t.nrr = 0;
  t.players ||= [];
});

if (!window.fixtures || fixtures.length === 0) {
  regenerateSchedule();
}

/**************** HOME ****************/
document.getElementById("home").innerHTML = `
  <h2>Welcome to PSL Manager</h2>
  <p>Manage your team, auction players, play matches and win titles.</p>
`;

/**************** MATCH ****************/
let matchData = null;
let ballPointer = 0;

function playNextMatch() {
  if (currentFixtureIndex >= fixtures.length) {
    endSeason(teams);
    currentFixtureIndex = 0;
    return;
  }

  const f = fixtures[currentFixtureIndex];
  matchData = simulateMatch(f.home, f.away);

  updateTable(f.home, f.away, matchData.winner);
  currentFixtureIndex++;

  showTab("match");
  document.getElementById("commentary").innerText =
    matchData.innings1.log.join("\n") +
    "\n\nWinner: " + matchData.winner;

  renderScorecard(matchData.innings1);
}

/**************** SCORECARD ****************/
function renderScorecard(innings) {
  let bat = `
    <tr><th>Batter</th><th>R</th><th>B</th><th>SR</th></tr>`;
  for (let p in innings.battingCard) {
    const b = innings.battingCard[p];
    bat += `
      <tr>
        <td>${p}${b.out ? "" : "*"}</td>
        <td>${b.runs}</td>
        <td>${b.balls}</td>
        <td>${b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : 0}</td>
      </tr>`;
  }
  document.getElementById("battingTable").innerHTML = bat;

  let bowl = `
    <tr><th>Bowler</th><th>O</th><th>R</th><th>W</th></tr>`;
  for (let p in innings.bowlingCard) {
    const b = innings.bowlingCard[p];
    bowl += `
      <tr>
        <td>${p}</td>
        <td>${(b.balls / 6).toFixed(1)}</td>
        <td>${b.runs}</td>
        <td>${b.wickets}</td>
      </tr>`;
  }
  document.getElementById("bowlingTable").innerHTML = bowl;
}

/**************** SCHEDULE ****************/
function renderSchedule() {
  let html = `<h2>Schedule</h2>`;
  fixtures.forEach((f, i) => {
    html += `<p>${i + 1}. ${f.home.name} vs ${f.away.name}</p>`;
  });
  html += `<button onclick="playNextMatch()">Play Next Match</button>`;
  document.getElementById("schedule").innerHTML = html;
}

/**************** STANDINGS ****************/
function renderStandings() {
  let table = [...teams].sort((a, b) =>
    b.points - a.points || b.nrr - a.nrr
  );

  let html = `
    <h2>Standings</h2>
    <table border="1">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th>
      </tr>`;

  table.forEach(t => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.won}</td>
        <td>${t.lost}</td>
        <td>${t.points}</td>
      </tr>`;
  });

  html += `</table>`;
  document.getElementById("standings").innerHTML = html;
}

/**************** BUDGET ****************/
function renderBudget() {
  let html = `<h2>Budgets</h2>`;
  teams.forEach(t => {
    html += `<p>${t.name}: £${t.budget}m</p>`;
  });
  document.getElementById("budget").innerHTML = html;
}

/**************** HISTORY ****************/
function renderHistory() {
  let h = `<h2>PSL History</h2>`;
  gameState.history.champions.forEach(c => {
    h += `<p>Season ${c.season}: ${c.winner}</p>`;
  });
  document.getElementById("history").innerHTML = h;
}

