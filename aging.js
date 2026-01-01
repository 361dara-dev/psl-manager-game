function agePlayers(allTeams) {
  allTeams.forEach(team => {
    team.players.forEach(p => {
      p.age++;

      // Fitness decline
      if (p.age >= 30) {
        p.fitness = Math.max(40, p.fitness - 2);
      }

      // Skill decline (gradual)
      if (p.age >= 34) {
        const decline = 0.98 + Math.random() * 0.01; // 0.98–0.99
        p.batting = Math.max(20, Math.floor(p.batting * decline));
        p.bowling = Math.max(20, Math.floor(p.bowling * decline));
      }

      // Flag for retirement system
      if (p.age >= 38) {
        p.retirementRisk = true;
      }
    });
  });
}

