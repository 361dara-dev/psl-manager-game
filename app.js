function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.getElementById(tab).style.display = 'block';
}

showTab('home');

let matchData = null;
let ballPointer = 0;

/* ================= MATCH CONTROLS ================= */

function startMatch(teamA, teamB) {
  matchData = simulateMatch(teamA, teamB);
  ballPointer = 0;
  document.getElementById("commentary").innerText =
    `Winner: ${matchData.winner}`;
}

function playBallUI() {
  if (!matchData) return;

  let log = matchData.innings1.log;
  if (ballPointer < log.length) {
    document.getElementById("commentary").innerText +=
      "\n" + log[ballPointer];
    ballPointer++;
  }
}

function playOverUI() {
  for (let i = 0; i < 6; i++) {
    playBallUI();
  }
}

function simulateFull() {
  if (!matchData) return;

  document.getElementById("commentary").innerText =
    matchData.innings1.log.join("\n") +
    "\n\nWinner: " + matchData.winner;

  renderScorecard(matchData.innings1);
}

/* ================= SCORECARD ================= */

function renderScorecard(innings) {
  let batHTML = `
    <tr>
      <th>Batter</th>
      <th>R</th>
      <th>B</th>
      <th>SR</th>
    </tr>`;

  for (let p in innings.battingCard) {
    let b = innings.battingCard[p];
    let sr = b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";

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
    <tr>
      <th>Bowler</th>
      <th>O</th>
      <th>R</th>
      <th>W</th>
      <th>ER</th>
    </tr>`;

  for (let p in innings.bowlingCard) {
    let b = innings.bowlingCard[p];
    let overs = (b.balls / 6).toFixed(1);
    let er = b.balls ? (b.runs / (b.balls / 6)).toFixed(2) : "0.00";

    bowlHTML += `
      <tr>
        <td>${p}</td>
        <td>${overs}</td>
        <td>${b.runs}</td>
        <td>${b.wickets}</td>
        <td>${er}</td>
      </tr>`;
  }

  document.getElementById("bowlingTable").innerHTML = bowlHTML;
}

/* ================= SCHEDULE ================= */

let currentFixtureIndex = 0;

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
    return;
  }

  let fixture = fixtures[currentFixtureIndex];

  fixture.home.isHome = true;
  fixture.away.isHome = false;

  let result = simulateMatch(fixture.home, fixture.away);

  matchData = result;
  showTab("match");
  renderScorecard(result.innings1);

  updateTable(fixture.home, fixture.away, result.winner);
  postMatchUpdate(fixture.home);
  postMatchUpdate(fixture.away);

  currentFixtureIndex++;
}

/* ================= SAVE / LOAD ================= */

function saveGame() {
  localStorage.setItem("pslGame", JSON.stringify({
    gameState,
    teams,
    fixtures,
    currentFixtureIndex
  }));
}

let saved = JSON.parse(localStorage.getItem("pslGame"));
if (saved) {
  gameState = saved.gameState;
  teams = saved.teams;
  fixtures = saved.fixtures;
  currentFixtureIndex = saved.currentFixtureIndex;
}

/* ================= STANDINGS ================= */

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
