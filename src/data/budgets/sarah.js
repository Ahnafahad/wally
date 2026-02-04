const budgets = [
  { id: 'b-s-food', category: 'Food & Dining', limit: 25000, spent: 18200, month: '2026-02', alertAt: 80, rollover: false },
  { id: 'b-s-transport', category: 'Transportation', limit: 8000, spent: 4500, month: '2026-02', alertAt: 75, rollover: false },
  { id: 'b-s-shopping', category: 'Shopping', limit: 15000, spent: 9800, month: '2026-02', alertAt: 70, rollover: true },
  { id: 'b-s-bills', category: 'Bills & Utilities', limit: 10000, spent: 6200, month: '2026-02', alertAt: 85, rollover: true },
  { id: 'b-s-entertainment', category: 'Entertainment', limit: 6000, spent: 4800, month: '2026-02', alertAt: 80, rollover: false },
  { id: 'b-s-health', category: 'Healthcare', limit: 5000, spent: 1200, month: '2026-02', alertAt: 90, rollover: false },
  { id: 'b-s-education', category: 'Education', limit: 5000, spent: 2100, month: '2026-02', alertAt: 85, rollover: true },
  { id: 'b-s-personal', category: 'Personal Care', limit: 4000, spent: 2800, month: '2026-02', alertAt: 75, rollover: false },
];

export default budgets;
