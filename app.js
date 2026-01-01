/***********************
 * TAB SYSTEM (FIXED)
 ***********************/
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.style.display = "none";
  });

  const active = document.getElementById(tabId);
  if (active) active.style.display = "block";

  // Auto-render when tab opens
  if (tabId === "schedule") renderSchedule();
  if (tabId === "standings") renderStandings();
  if (tabId === "history") renderHistory();
  if (tabId === "budget") renderBudget();
}

document.addEventListener("DOMContentLoaded", () => {
  showTab("home");
  renderHome();
});


/***********************
 * HOME
 ***********************/
function renderHome() {
  document.getElementById("home").innerHTML = `
    <h2>Welcome to PSL Manager</h2>
    <p>Manage your team, buy players, play matches and win titles.</p>
    <p><b>Season:</b> ${gameState?.season || 1}</p>
  `;
}


/***********************
 * SCHEDULE
 ***********************/
let currentFixtureIndex = 0;

function renderSchedule() {
  let html = `<h2>Schedule</h2>`;

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
    endSeason(teams);
    currentFixtureIndex = 0;
    renderSchedule();
    return;
  }

  const fixture = fixtures[currentFixtureIndex];
  const result = simulateMatch(fixture.home, fixture.away);

  updateTable(fixture.home, fixture.away, result.winner);
  matchData = result;

  showTab("match");
  renderScorecard(result.innings1);

  currentFixtureIndex++;
}


/***********************
 * MATCH
 ***********************/
let matchData = null;
let ballPointer = 0;

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


/***********************
 * SCORECARD
 ***********************/
function renderScorecard(innings) {
  let batHTML = `
    <tr>
      <th>Batter</th><th>R</th><th>B</th><th>SR</th>
    </tr>`;

  for (let name in innings.battingCard) {
    const b = innings.battingCard[name];
    const sr = b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";

    batHTML += `
      <tr>
        <td>${name}${b.out ? "" : "*"}</td>
        <td>${b.runs}</td>
        <td>${b.balls}</td>
        <td>${sr}</td>
      </tr>`;
  }

  document.getElementById("battingTable").innerHTML = batHTML;

  let bowlHTML = `
    <tr>
      <th>Bowler</th><th>O</th><th>R</th><th>W</th><th>ER</th>
    </tr>`;

  for (let name in innings.bowlingCard) {
    const b = innings.bowlingCard[name];
    const overs = (b.balls / 6).toFixed(1);
    const er = b.balls ? (b.runs / (b.balls / 6)).toFixed(2) : "0.00";

    bowlHTML += `
      <tr>
        <td>${name}</td>
        <td>${overs}</td>
        <td>${b.runs}</td>
        <td>${b.wickets}</td>
        <td>${er}</td>
      </tr>`;
  }

  document.getElementById("bowlingTable").innerHTML = bowlHTML;
}


/***********************
 * STANDINGS
 ***********************/
function renderStandings() {
  const table = [...teams].sort(
    (a, b) => b.points - a.points || b.nrr - a.nrr
  );

  let html = `
    <h2>Standings</h2>
    <table border="1" cellpadding="5">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>NRR</th>
      </tr>`;

  table.forEach(t => {
    html += `
      <tr>
        <td>${t.name}</td>
        <td>${t.played || 0}</td>
        <td>${t.won || 0}</td>
        <td>${t.lost || 0}</td>
        <td>${t.points || 0}</td>
        <td>${(t.nrr || 0).toFixed(2)}</td>
      </tr>`;
  });

  html += `</table>`;
  document.getElementById("standings").innerHTML = html;
}


/***********************
 * HISTORY
 ***********************/
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


/***********************
 * BUDGET
 ***********************/
function renderBudget() {
  let html = `<h2>Team Budgets</h2>`;
  teams.forEach(t => {
    html += `<p>${t.name}: £${t.budget}m</p>`;
  });
  document.getElementById("budget").innerHTML = html;
}
