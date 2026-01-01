const retentionRules = {
  maxRetentions: 5,
  costMultipliers: [1.4, 1.3, 1.2, 1.1, 1.05],
  wageIncrease: 1.15,
  maxRetentionSeasons: 4
};

/* =========================
   APPLY RETENTIONS
========================= */

function applyRetentions(team, retainedPlayers) {

  // Sort by player value (strongest first)
  retainedPlayers.sort(
    (a, b) => (b.batting + b.bowling) - (a.batting + a.bowling)
  );

  retainedPlayers.forEach((player, index) => {
    let multiplier = retentionRules.costMultipliers[index] || 1.05;

    // Cap retention length
    if (player.retentionCount >= retentionRules.maxRetentionSeasons) return;

    // Increase auction value
    player.basePrice = +(player.basePrice * multiplier).toFixed(2);

    // Wage inflation
    player.wage = +(player.wage * retentionRules.wageIncrease).toFixed(2);
    player.wage = Math.min(player.wage, 3);

    player.retained = true;
    player.retentionCount++;
  });

  // RELEASE non-retained players to auction pool
  let released = team.players.filter(p => !p.retained);
  auctionFreeAgents.push(...released);

  team.players = team.players.filter(p => p.retained);
}

/* =========================
   AI RETENTIONS
========================= */

function aiRetainPlayers(team) {
  let candidates = getRetentionCandidates(team);
  let retained = candidates.slice(0, retentionRules.maxRetentions);
  applyRetentions(team, retained);
}

/* =========================
   HUMAN RETENTIONS
========================= */

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

/* =========================
   RESET FLAGS (NEW SEASON)
========================= */

function resetRetentionFlags(teams) {
  teams.forEach(team => {
    team.players.forEach(p => {
      p.retained = false;
    });
  });
}

/* =========================
   BUDGET NORMALIZATION
========================= */

function normalizeBudgets(teams) {
  teams.forEach(t => {
    if (t.budget > 110) t.budget = 110;
    if (t.budget < 55) t.budget += 5;
  });
}

/* =========================
   RETENTION UI
========================= */

function renderRetentionUI(team) {
  let candidates = getRetentionCandidates(team);

  let html = `<h2>Retain Players (Max 5)</h2>`;

  candidates.slice(0, 10).forEach(p => {
    html += `
      <label>
        <input type="checkbox" value="${p.name}">
        ${p.name} — £${p.wage}m (Retained ${p.retentionCount}x)
      </label><br>
    `;
  });

  html += `<button onclick="confirmRetentions()">Confirm</button>`;
  document.getElementById("squad").innerHTML = html;
}
