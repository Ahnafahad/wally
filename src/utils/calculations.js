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
