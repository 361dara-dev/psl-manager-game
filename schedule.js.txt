let fixtures = [];

function regenerateSchedule() {
  fixtures = [];
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({ home: teams[i], away: teams[j] });
      fixtures.push({ home: teams[j], away: teams[i] });
    }
  }
}
function saveGame() {
  localStorage.setItem("pslGame", JSON.stringify(gameState));
}
