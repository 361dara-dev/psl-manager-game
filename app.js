/*************************
  GLOBAL STATE
*************************/
let userTeam = null;
let fixtures = [];
let currentFixtureIndex = 0;

/*************************
  TAB SYSTEM
*************************/
function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(tab).style.display = "block";

  if (tab === "schedule") renderSchedule();
  if (tab === "standings") renderStandings();
  if (tab === "budget") renderBudget();
  if (tab === "squad") renderSquad();
}

showTab("home");

/*************************
  HOME – TEAM SELECTION
*************************/
function renderHome() {
  if (userTeam) {
    document.getElementById("home").innerHTML = `
      <h1>Welcome, Manager of ${userTeam.name}</h1>
      <p>Stadium: ${userTeam.stadium}</p>
      <p>Budget: £${userTeam.budget}m</p>
      <p>You can now go to Auction or Schedule.</p>
    `;
    return;
  }

  let html = `<h1>Select Your Team</h1>`;
  teams.forEach((t, i) => {
    html += `
      <button onclick="selectTeam(${i})"
        style="display:block;margin:10px 0;padding:12px;width:260px">
        ${t.name}
      </button>
    `;
  });

  document.getElementById("home").innerHTML = html;
}

function selectTeam(index) {
  userTeam = teams[index];
  userTeam.players = [];

  teams.forEach(t => {
    t.played = 0;
    t.won = 0;
    t.lost = 0;
    t.points = 0;
    t.nrr = 0;
  });

  regenerateSchedule();
  saveGame();
  renderHome();
}

/*************************
  SCHEDULE
*************************/
function regenerateSchedule() {
  fixtures = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({ home: teams[i], away: teams[j] });
      fixtures.push({ home: teams[j], away: teams[i] });
    }
  }
}

function renderSchedule() {
  if (!userTeam) {
    document.getElementById("schedule").innerHTML =
      `<p>Select a team first.</p>`;
    return;
  }

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

/*************************
  MATCH FLOW
*************************/
let matchData = null;
let ballPointer = 0;

function playNextMatch() {
  if (currentFixtureIndex >= fixtures.length) {
    endSeason(teams);
    currentFixtureIndex = 0;
    return;
  }

  let f = fixtures[currentFixtureIndex];
  matchData = simulateMatch(f.home, f.away);

  updateTable(f.home, f.away, matchData.winner);
  showTab("match");
  renderScorecard(matchData.innings1);

  currentFixtureIndex++;
  saveGame();
}

/*************************
  STANDINGS
*************************/
function renderStandings() {
  let table = [...teams].sort(
    (a, b) => b.points - a.points || b.nrr - a.nrr
  );

  let html = `
    <h2>Standings</h2>
    <table border="1" cellpadding="6">
      <tr>
        <th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th><th>NRR</th>
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

/*************************
  SQUAD
*************************/
function renderSquad() {
  if (!userTeam) {
    document.getElementById("squad").innerHTML =
      `<p>Select a team first.</p>`;
    return;
  }

  let html = `<h2>${userTeam.name} Squad</h2>`;

  if (!userTeam.players.length) {
    html += `<p>No players yet. Go to Auction.</p>`;
  } else {
    userTeam.players.forEach(p => {
      html += `<p>${p.name} (${p.role})</p>`;
    });
  }

  document.getElementById("squad").innerHTML = html;
}

/*************************
  BUDGET
*************************/
function renderBudget() {
  if (!userTeam) return;
  document.getElementById("budget").innerHTML = `
    <h2>Budget</h2>
    <p>Total: £${userTeam.budget}m</p>
  `;
}

/*************************
  SAVE / LOAD
*************************/
function saveGame() {
  localStorage.setItem("pslGame", JSON.stringify({
    teams,
    userTeamIndex: teams.indexOf(userTeam),
    fixtures,
    currentFixtureIndex
  }));
}

(function loadGame() {
  let save = JSON.parse(localStorage.getItem("pslGame"));
  if (!save) {
    renderHome();
    return;
  }

  teams = save.teams;
  fixtures = save.fixtures;
  currentFixtureIndex = save.currentFixtureIndex;
  userTeam = teams[save.userTeamIndex];

  renderHome();
})();

