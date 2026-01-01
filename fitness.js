function applyFatigue(player) {
  player.fatigue = Math.min(100, player.fatigue + 8);

  player.fitness = Math.max(
    0,
    player.fitness - player.fatigue * 0.05
  );

  // Injury chance scales with fitness
  if (player.fitness < 60) {
    const injuryChance = (60 - player.fitness) * 0.002; // max ~10%
    if (Math.random() < injuryChance) {
      causeInjury(player);
    }
  }
}

function recoverFatigue(player) {
  if (!player.injured) {
    player.fatigue = Math.max(0, player.fatigue - 10);
    player.fitness = Math.min(100, player.fitness + 5);
  }
}

