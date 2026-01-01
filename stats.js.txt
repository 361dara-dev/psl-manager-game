function generateScorecard(innings) {
  return `
Runs: ${innings.runs}
Wickets: ${innings.wickets}
Overs: ${(innings.balls/6).toFixed(1)}
`;
}
function calculateTournamentStats(allTeams) {
  let stats = [];

  allTeams.forEach(team => {
    team.players.forEach(p => {
      stats.push({
        name: p.name,
        runs: p.stats.runs || 0,
        wickets: p.stats.wickets || 0
      });
    });
  });

  return {
    topRuns: stats.sort((a,b)=>b.runs-a.runs).slice(0,10),
    topWickets: stats.sort((a,b)=>b.wickets-a.wickets).slice(0,10)
  };
}


function showStats(allTeams) {
  let s = calculateTournamentStats(allTeams);
  let html = `<h3>Most Runs</h3>`;
  s.topRuns.forEach(p => html += `<p>${p.name} - ${p.runs}</p>`);
  html += `<h3>Most Wickets</h3>`;
  s.topWickets.forEach(p => html += `<p>${p.name} - ${p.wickets}</p>`);
  document.getElementById("stats").innerHTML = html;
}
