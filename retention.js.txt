const retentionRules = {
  maxRetentions: 5,
  costMultipliers: [1.4, 1.3, 1.2, 1.1, 1.05], // per retention order
  wageIncrease: 1.15 // 15% wage hike per season retained
};
function applyRetentions(team, retainedPlayers) {
  retainedPlayers.forEach((player, index) => {
    let multiplier = retentionRules.costMultipliers[index];

    // Increase base price (auction value)
    player.basePrice = +(player.basePrice * multiplier).toFixed(2);

    // Wage inflation
    player.wage = +(player.wage * retentionRules.wageIncrease).toFixed(2);
    player.wage = Math.min(player.wage, 3); // cap £3m

    player.retained = true;
    player.retentionCount++;
  });

  // Release non-retained players
  team.players = team.players.filter(p => p.retained);
}
function aiRetainPlayers(team) {
  let candidates = getRetentionCandidates(team);
  let retained = candidates.slice(0, retentionRules.maxRetentions);
  applyRetentions(team, retained);
}
function confirmRetentions() {
  let checks = document.querySelectorAll("#squad input:checked");
  let retained = [];

  checks.forEach(c => {
    let p = userTeam.players.find(pl => pl.name === c.value);
    if (p) retained.push(p);
  });

  if (retained.length > retentionRules.maxRetentions) {
    alert("Max 5 retentions allowed");
    return;
  }

  applyRetentions(userTeam, retained);
}
function prepareForAuction(teams) {
  teams.forEach(team => {
    team.players.forEach(p => p.retained = false);
  });
}
function normalizeBudgets(teams) {
  teams.forEach(t => {
    if (t.budget > 110) t.budget = 110;
    if (t.budget < 55) t.budget += 5;
  });
}
