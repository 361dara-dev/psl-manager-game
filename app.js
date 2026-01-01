/*************************************************
 * BASIC TAB SYSTEM
 *************************************************/
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  const el = document.getElementById(tab);
  if (el) el.style.display = "block";
}

/*************************************************
 * GLOBAL STATE
 *************************************************/
let currentFixtureIndex = 0;
let matchData = null;
let ballPointer = 0;

/*************************************************
 * INIT GAME STATE
 *************************************************/
if (!window.gameState) {
  window.gameState = {
    season: 1,
    history: {
      champions: [],
      tables: [],
      retirements: []
    }
  };
}

/*************************************************
 * INITIALISE TEAMS TABLE DATA
 *************************************************/
teams.forEach(t => {
  t.played = t.played || 0;
  t.won = t.won || 0;
  t.lost = t.lost || 0;
  t.points = t.points || 0;
  t.nrr = t.nrr || 0;
  t.players = t.players || [];
});

/*************************************************
 * FIXTURES
 *************************************************/
if (!window.fixtures || fixtures.length === 0) {
  regenerateSchedule();
}

/*************************************************
 * HOME TAB
 *************************************************/
function renderHome() {
  document.getElementById("home").innerHTML = `
    <h2>Welcome to PSL Manager</h2>
    <p>Season: <b>${gameState.season}</b></p>
    <p>Select a tab from the left to begin.</p>
  `;
}

/*************************************************
 * SCHEDULE
 *************************************************/
function renderSchedule() {
  let html = `<h2>Schedule</h2>`;

  fixtures.forEach((f, i) => {
    html += `
      <p ${i === currentFixtureIndex ? "style='font-weight:bold'" : ""}>
        ${f.home.name} vs ${f.away.name}
      </p>`;
  });

  html += `<button onclick="playNextMatch()">Play Next Match</button>`;
  document.getElementById("schedule").innerHTML = html;
}

function playNextMatch() {
  if (currentFixtureIndex >= fixtures.length) {
    endSeason(teams);
    currentFixtureIndex = 0;
    renderSchedule();
    return;
  }

  const f = fixtures[currentFixtureIndex];
  const result = simulateMatch(f.home, f.away);

  matchData = result;
  showTab("match");
  renderScorecard(result.innings1);

  updateTable(f.home, f.away, result.winner);

  currentFixtureIndex++;
}

/*************************************************
 * MATCH UI
 *************************************************/
function playBallUI() {
  if (!matchData) return;

  const log = matchData.innings1.log;
  if (ballPointer < log.length) {
    document.getElementById("commentary").innerText +=
      "\n" + log[ballPointer];
    ballPointer++;
  }
}

function playOverUI() {
  for (let i = 0; i < 6; i++) playBallUI();
}

function simulateFull() {
  if (!matchData) return;

  document.getElementById("commentary").innerText =
    matchData.innings1.log.join("\n") +
    "\n\nWinner: " + matchData.winner;

  renderScorecard(matchData.innings1);
}

/*************************************************
 * SCORECARD
 *************************************************/
function renderScorecard(innings) {
  let batHTML = `
    <tr><th>Batter</th><th>R</th><th>B</th><th>SR</th></tr>`;

  for (let p in innings.battingCard) {
    const b = innings.battingCard[p];
    const sr = b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
    batHTML += `
      <tr>
        <td>${p}${b.out ? "" : "*"}</td>
        <td>${b.runs}</td>
        <td>${b.balls}</td>
        <td>${sr}</td>
      </tr>`;
  }

  document.getElementById("battingTable").innerHTML = batHTML;

  let bowlHTML = `
    <tr><th>Bowler</th><th>O</th><th>R</th><th>W</th><th>ER</th></tr>`;

  for (let p in innings.bowlingCard) {
    const b = innings.bowlingCard[p];
    bowlHTML += `
      <tr>
        <td>${p}</td>
        <td>${(b.balls / 6).toFixed(1)}</td>
        <td>${b.runs}</td>
        <td>${b.wickets}</td>
        <td>${(b.runs / (b.balls / 6)).toFixed(2)}</td>
      </tr>`;
  }

  document.getElementById("bowlingTable").innerHTML = bowlHTML;
}

/*************************************************
 * STANDINGS
 *************************************************/
function renderStandings() {
  let table = [...teams].sort((a, b) =>
    b.points - a.points || b.nrr - a.nrr
  );

  let html = `
    <h2>Standings</h2>
    <table>
      <tr>
        <th>Team</th><th>P</th><th>W</th>
        <th>L</th><th>Pts</th><th>NRR</th>
      </tr>`;

  table.forEach(t => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played}</td>
        <td>${t.won}</td>
        <td>${t.lost}</td>
        <td>${t.points}</td>
        <td>${t.nrr.toFixed(2)}</td>
      </tr>`;
  });

  html += `</table>`;
  document.getElementById("standings").innerHTML = html;
}

/*************************************************
 * BUDGET
 *************************************************/
function renderBudget() {
  let html = `<h2>Budgets</h2>`;
  teams.forEach(t => {
    html += `<p>${t.name}: £${t.budget}m</p>`;
  });
  document.getElementById("budget").innerHTML = html;
}

/*************************************************
 * HISTORY
 *************************************************/
function renderHistory() {
  let h = `<h2>PSL History</h2>`;
  gameState.history.champions.forEach(c => {
    h += `<p>Season ${c.season}: <b>${c.winner}</b></p>`;
  });
  document.getElementById("history").innerHTML = h;
}

/*************************************************
 * INITIAL RENDER (THIS WAS MISSING)
 *************************************************/
renderHome();
renderSchedule();
renderStandings();
renderBudget();
renderHistory();
showTab("home");
