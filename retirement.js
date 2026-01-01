function checkRetirements(allTeams, history) {
  allTeams.forEach(team => {
    team.players = team.players.filter(p => {
      if (p.age < 35) return true;

      let retireChance =
        (p.age - 34) * 0.08 +
        (p.fitness < 50 ? 0.1 : 0);

      if (Math.random() < retireChance) {
        history.retirements.push({
          name: p.name,
          age: p.age,
          team: team.name
        });
        return false;
      }
      return true;
    });
  });
}
