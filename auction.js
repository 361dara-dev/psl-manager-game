let auctionState = {
  round: 0,
  currentPlayerIndex: 0,
  currentBid: 0,
  highestBidder: null,
  activePlayer: null,
  completed: false,
  players: []
};

const auctionRounds = [
  { name: "Round 1 – Elite Overseas", filter: p => p.overseas && p.basePrice >= 2.0 },
  { name: "Round 2 – Elite Pakistani", filter: p => !p.overseas && p.basePrice >= 2.0 },
  { name: "Round 3 – Overseas All-Rounders", filter: p => p.overseas && p.role === "All-Rounder" },
  { name: "Round 4 – Local Core Players", filter: p => !p.overseas },
  { name: "Round 5 – Budget Picks", filter: p => p.basePrice <= 0.8 }
];

function canBuyPlayer(team, player) {
  let overseasCount = team.players.filter(p => p.overseas).length;
  if (player.overseas && overseasCount >= 6) return false;
  if (team.players.length >= 20) return false;
  if (team.budget < auctionState.currentBid) return false;
  if (team.wageUsed + player.wage > team.wage) return false;
  return true;
}

function startAuctionRound(playersPool) {
  let round = auctionRounds[auctionState.round];
  auctionState.players = playersPool.filter(round.filter);
  auctionState.currentPlayerIndex = 0;
  loadNextAuctionPlayer();
}

function loadNextAuctionPlayer() {
  if (auctionState.currentPlayerIndex >= auctionState.players.length) {
    auctionState.round++;

    if (auctionState.round >= auctionRounds.length) {
      auctionState.completed = true;
      document.getElementById("auction").innerHTML =
        "<h2>Auction Completed</h2>";
      return;
    }

    startAuctionRound(players);
    return;
  }

  auctionState.activePlayer =
    auctionState.players[auctionState.currentPlayerIndex];

  auctionState.currentBid = auctionState.activePlayer.basePrice;
  auctionState.highestBidder = null;

  renderAuctionUI();
}

function renderAuctionUI() {
  let p = auctionState.activePlayer;

  document.getElementById("auction").innerHTML = `
    <h2>${auctionRounds[auctionState.round].name}</h2>
    <h3>${p.name}</h3>
    <p>Role: ${p.role}</p>
    <p>Base Price: £${p.basePrice}m</p>
    <p>Current Bid: £${auctionState.currentBid.toFixed(1)}m</p>
    <p>Highest Bidder: ${auctionState.highestBidder || "None"}</p>

    <button onclick="humanBid()">+£0.1m</button>
    <button onclick="finalizeAuction()">Sell Player</button>
  `;
}

function humanBid() {
  if (!canBuyPlayer(userTeam, auctionState.activePlayer)) return;

  auctionState.currentBid += 0.1;
  auctionState.highestBidder = userTeam.name;

  aiBidResponse();
  renderAuctionUI();
}

function aiBidResponse() {
  teams.forEach(team => {
    if (team.name === userTeam.name) return;
    if (!canBuyPlayer(team, auctionState.activePlayer)) return;

    let aggression = Math.random() * 1.2;

    if (auctionState.currentBid * aggression <
        auctionState.activePlayer.basePrice * 1.5) {
      auctionState.currentBid += 0.1;
      auctionState.highestBidder = team.name;
    }
  });
}

function finalizeAuction() {
  let buyer = teams.find(t => t.name === auctionState.highestBidder);

  if (buyer && canBuyPlayer(buyer, auctionState.activePlayer)) {
    buyer.budget -= auctionState.currentBid;
    buyer.wageUsed += auctionState.activePlayer.wage;
    buyer.players.push(auctionState.activePlayer);
  }

  auctionState.currentPlayerIndex++;
  loadNextAuctionPlayer();
}
