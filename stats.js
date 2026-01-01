/* ================================
   PLAYER STATS STRUCTURE (REQUIRED)
   ================================

Each player MUST have this structure:

stats: {
  matches: 0,
  runs: 0,
  ballsFaced: 0,
  wickets: 0,
  ballsBowled: 0,
  runsConceded: 0
}
*/


/* ================================
   SCORECARD
   ================================ */

function generateScorecard(innings) {
  return `
    <div class="scorecard">
      <p><b>Runs:</b> ${innings.runs}</p>
      <p><b>Wickets:</b> ${innings.wickets}</p>
      <p><b>Overs:</b> ${(innings.balls / 6).toFixed(1)}</p>
    </div>
  `;
}


/* ================================
   TOURNAMENT STATS ENGINE
   ================================ */

function calculateTournamentStats(allTeams) {
  let battingStats = [];
  let bowlingStats = [];

  allTeams.forEach(team => {
    team.players.forEach(player => {
      if (!player.stats) return;

      // Batting
      battingStats.push({
        name: player.name,
        team: team.name,
        runs: player.stats.runs || 0,
        balls: player.stats.ballsFaced || 0,
        strikeRate:
          player.stats.ballsFaced > 0
            ? ((player.stats.runs / player.stats.ballsFaced) * 100).toFixed(1)
            : "0.0"
      });

      // Bowling
      bowlingStats.push({
        name: player.name,
        team: team.name,
        wickets: player.stats.wickets || 0,
        economy:
          player.stats.ballsBowled > 0
            ? (
                player.stats.runsConceded /
                (player.stats.ballsBowled / 6)
              ).toFixed(2)
            : "0.00"
      });
    });
  });

  return {
    topRuns: [...battingStats]
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 10),

    bestStrikeRate: [...battingStats]
      .filter(p => p.balls >= 30)
      .sort((a, b) => b.strikeRate - a.strikeRate)
      .slice(0, 10),

    topWickets: [...bowlingStats]
      .sort((a, b) => b.wickets - a.wickets)
      .slice(0, 10),

    bestEconomy: [...bowlingStats]
      .filter(p => p.wickets >= 5)
      .sort((a, b) => a.economy - b.economy)
      .slice(0, 10)
  };
}


/* ================================
   STATS UI
   ================================ */

function showStats(allTeams) {
  let stats = calculateTournamentStats(allTeams);
  let html = "";

  html += `<h3>🏏 Most Runs</h3>`;
  stats.topRuns.forEach(p => {
    html += `<p>${p.name} (${p.team}) – ${p.runs}</p>`;
  });

  html += `<h3>⚡ Best Strike Rate</h3>`;
  stats.bestStrikeRate.forEach(p => {
    html += `<p>${p.name} – ${p.strikeRate}</p>`;
  });

  html += `<h3>🎯 Most Wickets</h3>`;
  stats.topWickets.forEach(p => {
    html += `<p>${p.name} (${p.team}) – ${p.wickets}</p>`;
  });

  html += `<h3>🧮 Best Economy</h3>`;
  stats.bestEconomy.forEach(p => {
    html += `<p>${p.name} – ${p.economy}</p>`;
  });

  document.getElementById("stats").innerHTML = html;
}


/* ================================
   RESET STATS EACH SEASON
   ================================ */

function resetSeasonStats(teams) {
  teams.forEach(team => {
    team.players.forEach(player => {
      player.stats = {
        matches: 0,
        runs: 0,
        ballsFaced: 0,
        wickets: 0,
        ballsBowled: 0,
        runsConceded: 0
      };
    });
  });
}
