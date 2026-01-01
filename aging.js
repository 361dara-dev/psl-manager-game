function agePlayers(allTeams) {
  allTeams.forEach(team => {
    team.players.forEach(p => {
      p.age++;

      if (p.age > 32) {
        p.fitness -= 3;
      }
      if (p.age > 35) {
        p.batting *= 0.97;
        p.bowling *= 0.97;
      }
    });
  });
}
