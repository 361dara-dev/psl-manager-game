let fixtures = [];
let currentFixtureIndex = 0;

/* =========================
   GENERATE DOUBLE ROUND ROBIN
========================= */

function regenerateSchedule(season) {
  fixtures = [];
  currentFixtureIndex = 0;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({
        home: teams[i].name,
        away: teams[j].name,
        played: false,
        season
      });

      fixtures.push({
        home: teams[j].name,
        away: teams[i].name,
        played: false,
        season
      });
    }
  }
}


