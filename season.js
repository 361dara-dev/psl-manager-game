let gameState = JSON.parse(localStorage.getItem("pslGame")) || {
  season: 1,
  history: {
    champions: [],
    tables: [],
    retirements: []
  }
};
function resetTable(teams) {
  teams.forEach(t => {
    t.played = 0;
    t.won = 0;
    t.lost = 0;
    t.points = 0;
    t.nrr = 0;
  });
}
function updateTable(teamA, teamB, result) {
  teamA.played++;
  teamB.played++;

  if (result === teamA.name) {
    teamA.won++;
    teamA.points += 2;
    teamB.lost++;
  } else if (result === teamB.name) {
    teamB.won++;
    teamB.points += 2;
    teamA.lost++;
  }

  // simple NRR placeholder
  teamA.nrr += Math.random() * 0.1;
  teamB.nrr -= Math.random() * 0.1;
}
function checkSeasonEnd(fixturesPlayed, totalFixtures) {
  return fixturesPlayed >= totalFixtures;
}
function endSeason(teams) {
  // Sort table
  let table = [...teams].sort((a,b) =>
    b.points - a.points || b.nrr - a.nrr
  );

  let champion = table[0].name;

  gameState.history.champions.push({
    season: gameState.season,
    winner: champion
  });

  gameState.history.tables.push({
    season: gameState.season,
    standings: table.map(t => ({
      team: t.name,
      points: t.points
    }))
  });

  // Aging + retirements
  agePlayers(teams);
  checkRetirements(teams, gameState.history);

  distributeSeasonRevenue(table);

  gameState.season++;

  resetTable(teams);
  regenerateSchedule();

  saveGame();
}
function distributeSeasonRevenue(table) {
  const prizeMoney = [20, 15, 12, 10, 8, 6];

  table.forEach((team, i) => {
    team.budget += prizeMoney[i];
  });
}
