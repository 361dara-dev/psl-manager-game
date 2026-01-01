function applyFatigue(player) {
  player.fatigue += 8;
  player.fitness -= player.fatigue * 0.05;

  if (player.fitness < 50 && Math.random() < 0.05) {
    causeInjury(player);
  }
}

function recoverFatigue(player) {
  if (!player.injured) {
    player.fatigue = Math.max(0, player.fatigue - 10);
    player.fitness = Math.min(100, player.fitness + 5);
  }
}
