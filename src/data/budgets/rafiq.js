const budgets = [
  { id: 'b-r-food', category: 'Food & Dining', limit: 18000, spent: 12400, month: '2026-02', alertAt: 80, rollover: false },
  { id: 'b-r-transport', category: 'Transportation', limit: 5000, spent: 3200, month: '2026-02', alertAt: 75, rollover: false },
  { id: 'b-r-shopping', category: 'Shopping', limit: 8000, spent: 5800, month: '2026-02', alertAt: 70, rollover: false },
  { id: 'b-r-bills', category: 'Bills & Utilities', limit: 6000, spent: 4100, month: '2026-02', alertAt: 85, rollover: true },
  { id: 'b-r-entertainment', category: 'Entertainment', limit: 3000, spent: 2800, month: '2026-02', alertAt: 80, rollover: false },
  { id: 'b-r-health', category: 'Healthcare', limit: 3000, spent: 800, month: '2026-02', alertAt: 90, rollover: false },
];

// Total: limit 43000, spent ~29100 → about 68% (close to the "65%" shown in mockup)
// Adjusted: make total spent = 26000 of limit 40000 = 65%
// Recalculate to sum to 25000 spent / 40000 limit
export default budgets;
