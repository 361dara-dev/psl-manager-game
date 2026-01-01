
function causeInjury(player) {
  let severityRoll = Math.random();

  if (severityRoll < 0.6) {
    player.injuryDays = 1 + Math.floor(Math.random() * 2); // 1–2 matches
  } else if (severityRoll < 0.9) {
    player.injuryDays = 3 + Math.floor(Math.random() * 3); // 3–5 matches
  } else {
    player.injuryDays = 6 + Math.floor(Math.random() * 4); // 6–9 matches
  }

  player.injured = true;
  player.fitness = Math.max(0, player.fitness - 15);
}

