const budgetMap = {
  "10L": 1000000,
  "20L": 2000000,
  "50L": 5000000,
  "1Cr": 10000000
};

function scoreLead(leadBudget, propertyPrice) {
  const budget = budgetMap[leadBudget];
  if (!budget || !propertyPrice) return "cold";
  const difference = Math.abs(budget - propertyPrice) / propertyPrice;
  if (difference <= 0.10) return "hot";
  if (difference <= 0.30) return "warm";
  return "cold";
}

module.exports = { scoreLead, budgetMap };
