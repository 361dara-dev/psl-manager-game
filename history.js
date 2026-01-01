function renderHistory() {
  let h = `<h2>PSL History</h2>`;

  if (!gameState.history) {
    document.getElementById("history").innerHTML =
      "<p>No history available.</p>";
    return;
  }

  const champions = gameState.history.champions || [];
  const retirements = gameState.history.retirements || [];

  if (champions.length === 0) {
    h += `<p>No seasons completed yet.</p>`;
  } else {
    champions
      .sort((a, b) => a.season - b.season)
      .forEach(c => {
        h += `<p>Season ${c.season}: <b>${c.winner}</b></p>`;
      });
  }

  h += `<h3>Retirements</h3>`;

  if (retirements.length === 0) {
    h += `<p>No retirements yet.</p>`;
  } else {
    retirements.forEach(r => {
      h += `<p>${r.name} (${r.team}) retired at age ${r.age}</p>`;
    });
  }

  document.getElementById("history").innerHTML = h;
}

