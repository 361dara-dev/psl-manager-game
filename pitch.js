/* =========================
   PITCH DEFINITIONS
========================= */

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

/* =========================
   HOME PITCH SELECTION UI
========================= */

function renderHomePitchSelection(team) {
  if (!team.pitch) team.pitch = "flat"; // default pitch

  document.getElementById("home").innerHTML = `
    <h2>${team.name}</h2>
    <h3>${team.stadium}</h3>

    <label><b>Prepare Pitch:</b></label>
    <select onchange="setPitch(this.value)">
      <option value="flat" ${team.pitch === "flat" ? "selected" : ""}>Flat</option>
      <option value="green" ${team.pitch === "green" ? "selected" : ""}>Green</option>
      <option value="dusty" ${team.pitch === "dusty" ? "selected" : ""}>Dusty</option>
    </select>
  `;
}

/* =========================
   APPLY PITCH
========================= */

function setPitch(pitch) {
  if (!userTeam) return;
  userTeam.pitch = pitch;
}

