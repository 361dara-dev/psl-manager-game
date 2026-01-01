const pitchTypes = {
  flat: {
    battingBoost: 1.15,
    paceBoost: 0.95,
    spinBoost: 0.95,
    wicketChance: 0.9
  },
  green: {
    battingBoost: 0.9,
    paceBoost: 1.2,
    spinBoost: 0.85,
    wicketChance: 1.2
  },
  dusty: {
    battingBoost: 0.95,
    paceBoost: 0.85,
    spinBoost: 1.25,
    wicketChance: 1.1
  }
};

function renderHomePitchSelection(team) {
  document.getElementById("home").innerHTML = `
    <h2>${team.name}</h2>
    <h3>${team.stadium}</h3>

    <label>Prepare Pitch:</label>
    <select onchange="setPitch(this.value)">
      <option value="flat">Flat</option>
      <option value="green">Green</option>
      <option value="dusty">Dusty</option>
    </select>
  `;
}

function setPitch(pitch) {
  userTeam.pitch = pitch;
}
