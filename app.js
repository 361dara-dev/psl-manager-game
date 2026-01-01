/***********************
 TAB SYSTEM
***********************/
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(tab).style.display = "block";

  // Render content when tab opens
  if (tab === "schedule") renderSchedule();
  if (tab === "standings") renderStandings();
  if (tab === "stats") showStats(teams);
  if (tab === "history") renderHistory();
  if (tab === "budget") renderBudget();
}

showTab("home");

/***********************
 GLOBALS
***********************/
let userTeam = teams[0]; // TEMP default
let fixtures = [];
let currentFixtureIndex = 0;
let matchData = null;
let ballPointer = 0;

/***********************
 INIT GAME (THIS WAS MISSING)
***********************/
function initGame() {
  // Add table stats to teams
  teams.forEach(t => {
    t.played = 0;
    t.won = 0;
    t.lost = 0;
    t.points = 0;
    t.nrr = 0;
    t.players = t.players || [];
    t.pitch = "flat";
  });

  regenerateSchedule();
  renderHome();
}

initGame();

/***********************
 HOME TAB
***********************/
function renderHome() {
  document.getElementById("home").innerHTML = `
    <h2>Welcome to PSL Manager</h2>
    <p>You are managing <b>${userTeam.name}</b></p>
    <p>Stadium: ${userTeam.stadium}</p>
    <button onclick="showTab('schedule')">View Schedule</button>
  `;
}

/***********************
 MATCH CONTROLS
***********************/
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
    matchData.innings1.log.join("\n") +
    "\n\nWinner: " + matchData.winner;

  renderScorecard(matchData.innings1);
}

/***********************
 SCHEDULE
***********************/
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
    regenerateSchedule();
    renderSchedule();
    return;
  }

  let fixture = fixtures[currentFixtureIndex];
  let result = simulateMatch(fixture.home, fixture.away);

  matchData = result;
  ballPointer = 0;

  showTab("match");
  document.getElementById("commentary").innerText = "";
  renderScorecard(result.innings1);

  updateTable(fixture.home, fixture.away, result.winner);

  currentFixtureIndex++;
}

/***********************
 BUDGET TAB
***********************/
function renderBudget() {
  let html = `<h2>Budgets</h2>`;
  teams.forEach(t => {
    html += `<p>${t.name}: £${t.budget}m</p>`;
  });
  document.getElementById("budget").innerHTML = html;
}
