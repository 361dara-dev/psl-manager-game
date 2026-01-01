const players = [
  {
    name: "Babar Azam",
    role: "Batsman",
    overseas: false,
    basePrice: 2.5,
    batting: 88,
    bowling: 10,
    age: 30,
    stats: { runs: 0, wickets: 0, innings: 0 }
  },
  {
    name: "Shaheen Afridi",
    role: "Bowler",
    overseas: false,
    basePrice: 2.2,
    batting: 30,
    bowling: 90,
    age: 25,
    stats: { runs: 0, wickets: 0, innings: 0 }
  }
];
wage: Math.min(3, (this.basePrice * 0.8).toFixed(1))
{
  name: "Shaheen Afridi",
  role: "Bowler",
  overseas: false,
  basePrice: 2.2,
  wage: 1.8,
  batting: 30,
  bowling: 90,
  age: 25,
  stats: { runs: 0, wickets: 0 }
}
{
  name: "Shadab Khan",
  role: "All-Rounder",
  bowlingType: "Spin",
  overseas: false,
  basePrice: 1.8,
  wage: 1.4,
  batting: 65,
  bowling: 78,
  age: 26,
  stats: { runs: 0, wickets: 0 }
}
{
  name: "Babar Azam",
  role: "Batsman",
  overseas: false,
  basePrice: 2.5,
  wage: 2.0,
  batting: 88,
  bowling: 10,
  age: 30,

  fitness: 100,        // 0–100
  injured: false,
  injuryDays: 0,       // matches remaining
  fatigue: 0,          // increases per match

  stats: {
    runs: 0,
    wickets: 0,
    innings: 0,
    matches: 0
  }
}
retained: false,
retentionCount: 0
{
  name: "Shaheen Afridi",
  role: "Bowler",
  overseas: false,
  basePrice: 2.2,
  wage: 1.8,
  batting: 30,
  bowling: 90,
  age: 25,

  retained: false,
  retentionCount: 0,

  fitness: 90,
  injured: false,
  injuryDays: 0,
  fatigue: 0,

  stats: { runs: 0, wickets: 0, matches: 0 }
}
function getRetentionCandidates(team) {
  return team.players
    .filter(p => !p.injured)
    .sort((a, b) =>
      (b.batting + b.bowling) - (a.batting + a.bowling)
    );
}
