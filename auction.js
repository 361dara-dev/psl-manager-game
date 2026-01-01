let auctionState = {
  round: 0,
  currentPlayerIndex: 0,
  currentBid: 0,
  highestBidder: null,
  activePlayer: null,
  completed: false
};

const auctionRounds = [
  { name: "Round 1 – Elite Overseas", filter: p => p.overseas && p.basePrice >= 2.0 },
  { name: "Round 2 – Elite Pakistani", filter: p => !p.overseas && p.basePrice >= 2.0 },
  { name: "Round 3 – Overseas All-Rounders", filter: p => p.overseas && p.role === "All-Rounder" },
  { name: "Round 4 – Local Core Players", filter: p => !p.overseas },
  { name: "Round 5 – Budget Picks", filter: p => p.basePrice <= 0.8 }
];

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
  let team = userTeam;

  if (team.budget < auctionState.currentBid + 0.1) return;

  auctionState.currentBid += 0.1;
  auctionState.highestBidder = team.name;

  aiBidResponse();
  renderAuctionUI();
}
function aiBidResponse() {
  teams.forEach(team => {
    if (team.name === userTeam.name) return;
    if (team.budget < auctionState.currentBid + 0.1) return;

    let interest =
      auctionState.activePlayer.basePrice *
      (team.budget / 100) *
      Math.random();

    if (interest > auctionState.currentBid) {
      auctionState.currentBid += 0.1;
      auctionState.highestBidder = team.name;
    }
  });
}
function finalizeAuction() {
  let buyer = teams.find(t => t.name === auctionState.highestBidder);

  if (!buyer) {
    auctionState.currentPlayerIndex++;
    loadNextAuctionPlayer();
    return;
  }

  // Budget + wage checks
  if (buyer.budget < auctionState.currentBid) return;
  if (buyer.wageUsed + auctionState.activePlayer.wage > buyer.wage) return;

  buyer.budget -= auctionState.currentBid;
  buyer.wageUsed += auctionState.activePlayer.wage;
  buyer.players.push(auctionState.activePlayer);

  auctionState.currentPlayerIndex++;
  loadNextAuctionPlayer();
}

finalizeAuction(function canBuyPlayer(team, player) {
  let overseasCount =
    team.players.filter(p => p.overseas).length;

  if (player.overseas && overseasCount >= 6) return false;
  if (team.players.length >= 20) return false;
  return true;
})
