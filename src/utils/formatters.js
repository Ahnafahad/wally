/**
 * Wally – Utility: Formatters
 * Bangladeshi currency formatting, date helpers, and category metadata.
 */

// ─── Bangladeshi comma grouping ────────────────────────────────────────────
// 1,27,750  →  last 3 digits as one group, then groups of 2 from the right.
export function formatBangla(num) {
  const str = String(Math.abs(Math.round(num)));
  if (str.length <= 3) return str;

  const last3 = str.slice(-3);
  const rest  = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

  return grouped + ',' + last3;
}

// ─── Currency string  ───────────────────────────────────────────────────────
// "৳ 1,27,750"   |  negative → "-৳ 1,27,750"
export function formatCurrency(amount) {
  const sign = amount < 0 ? '-' : '';
  return sign + '৳ ' + formatBangla(Math.abs(amount));
}

// ─── Compact currency (dashboard cards, tight spaces) ───────────────────────
// ≥ 1 00 000 → "৳12.8L"   |   ≥ 1 000 → "৳12.8k"   |   else full
export function formatCompact(amount) {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 100000) {
    return sign + '৳' + (abs / 100000).toFixed(1) + 'L';
  }
  if (abs >= 1000) {
    return sign + '৳' + (abs / 1000).toFixed(1) + 'k';
  }
  return formatCurrency(amount);
}

// ─── Pretty date  ───────────────────────────────────────────────────────────
// "2026-02-04"  →  "Feb 4, 2026"
export function formatDate(dateStr) {
  const months = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];
  // Append T00:00:00 to avoid browser timezone shift on date-only strings
  const d = new Date(dateStr + 'T00:00:00');
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

// ─── Relative date  ─────────────────────────────────────────────────────────
// Fixed demo reference: 2026-02-04.  "Today" / "Yesterday" / "N days ago"
export function formatRelative(dateStr) {
  const REF = new Date('2026-02-04T00:00:00');
  const d   = new Date(dateStr + 'T00:00:00');

  // Difference in whole days (positive = dateStr is in the past)
  const diffMs   = REF.getTime() - d.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1)   return diffDays + ' days ago';

  // Future dates (shouldn't normally appear, but handle gracefully)
  if (diffDays === -1) return 'Tomorrow';
  return Math.abs(diffDays) + ' days from now';
}

// ─── Category colours  ──────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Food & Dining':    '#FF9500',
  'Transportation':   '#5AC8FA',
  'Shopping':         '#AF52DE',
  'Bills & Utilities':'#FFD60A',
  'Entertainment':    '#FF375F',
  'Healthcare':       '#30D158',
  'Education':        '#64D2FF',
  'Personal Care':    '#FF6B6B',
  'Salary':           '#34C759',
  'Savings':          '#4AADE0',
  'Cash':             '#8E8E93',
  'Freelance':        '#34C759',
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#8E8E93';
}

// ─── Category emojis  ───────────────────────────────────────────────────────
const CATEGORY_EMOJIS = {
  'Food & Dining':    '🍽️',
  'Transportation':   '🚗',
  'Shopping':         '🛍️',
  'Bills & Utilities':'💡',
  'Entertainment':    '🎬',
  'Healthcare':       '🏥',
  'Education':        '📚',
  'Personal Care':    '✂️',
  'Salary':           '💰',
  'Savings':          '🏦',
  'Cash':             '💵',
  'Freelance':        '💼',
};

export function getCategoryEmoji(category) {
  return CATEGORY_EMOJIS[category] || '💳';
}
