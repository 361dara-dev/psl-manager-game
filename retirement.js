function checkRetirements(allTeams, history) {

  allTeams.forEach(team => {
    team.players = team.players.filter(p => {

      // Under 35 = never retire
      if (p.age < 35) return true;

      // Base retirement chance
      let retireChance = (p.age - 34) * 0.05;

      // Fitness impact
      if (p.fitness < 50) retireChance += 0.08;
      if (p.fitness < 35) retireChance += 0.12;

      // Retained stars retire later
      if (p.retentionCount > 0) retireChance *= 0.75;

      // Hard cap
      retireChance = Math.min(retireChance, 0.6);

      if (Math.random() < retireChance) {
        history.retirements.push({
          name: p.name,
          age: p.age,
          team: team.name,
          runs: p.stats.runs,
          wickets: p.stats.wickets,
          matches: p.stats.matches
        });
        return false;
      }

      return true;
    });
  });
}


