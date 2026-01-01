function renderHistory() {
  let h = `<h2>PSL History</h2>`;

  gameState.history.champions.forEach(c => {
    h += `<p>Season ${c.season}: <b>${c.winner}</b></p>`;
  });

  h += `<h3>Retirements</h3>`;
  gameState.history.retirements.forEach(r => {
    h += `<p>${r.name} (${r.team}) retired at ${r.age}</p>`;
  });

  document.getElementById("history").innerHTML = h;
}
