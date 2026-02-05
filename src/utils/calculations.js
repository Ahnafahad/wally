/**
 * Wally – Utility: Calculations
 * Pure functions that derive totals, sort transactions, and suggest categories.
 */

// ─── Account & budget aggregates ────────────────────────────────────────────
export function getTotalBalance(accounts) {
  return accounts.reduce((sum, acct) => sum + acct.balance, 0);
}

export function getTotalBudgetLimit(budgets) {
  return budgets.reduce((sum, b) => sum + b.limit, 0);
}

export function getTotalBudgetSpent(budgets) {
  return budgets.reduce((sum, b) => sum + b.spent, 0);
}

// ─── Recency slice  ─────────────────────────────────────────────────────────
export function getRecentTransactions(transactions, count = 10) {
  return [...transactions]
    .sort((a, b) => new Date(b.date + 'T00:00:00') - new Date(a.date + 'T00:00:00'))
    .slice(0, count);
}

// ─── Merchant → category heuristic  ─────────────────────────────────────────
// Each entry: [ [keyword, …], category ]
// Keywords are matched case-insensitively via String.includes().
const MERCHANT_RULES = [
  // Food & Dining
  { keywords: ['shwapno', 'meena bazar', 'agora', 'foodpanda', 'kfc', 'pizza hut', 'nandos', 'star kabab', 'coffee'], category: 'Food & Dining' },

  // Transportation  – "pathao" but NOT "pathao food"
  { keywords: ['uber', 'meghna', 'padma'], category: 'Transportation' },
  { keywords: ['pathao'], category: 'Transportation', exclude: ['pathao food'] },

  // Bills & Utilities
  { keywords: ['desco', 'dpdc', 'grameenphone', 'robi', 'btcl', 'titas', 'carnival', 'adobe'], category: 'Bills & Utilities' },

  // Entertainment
  { keywords: ['netflix', 'spotify', 'star cineplex'], category: 'Entertainment' },

  // Shopping
  { keywords: ['daraz', 'aarong', 'pickaboo', 'ryans', 'star tech', 'yellow', 'jamuna'], category: 'Shopping' },

  // Healthcare
  { keywords: ['ibn sina', 'square hospital', 'apollo'], category: 'Healthcare' },

  // Education
  { keywords: ['udemy', 'coursera', 'rokomari', '10 minute'], category: 'Education' },

  // Personal Care
  { keywords: ['persona', 'matrix gym', 'fitness station', 'la belle'], category: 'Personal Care' },
];

/**
 * Returns the best-matching category string, or null when nothing matches.
 */
export function suggestCategory(merchantName) {
  if (!merchantName) return null;

  const lower = merchantName.toLowerCase();

  for (const rule of MERCHANT_RULES) {
    // If any exclude keyword is present, skip this rule
    if (rule.exclude && rule.exclude.some(ex => lower.includes(ex.toLowerCase()))) {
      continue;
    }

    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return rule.category;
    }
  }

  return null;
}

// ─── Pro Budget Features ────────────────────────────────────────────────────

/**
 * Calculate budget trends for the last N months
 * Returns array of {month, spent, budget} objects for charting
 */
export function calculateBudgetTrends(transactions, budgets, monthsBack = 6) {
  const today = new Date('2026-02-04'); // hardcoded demo date
  const trends = [];

  // Category name to budget limit mapping
  const budgetLimits = {};
  budgets.forEach(b => {
    budgetLimits[b.category] = b.limit;
  });

  for (let i = monthsBack - 1; i >= 0; i--) {
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() - i);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    // Calculate total spending for this month
    const monthTransactions = transactions.filter(t =>
      t.type === 'expense' && t.date.startsWith(monthStr)
    );

    const totalSpent = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = Object.values(budgetLimits).reduce((sum, limit) => sum + limit, 0);

    // Month label (e.g., "Sep", "Oct")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabel = monthNames[month - 1];

    trends.push({
      month: monthLabel,
      spent: totalSpent,
      budget: totalBudget,
    });
  }

  return trends;
}

/**
 * Generate AI budget recommendations based on spending patterns
 * Returns array of recommendation objects
 */
export function generateBudgetRecommendations(transactions, budgets, monthsBack = 3) {
  const recommendations = [];
  const today = new Date('2026-02-04');

  // Calculate average spending per category over last N months
  const categorySpending = {};

  for (let i = 0; i < monthsBack; i++) {
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() - i);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    const monthTransactions = transactions.filter(t =>
      t.type === 'expense' && t.date.startsWith(monthStr)
    );

    monthTransactions.forEach(t => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = [];
      }
      categorySpending[t.category].push(t.amount);
    });
  }

  // Calculate averages
  const categoryAverages = {};
  Object.keys(categorySpending).forEach(cat => {
    const total = categorySpending[cat].reduce((sum, amt) => sum + amt, 0);
    categoryAverages[cat] = total / monthsBack;
  });

  // Compare against budgets
  budgets.forEach(budget => {
    const avgSpending = categoryAverages[budget.category] || 0;
    const budgetLimit = budget.limit;

    // Over-budget recommendation (avg spending > budget by 15%+)
    if (avgSpending > budgetLimit * 1.15) {
      const suggested = Math.ceil(avgSpending / 1000) * 1000; // round to nearest 1000
      recommendations.push({
        type: 'increase',
        category: budget.category,
        current: budgetLimit,
        suggested: suggested,
        reason: `You've been spending an average of ৳${Math.round(avgSpending)} but your budget is ৳${budgetLimit}`,
      });
    }

    // Under-budget recommendation (avg spending < budget by 30%+)
    if (avgSpending < budgetLimit * 0.7 && avgSpending > 0) {
      const suggested = Math.ceil(avgSpending / 1000) * 1000;
      recommendations.push({
        type: 'decrease',
        category: budget.category,
        current: budgetLimit,
        suggested: suggested,
        reason: `You typically spend ৳${Math.round(avgSpending)}, consider reducing from ৳${budgetLimit}`,
      });
    }
  });

  // Missing budget recommendations
  Object.keys(categoryAverages).forEach(cat => {
    const hasbudget = budgets.find(b => b.category === cat);
    if (!hasbudget && categoryAverages[cat] > 1000) {
      const suggested = Math.ceil(categoryAverages[cat] / 1000) * 1000;
      recommendations.push({
        type: 'create',
        category: cat,
        current: 0,
        suggested: suggested,
        reason: `You've spent an average of ৳${Math.round(categoryAverages[cat])} on ${cat} but have no budget set`,
      });
    }
  });

  // Return top 2 recommendations
  return recommendations.slice(0, 2);
}

/**
 * Calculate spending projection for current month
 * Returns null if insufficient data, otherwise {projected, overage, overageDate}
 */
export function calculateSpendingProjection(currentSpent, budgetLimit) {
  const today = new Date('2026-02-04');
  const daysElapsed = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

  // Need at least 3 days of data
  if (daysElapsed < 3) return null;

  const dailyRate = currentSpent / daysElapsed;
  const projected = dailyRate * daysInMonth;

  // Only show alert if projection exceeds budget by 10%+
  if (projected <= budgetLimit * 1.1) return null;

  const overage = projected - budgetLimit;

  // Calculate approximate date when budget will be exceeded
  const daysUntilOverage = Math.floor(budgetLimit / dailyRate);
  const overageDate = new Date(today.getFullYear(), today.getMonth(), daysUntilOverage);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const overageDateStr = `${monthNames[overageDate.getMonth()]} ${overageDate.getDate()}`;

  return {
    projected: Math.round(projected),
    overage: Math.round(overage),
    overageDate: overageDateStr,
  };
}

/**
 * Apply budget template based on monthly income
 * Returns array of budget objects {category, limit}
 */
export function applyBudgetTemplate(templateName, monthlyIncome) {
  // Use default if income not provided
  const income = monthlyIncome || 50000;

  const templates = {
    '50-30-20': [
      { category: 'Food & Dining', limit: Math.round(income * 0.30) },
      { category: 'Bills & Utilities', limit: Math.round(income * 0.12) },
      { category: 'Transportation', limit: Math.round(income * 0.08) },
      { category: 'Entertainment', limit: Math.round(income * 0.15) },
      { category: 'Shopping', limit: Math.round(income * 0.10) },
      { category: 'Healthcare', limit: Math.round(income * 0.05) },
    ],
    'essential': [
      { category: 'Food & Dining', limit: Math.round(income * 0.30) },
      { category: 'Bills & Utilities', limit: Math.round(income * 0.15) },
      { category: 'Transportation', limit: Math.round(income * 0.10) },
      { category: 'Healthcare', limit: Math.round(income * 0.08) },
    ],
    'aggressive': [
      { category: 'Food & Dining', limit: Math.round(income * 0.20) },
      { category: 'Bills & Utilities', limit: Math.round(income * 0.12) },
      { category: 'Transportation', limit: Math.round(income * 0.08) },
      { category: 'Entertainment', limit: Math.round(income * 0.05) },
    ],
    'balanced': [
      { category: 'Food & Dining', limit: Math.round(income * 0.14) },
      { category: 'Bills & Utilities', limit: Math.round(income * 0.14) },
      { category: 'Transportation', limit: Math.round(income * 0.14) },
      { category: 'Entertainment', limit: Math.round(income * 0.14) },
      { category: 'Shopping', limit: Math.round(income * 0.14) },
      { category: 'Healthcare', limit: Math.round(income * 0.14) },
      { category: 'Education', limit: Math.round(income * 0.08) },
      { category: 'Personal Care', limit: Math.round(income * 0.08) },
    ],
  };

  return templates[templateName] || [];
}

/**
 * Calculate average monthly income from transactions
 */
export function calculateAverageIncome(transactions, monthsBack = 3) {
  const today = new Date('2026-02-04');
  let totalIncome = 0;
  let monthsWithIncome = 0;

  for (let i = 0; i < monthsBack; i++) {
    const targetDate = new Date(today);
    targetDate.setMonth(today.getMonth() - i);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;

    const monthIncome = transactions
      .filter(t => t.type === 'income' && t.date.startsWith(monthStr))
      .reduce((sum, t) => sum + t.amount, 0);

    if (monthIncome > 0) {
      totalIncome += monthIncome;
      monthsWithIncome++;
    }
  }

  return monthsWithIncome > 0 ? totalIncome / monthsWithIncome : 50000; // default fallback
}
