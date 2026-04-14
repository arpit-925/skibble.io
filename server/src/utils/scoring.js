function calculateGuessScore({ timeLeft, drawTime, guessOrder }) {
  const speedRatio = drawTime > 0 ? Math.max(0, timeLeft / drawTime) : 0;
  const speedBonus = Math.round(speedRatio * 600);
  const orderBonus = Math.max(0, 250 - guessOrder * 50);
  return 100 + speedBonus + orderBonus;
}

function calculateDrawerScore(correctGuessCount) {
  return correctGuessCount * 50;
}

module.exports = {
  calculateGuessScore,
  calculateDrawerScore,
};
