let gameState = {
  season: 1,
  history: {
    champions: [],
    tables: [],
    retirements: []
  }
};

/* =========================
   TABLE RESET
========================= */

function resetTable(teams) {
  teams.forEach(t => {
    t.played = 0;
    t.won = 0;
    t.lost = 0;
    t.points = 0;
    t.nrr = 0;
    t.runsFor = 0;
    t.oversFaced = 0;
    t.runsAgainst = 0;
    t.oversBowled = 0;
  });
}

/* =========================
   TABLE UPDATE
========================= */

function updateTable(teamA, teamB, match) {
  teamA.played++;
  teamB.played++;

  // NRR calculation
  teamA.runsFor += match.innings1.runs;
  teamA.oversFaced += match.innings1.balls / 6;
  teamA.runsAgainst += match.innings2.runs;
  teamA.oversBowled += match.innings2.balls / 6;

  teamB.runsFor += match.innings2.runs;
  teamB.oversFaced += match.innings2.balls / 6;
  teamB.runsAgainst += match.innings1.runs;
  teamB.oversBowled += match.innings1.balls / 6;

  teamA.nrr =
    teamA.runsFor / teamA.oversFaced -
    teamA.runsAgainst / teamA.oversBowled;

  teamB.nrr =
    teamB.runsFor / teamB.oversFaced -
    teamB.runsAgainst / teamB.oversBowled;

  if (match.winner === teamA.name) {
    teamA.won++;
    teamA.points += 2;
    teamB.lost++;
    teamA.budget += 0.5; // match win fee
  } else if (match.winner === teamB.name) {
    teamB.won++;
    teamB.points += 2;
    teamA.lost++;
    teamB.budget += 0.5;
  }
}

/* =========================
   PLAYOFFS
========================= */

function playPlayoffs(table) {
  let semi1 = simulateMatch(table[0], table[3]);
  let semi2 = simulateMatch(table[1], table[2]);

  let finalist1 = semi1.winner === table[0].name ? table[0] : table[3];
  let finalist2 = semi2.winner === table[1].name ? table[1] : table[2];

  finalist1.budget += 5;
  finalist2.budget += 5;

  let finalMatch = simulateMatch(finalist1, finalist2);
  let champion =
    finalMatch.winner === finalist1.name ? finalist1 : finalist2;

  champion.budget += 10;

  return champion.name;
}

/* =========================
   END SEASON
========================= */

function endSeason(teams) {
  let table = [...teams].sort(
    (a, b) => b.points - a.points || b.nrr - a.nrr
  );

  let champion = playPlayoffs(table);

  gameState.history.champions.push({
    season: gameState.season,
    winner: champion
  });

  gameState.history.tables.push({
    season: gameState.season,
    standings: table.map(t => ({
      team: t.name,
      points: t.points,
      nrr: +t.nrr.toFixed(2)
    }))
  });

  // Aging + retirements
  agePlayers(teams);
  checkRetirements(teams, gameState.history);

  normalizeBudgets(teams);

  gameState.season++;

  resetRetentionFlags(teams);
  resetTable(teams);
  regenerateSchedule(gameState.season);

  saveGame();
}

/* =========================
   SAVE / LOAD
========================= */

function saveGame() {
  const saveData = {
    gameState,
    teams,
    players,
    fixtures,
    currentFixtureIndex
  };
  localStorage.setItem("pslGame", JSON.stringify(saveData));
}

function loadGame() {
  let saved = JSON.parse(localStorage.getItem("pslGame"));
  if (!saved) return false;

  gameState = saved.gameState;
  teams = saved.teams;
  players = saved.players;
  fixtures = saved.fixtures;
  currentFixtureIndex = saved.currentFixtureIndex;

  return true;
}
