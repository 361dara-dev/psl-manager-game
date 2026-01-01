function ballOutcome(bat, bowl, pitch, isHomeBowler) {
  let pitchData = pitchTypes[pitch];
if (Math.random() < 0.002) {
  causeInjury(bat);
}

if (Math.random() < 0.003) {
  causeInjury(bowl);
}

  let battingFactor = bat.batting * pitchData.battingBoost;
  let bowlingFactor = bowl.bowling;

  if (bowl.role === "Bowler") {
    if (bowl.bowlingType === "Pace") {
      bowlingFactor *= pitchData.paceBoost;
    }
    if (bowl.bowlingType === "Spin") {
      bowlingFactor *= pitchData.spinBoost;
    }
  }

  if (isHomeBowler) bowlingFactor *= 1.05;

  let chance = Math.random() * (battingFactor / bowlingFactor);

  if (Math.random() < 0.04 * pitchData.wicketChance) return "W";
  if (chance < 0.35) return 0;
  if (chance < 0.6) return 1;
  if (chance < 0.75) return 2;
  if (chance < 0.9) return 4;
  return 6;
}

function simulateMatch(teamA, teamB) {
  let innings1 = playInnings(teamA, teamB);
  let innings2 = playInnings(teamB, teamA, innings1.runs + 1);
  teamA.isHome = true;
  teamB.isHome = false;

  let winner =
    innings1.runs > innings2.runs ? teamA.name :
    innings2.runs > innings1.runs ? teamB.name : "Tie";

  return { innings1, innings2, winner };
}

function playInnings(battingTeam, bowlingTeam, target = null) {
  let runs = 0, wickets = 0, balls = 0;
  let striker = 0, nonStriker = 1;

  const batters = battingTeam.players.slice(0, 11);
  const bowlers = bowlingTeam.players.filter(p => p.role !== "Batsman");

  let battingCard = {};
  let bowlingCard = {};
  let log = [];

  batters.forEach(p => {
    battingCard[p.name] = { runs: 0, balls: 0, out: false };
  });

  bowlers.forEach(p => {
    bowlingCard[p.name] = { overs: 0, runs: 0, wickets: 0, balls: 0 };
  });

  let bowlerIndex = 0;

  while (balls < 120 && wickets < 10) {
    let bowler = bowlers[bowlerIndex % bowlers.length];
    let bat = batters[striker];

   let result = ballOutcome(
  bat,
  bowler,
  bowlingTeam.isHome ? bowlingTeam.pitch : battingTeam.pitch,
  bowlingTeam.isHome
);


    if (result === "W") {
      wickets++;
      battingCard[bat.name].out = true;
      bowlingCard[bowler.name].wickets++;
      striker = Math.max(striker, nonStriker) + 1;
    } else {
      runs += result;
      battingCard[bat.name].runs += result;
      bowlingCard[bowler.name].runs += result;
      if (result % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
    }

    log.push(`${Math.floor(balls/6)}.${balls%6} - ${result}`);

    if (balls % 6 === 0) {
      bowlingCard[bowler.name].overs++;
      [striker, nonStriker] = [nonStriker, striker];
      bowlerIndex++;
    }

    if (target && runs >= target) break;
  }

  return {
    runs,
    wickets,
    balls,
    log,
    battingCard,
    bowlingCard
  };
}
function postMatchUpdate(team) {
  team.players.forEach(p => {
    if (p.injured) {
      p.injuryDays--;
      if (p.injuryDays <= 0) {
        p.injured = false;
        p.fitness = 70;
      }
    } else {
      recoverFatigue(p);
    }
  });
}

