function awardRevenue(position) {
  const rewards = [20, 15, 10, 8, 6, 5];

  // convert 1-based → 0-based
  const index = position - 1;

  // bottom teams still earn something
  if (index < 0 || index >= rewards.length) {
    return 3; // participation revenue
  }

  return rewards[index];
}


