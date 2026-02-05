/**
 * Wally – Reports & Analytics
 *
 * Monthly spending bar chart, category breakdown with proportion bars,
 * top-merchant list, AI insight cards, and Pro-only period tabs.
 */

import React, { useState } from 'react';
import { useApp }           from '../../AppContext';
import { ChevronLeft, Lock }      from '../shared/Icons';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ─── Helper: Compute Category Totals ─────────────────────────────────────────
function computeCategoryTotals(txns) {
  const expenseTxns = txns.filter(t => t.type === 'expense');
  const catMap = {};
  expenseTxns.forEach(t => {
    if (!catMap[t.category]) {
      catMap[t.category] = { category: t.category, total: 0, color: getCategoryColor(t.category) };
    }
    catMap[t.category].total += t.amount;
  });
  return Object.values(catMap).sort((a, b) => b.total - a.total);
}

// ─── Helper: Compute Top Merchants ───────────────────────────────────────────
function computeTopMerchants(txns, limit = 5) {
  const expenseTxns = txns.filter(t => t.type === 'expense');
  const merchMap = {};
  expenseTxns.forEach(t => {
    if (!merchMap[t.merchant]) {
      merchMap[t.merchant] = { merchant: t.merchant, category: t.category, total: 0, count: 0 };
    }
    merchMap[t.merchant].total += t.amount;
    merchMap[t.merchant].count += 1;
  });
  return Object.values(merchMap).sort((a, b) => b.total - a.total).slice(0, limit);
}

// ─── Custom Tooltip for the bar chart ────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #E8E8E8', borderRadius: '10px',
      padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1C1C1E', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{label}</p>
      <p style={{ fontSize: '13px', color: '#2D9CDB', fontWeight: 600, margin: '2px 0 0', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const { isPro, reportData, navigate, transactions, goals, setPendingCoachPrompt } = useApp();

  // period tabs: free users see all 4 tabs, but Yearly is locked
  const allTabs = ['Monthly', 'Weekly', 'Quarterly', 'Yearly'];
  const [activeTab, setActiveTab] = useState('Monthly');

  // ── Month picker (Monthly tab) ──────────────────────────────────────────
  const allMonths = [
    { key: '2026-02', label: 'Feb 2026' },
    { key: '2026-01', label: 'Jan 2026' },
    { key: '2025-12', label: 'Dec 2025' },
    { key: '2025-11', label: 'Nov 2025' },
    { key: '2025-10', label: 'Oct 2025' },
    { key: '2025-09', label: 'Sep 2025' },
  ];
  const availableMonths = isPro ? allMonths : allMonths.slice(0, 3);
  const [selectedMonth, setSelectedMonth] = useState('2026-02');

  // ── Export modal state ───────────────────────────────────────────────────
  const [showExport,          setShowExport]          = useState(false);
  const [exportFormat,        setExportFormat]        = useState('CSV');
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeReports,      setIncludeReports]      = useState(true);
  const [exportSuccess,       setExportSuccess]       = useState(false);

  // ── derived numbers (live data for selected month) ─────────────────────
  const monthTxns = transactions.filter(t => t.date.startsWith(selectedMonth));
  const totalIncome   = monthTxns.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const totalExpenses = monthTxns.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const netSavings    = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

  // ── Monthly bar chart data (daily spending for selected month) ───────────
  const [selYear, selMon] = selectedMonth.split('-').map(Number);
  const daysInMonth = new Date(selYear, selMon, 0).getDate();
  const monthlyChartData = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${selectedMonth}-${String(day).padStart(2, '0')}`;
    const dayTxns = transactions.filter(t => t.date === dateStr && t.type === 'expense');
    const total = dayTxns.reduce((s, t) => s + t.amount, 0);
    monthlyChartData.push({ month: String(day), total });
  }

  // ── Weekly data (last 7 days) ─────────────────────────────────────────────
  const weekTxns = transactions.filter(t => t.date >= '2026-01-28');
  const weekIncome = weekTxns.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const weekExpenses = weekTxns.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const weekNetSavings = weekIncome - weekExpenses;
  const weekSavingsRate = weekIncome > 0 ? ((weekNetSavings / weekIncome) * 100).toFixed(1) : '0.0';

  // Weekly bar chart data: 7 days from Jan 28 to Feb 3
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDates = ['2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31', '2026-02-01', '2026-02-02', '2026-02-03'];
  const weekChartData = weekDays.map((day, i) => {
    const dayTxns = transactions.filter(t => t.date === weekDates[i] && t.type === 'expense');
    const total = dayTxns.reduce((s,t) => s + t.amount, 0);
    return { month: day, total };
  });

  // ── Quarterly data (Q4 2025: Oct-Dec) ─────────────────────────────────────
  const quarterTxns = transactions.filter(t => t.date >= '2025-10-01' && t.date <= '2025-12-31');
  const quarterIncome = quarterTxns.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const quarterExpenses = quarterTxns.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const quarterNetSavings = quarterIncome - quarterExpenses;
  const quarterSavingsRate = quarterIncome > 0 ? ((quarterNetSavings / quarterIncome) * 100).toFixed(1) : '0.0';

  // Quarterly bar chart data: 3 months
  const quarterMonths = ['Oct', 'Nov', 'Dec'];
  const quarterKeys = ['2025-10', '2025-11', '2025-12'];
  const quarterChartData = quarterMonths.map((month, i) => {
    const monthTxns = transactions.filter(t => t.date.startsWith(quarterKeys[i]) && t.type === 'expense');
    const total = monthTxns.reduce((s,t) => s + t.amount, 0);
    return { month, total };
  });

  // ── Yearly data (2025: full year) ────────────────────────────────────────
  const yearTxns = transactions.filter(t => t.date >= '2025-01-01' && t.date <= '2025-12-31');
  const yearIncome = yearTxns.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const yearExpenses = yearTxns.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const yearNetSavings = yearIncome - yearExpenses;
  const yearSavingsRate = yearIncome > 0 ? ((yearNetSavings / yearIncome) * 100).toFixed(1) : '0.0';

  // ── Live-computed data for each tab ──────────────────────────────────────
  const monthlyCategoryTotals = computeCategoryTotals(monthTxns);
  const monthlyTopMerchants = computeTopMerchants(monthTxns, 5);
  const monthlyCatGrand = monthlyCategoryTotals.reduce((s, c) => s + c.total, 0);
  const monthlyCatMax = monthlyCategoryTotals[0]?.total || 1;

  const weeklyCategoryTotals = computeCategoryTotals(weekTxns);
  const weeklyTopMerchants = computeTopMerchants(weekTxns, 5);
  const weeklyCatGrand = weeklyCategoryTotals.reduce((s, c) => s + c.total, 0);
  const weeklyCatMax = weeklyCategoryTotals[0]?.total || 1;

  const quarterlyCategoryTotals = computeCategoryTotals(quarterTxns);
  const quarterlyTopMerchants = computeTopMerchants(quarterTxns, 5);
  const quarterlyCatGrand = quarterlyCategoryTotals.reduce((s, c) => s + c.total, 0);
  const quarterlyCatMax = quarterlyCategoryTotals[0]?.total || 1;

  const yearlyCategoryTotals = computeCategoryTotals(yearTxns);
  const yearlyTopMerchants = computeTopMerchants(yearTxns, 5);
  const yearlyCatGrand = yearlyCategoryTotals.reduce((s, c) => s + c.total, 0);
  const yearlyCatMax = yearlyCategoryTotals[0]?.total || 1;

  // ── Handler: Navigate to AllTransactions with filter ─────────────────────
  const navigateToTransactions = (type, value) => {
    navigate('allTransactions', { txnFilter: { type, value } });
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100%', paddingBottom: '24px' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        <button
          onClick={() => navigate('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            minWidth: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ChevronLeft size={24} color="var(--cyan-primary)" strokeWidth={2.2} />
        </button>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          Reports
        </span>
        {isPro ? (
          <button
            onClick={() => setShowExport(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              minWidth: '40px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <span style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--cyan-primary)',
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}>Export</span>
          </button>
        ) : (
          <div style={{ width: '40px' }} />
        )}
      </div>

      {/* ── Period tab pills ──────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 24px',
        overflowX: 'auto',
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
      }} className="scroll-hide">
        {allTabs.map(t => {
          const active = activeTab === t;
          const isLocked = !isPro && (t === 'Weekly' || t === 'Quarterly' || t === 'Yearly');
          return (
            <button
              key={t}
              onClick={() => {
                if (!isLocked) setActiveTab(t);
              }}
              style={{
                whiteSpace     : 'nowrap',
                background     : active ? '#2D9CDB' : (isLocked ? 'var(--gray-100)' : 'var(--gray-100)'),
                color          : active ? 'var(--white)' : (isLocked ? 'var(--gray-400)' : 'var(--gray-600)'),
                border         : 'none',
                borderRadius   : 'var(--radius-full)',
                padding        : '8px 16px',
                minHeight      : '36px',
                fontSize       : '13px',
                fontWeight     : 600,
                cursor         : isLocked ? 'not-allowed' : 'pointer',
                fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                transition     : 'all 0.2s ease',
                boxShadow      : active ? '0 2px 10px rgba(0,0,0,0.02)' : 'none',
                display        : 'flex',
                alignItems     : 'center',
                gap            : '6px',
                opacity        : isLocked ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!active && !isLocked) {
                  e.currentTarget.style.background = 'var(--gray-200)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active && !isLocked) {
                  e.currentTarget.style.background = 'var(--gray-100)';
                }
              }}
            >
              {isLocked && <Lock size={12} color="var(--gray-400)" strokeWidth={2} />}
              {t}
            </button>
          );
        })}
      </div>

      {/* ── Month picker (Monthly tab only) ─────────────────────────── */}
      {activeTab === 'Monthly' && (
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '10px 24px',
          overflowX: 'auto',
          background: 'var(--white)',
          borderBottom: '1px solid var(--gray-200)',
        }} className="scroll-hide">
          {availableMonths.map(m => {
            const active = selectedMonth === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m.key)}
                style={{
                  whiteSpace     : 'nowrap',
                  background     : active ? 'var(--cyan-primary)' : 'var(--gray-100)',
                  color          : active ? 'var(--white)' : 'var(--gray-600)',
                  border         : 'none',
                  borderRadius   : 'var(--radius-full)',
                  padding        : '6px 14px',
                  minHeight      : '32px',
                  fontSize       : '12px',
                  fontWeight     : 600,
                  cursor         : 'pointer',
                  fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                  transition     : 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--gray-200)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'var(--gray-100)'; }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Weekly content ────────────────────────────────────────────── */}
      {activeTab === 'Weekly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
            {[
              { label: 'Total Income',   value: weekIncome,   rate: null, borderColor: 'var(--green-positive)', emoji: '💰' },
              { label: 'Total Expenses', value: weekExpenses, rate: null, borderColor: 'var(--red-negative)', emoji: '💸' },
              { label: 'Net Savings',    value: weekNetSavings,    rate: null, borderColor: 'var(--cyan-primary)', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: weekSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`,
                padding: '14px 12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{card.emoji}</span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--gray-500)',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}>{card.label}</span>
                </div>
                <span style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Weekly bar chart */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Daily Spending (Last 7 Days)
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,173,224,0.08)' }} />
                <Bar dataKey="total" fill="#2D9CDB" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Category Breakdown (Weekly) ────────────────────────────── */}
          <div style={{ padding: '16px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Category Breakdown
            </p>
            {weeklyCategoryTotals.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No expense data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {weeklyCategoryTotals.map((cat, i) => {
                  const pct      = ((cat.total / weeklyCatGrand) * 100).toFixed(1);
                  const barWidth = (cat.total / weeklyCatMax) * 100;
                  return (
                    <button
                      key={i}
                      onClick={() => navigateToTransactions('category', cat.category)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--white)',
                        border: '1px solid #F3F4F6',
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAFA';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--white)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* emoji + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 }}>
                        <span style={{ fontSize: '18px' }}>{getCategoryEmoji(cat.category)}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.category}
                        </span>
                      </div>

                      {/* proportion bar */}
                      <div style={{ flex: 1, height: '7px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: '4px', background: cat.color, transition: 'width 0.5s ease' }} />
                      </div>

                      {/* amount + pct */}
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {formatCurrency(cat.total)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8E8E93', marginLeft: '4px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {pct}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Top Merchants (Weekly) ─────────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Top Merchants
            </p>
            {weeklyTopMerchants.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No merchant data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {weeklyTopMerchants.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => navigateToTransactions('merchant', m.merchant)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 12px',
                      border: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FAFAFA';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--white)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* left: rank + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : '#E8E8E8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: i < 3 ? '#fff' : '#8E8E93',
                        fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{m.merchant}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 600, color: getCategoryColor(m.category),
                            background: getCategoryColor(m.category) + '1A',
                            borderRadius: '6px', padding: '1px 6px',
                            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                          }}>
                            {m.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                            {m.count} visit{m.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* right: total */}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                      {formatCurrency(m.total)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Quarterly content ─────────────────────────────────────────── */}
      {activeTab === 'Quarterly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
            {[
              { label: 'Total Income',   value: quarterIncome,   rate: null, borderColor: 'var(--green-positive)', emoji: '💰' },
              { label: 'Total Expenses', value: quarterExpenses, rate: null, borderColor: 'var(--red-negative)', emoji: '💸' },
              { label: 'Net Savings',    value: quarterNetSavings,    rate: null, borderColor: 'var(--cyan-primary)', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: quarterSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`,
                padding: '14px 12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{card.emoji}</span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--gray-500)',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}>{card.label}</span>
                </div>
                <span style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Quarterly bar chart */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Spending by Month (Q4 2025)
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={quarterChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,173,224,0.08)' }} />
                <Bar dataKey="total" fill="#2D9CDB" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Category Breakdown (Quarterly) ─────────────────────────── */}
          <div style={{ padding: '16px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Category Breakdown
            </p>
            {quarterlyCategoryTotals.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No expense data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {quarterlyCategoryTotals.map((cat, i) => {
                  const pct      = ((cat.total / quarterlyCatGrand) * 100).toFixed(1);
                  const barWidth = (cat.total / quarterlyCatMax) * 100;
                  return (
                    <button
                      key={i}
                      onClick={() => navigateToTransactions('category', cat.category)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--white)',
                        border: '1px solid #F3F4F6',
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAFA';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--white)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* emoji + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 }}>
                        <span style={{ fontSize: '18px' }}>{getCategoryEmoji(cat.category)}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.category}
                        </span>
                      </div>

                      {/* proportion bar */}
                      <div style={{ flex: 1, height: '7px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: '4px', background: cat.color, transition: 'width 0.5s ease' }} />
                      </div>

                      {/* amount + pct */}
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {formatCurrency(cat.total)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8E8E93', marginLeft: '4px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {pct}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Top Merchants (Quarterly) ──────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Top Merchants
            </p>
            {quarterlyTopMerchants.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No merchant data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {quarterlyTopMerchants.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => navigateToTransactions('merchant', m.merchant)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 12px',
                      border: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FAFAFA';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--white)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* left: rank + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : '#E8E8E8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: i < 3 ? '#fff' : '#8E8E93',
                        fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{m.merchant}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 600, color: getCategoryColor(m.category),
                            background: getCategoryColor(m.category) + '1A',
                            borderRadius: '6px', padding: '1px 6px',
                            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                          }}>
                            {m.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                            {m.count} visit{m.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* right: total */}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                      {formatCurrency(m.total)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Yearly content (with Premium Upgrade Card for Free) ────────── */}
      {activeTab === 'Yearly' && (
        <>
          {!isPro ? (
            // Premium Upgrade Card (Free tier)
            <div style={{ padding: '40px 24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 'var(--radius-card)',
                padding: '32px 24px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Lock size={32} color="#fff" strokeWidth={2} />
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 8px',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                }}>
                  Unlock Wally Pro
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.9)',
                  margin: '0 0 16px',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                  lineHeight: 1.5,
                }}>
                  Get the full picture of your finances.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {[
                    'Weekly, Quarterly & Yearly reports',
                    '6-month report history',
                    'Live AI chat powered by Gemini',
                    'Investment analysis & recommendations',
                    'AI budget suggestions',
                    'Data export (CSV / Excel / PDF)',
                    'Unlimited goals — no caps',
                    'Ad-free experience',
                  ].map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#fff', opacity: 0.9 }}>✓</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.92)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('profile')}
                  style={{
                    background: '#fff',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 32px',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                  }}
                >
                  See All Plans
                </button>
              </div>
            </div>
          ) : (
            // Full Yearly content (Pro tier)
            <>
              {/* Overview cards 2×2 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
                {[
                  { label: 'Total Income',   value: yearIncome,   rate: null, borderColor: 'var(--green-positive)', emoji: '💰' },
                  { label: 'Total Expenses', value: yearExpenses, rate: null, borderColor: 'var(--red-negative)', emoji: '💸' },
                  { label: 'Net Savings',    value: yearNetSavings,    rate: null, borderColor: 'var(--cyan-primary)', emoji: '🏦' },
                  { label: 'Savings Rate',   value: null,          rate: yearSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
                ].map((card, i) => (
                  <div key={i} style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid #F3F4F6',
                    borderTop: `3px solid ${card.borderColor}`,
                    padding: '14px 12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{card.emoji}</span>
                      <span style={{
                        fontSize: '10px',
                        color: 'var(--gray-500)',
                        fontWeight: 600,
                        fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}>{card.label}</span>
                    </div>
                    <span style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      color: 'var(--gray-900)',
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                      letterSpacing: '-0.01em',
                    }}>
                      {card.rate ? card.rate : formatCurrency(card.value)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Yearly bar chart */}
              <div style={{ padding: '8px 16px 4px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  Spending by Month (2025)
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={reportData.monthlySpending} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,173,224,0.08)' }} />
                    <Bar dataKey="total" fill="#2D9CDB" radius={[4, 4, 0, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ── Category Breakdown (Yearly) ────────────────────────────── */}
              <div style={{ padding: '16px 16px 4px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  Category Breakdown
                </p>
                {yearlyCategoryTotals.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                    No expense data for this period
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {yearlyCategoryTotals.map((cat, i) => {
                      const pct      = ((cat.total / yearlyCatGrand) * 100).toFixed(1);
                      const barWidth = (cat.total / yearlyCatMax) * 100;
                      return (
                        <button
                          key={i}
                          onClick={() => navigateToTransactions('category', cat.category)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'var(--white)',
                            border: '1px solid #F3F4F6',
                            borderRadius: 'var(--radius-lg)',
                            padding: '14px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FAFAFA';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--white)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {/* emoji + name */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 }}>
                            <span style={{ fontSize: '18px' }}>{getCategoryEmoji(cat.category)}</span>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cat.category}
                            </span>
                          </div>

                          {/* proportion bar */}
                          <div style={{ flex: 1, height: '7px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: '4px', background: cat.color, transition: 'width 0.5s ease' }} />
                          </div>

                          {/* amount + pct */}
                          <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                              {formatCurrency(cat.total)}
                            </span>
                            <span style={{ fontSize: '11px', color: '#8E8E93', marginLeft: '4px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                              {pct}%
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Top Merchants (Yearly) ─────────────────────────────────── */}
              <div style={{ padding: '20px 16px 4px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  Top Merchants
                </p>
                {yearlyTopMerchants.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                    No merchant data for this period
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {yearlyTopMerchants.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => navigateToTransactions('merchant', m.merchant)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--white)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '14px 12px',
                          border: '1px solid #F3F4F6',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FAFAFA';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--white)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* left: rank + name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : '#E8E8E8',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 700, color: i < 3 ? '#fff' : '#8E8E93',
                            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                          }}>
                            {i + 1}
                          </span>
                          <div>
                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{m.merchant}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                              <span style={{
                                fontSize: '10px', fontWeight: 600, color: getCategoryColor(m.category),
                                background: getCategoryColor(m.category) + '1A',
                                borderRadius: '6px', padding: '1px 6px',
                                fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                              }}>
                                {m.category}
                              </span>
                              <span style={{ fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                                {m.count} visit{m.count !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* right: total */}
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                          {formatCurrency(m.total)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Goal Progress */}
              <div style={{ padding: '16px 16px 4px' }}>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  Goal Progress
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {goals.filter(g => g.isActive).map((goal) => {
                    const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
                    return (
                      <div key={goal.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '14px 12px',
                        border: '1px solid #F3F4F6',
                      }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{goal.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{goal.name}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#2D9CDB', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{Math.round(pct)}%</span>
                          </div>
                          <div className="progress-track" style={{ height: '5px' }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: '#2D9CDB', height: '5px' }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Monthly content (always rendered when tab is Monthly) ──── */}
      {activeTab === 'Monthly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px 24px' }}>
            {[
              { label: 'Total Income',   value: totalIncome,   rate: null, borderColor: 'var(--green-positive)', emoji: '💰' },
              { label: 'Total Expenses', value: totalExpenses, rate: null, borderColor: 'var(--red-negative)', emoji: '💸' },
              { label: 'Net Savings',    value: netSavings,    rate: null, borderColor: 'var(--cyan-primary)', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: savingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`,
                padding: '14px 12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{card.emoji}</span>
                  <span style={{
                    fontSize: '10px',
                    color: 'var(--gray-500)',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}>{card.label}</span>
                </div>
                <span style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* ── Daily Spending (bar chart) ────────────────────────── */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Daily Spending – {availableMonths.find(m => m.key === selectedMonth)?.label || selectedMonth}
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyChartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }} axisLine={false} tickLine={false} interval={2} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,173,224,0.08)' }} />
                <Bar dataKey="total" fill="#2D9CDB" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Category Breakdown (Monthly) ─────────────────────────── */}
          <div style={{ padding: '16px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Category Breakdown
            </p>
            {monthlyCategoryTotals.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No expense data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {monthlyCategoryTotals.map((cat, i) => {
                  const pct      = ((cat.total / monthlyCatGrand) * 100).toFixed(1);
                  const barWidth = (cat.total / monthlyCatMax) * 100;
                  return (
                    <button
                      key={i}
                      onClick={() => navigateToTransactions('category', cat.category)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--white)',
                        border: '1px solid #F3F4F6',
                        borderRadius: 'var(--radius-lg)',
                        padding: '14px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FAFAFA';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--white)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* emoji + name */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 }}>
                        <span style={{ fontSize: '18px' }}>{getCategoryEmoji(cat.category)}</span>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cat.category}
                        </span>
                      </div>

                      {/* proportion bar */}
                      <div style={{ flex: 1, height: '7px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: '4px', background: cat.color, transition: 'width 0.5s ease' }} />
                      </div>

                      {/* amount + pct */}
                      <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {formatCurrency(cat.total)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8E8E93', marginLeft: '4px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                          {pct}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Top Merchants (Monthly) ────────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Top Merchants
            </p>
            {monthlyTopMerchants.length === 0 ? (
              <p style={{ fontSize: '13px', color: 'var(--gray-500)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                No merchant data for this period
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {monthlyTopMerchants.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => navigateToTransactions('merchant', m.merchant)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 12px',
                      border: '1px solid #F3F4F6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FAFAFA';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--white)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* left: rank + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: i < 3 ? ['#FFD700', '#C0C0C0', '#CD7F32'][i] : '#E8E8E8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 700, color: i < 3 ? '#fff' : '#8E8E93',
                        fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                      }}>
                        {i + 1}
                      </span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gray-900)', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{m.merchant}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{
                            fontSize: '10px', fontWeight: 600, color: getCategoryColor(m.category),
                            background: getCategoryColor(m.category) + '1A',
                            borderRadius: '6px', padding: '1px 6px',
                            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                          }}>
                            {m.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                            {m.count} visit{m.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* right: total */}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                      {formatCurrency(m.total)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── AI Insights ───────────────────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gray-900)', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              AI Insights
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { emoji: '🍽️', text: 'Food spending is your largest category at 32% of total', prompt: 'Tell me more about my food spending' },
                { emoji: '🎯', text: 'You stayed within budget in 9 out of 12 months', prompt: 'Which months did I go over budget?' },
                { emoji: '📊', text: 'Your average monthly savings is 22%', prompt: 'How can I improve my savings rate?' },
              ].map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  background: '#EFF8FC', border: '1px solid #D6EDF8', borderRadius: 'var(--radius-lg)', padding: '14px 12px',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1.3 }}>{ins.emoji}</span>
                  <span style={{ flex: 1, fontSize: '13px', color: '#1A6B9A', fontWeight: 500, lineHeight: 1.4, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                    {ins.text}
                  </span>
                  <button
                    onClick={() => { setPendingCoachPrompt(ins.prompt); navigate('coach'); }}
                    style={{
                      background: 'rgba(45, 156, 219, 0.08)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      color: '#2D9CDB',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flexShrink: 0,
                      fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    }}
                  >
                    Ask AI →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          EXPORT MODAL (Pro only)
          ══════════════════════════════════════════════════════════════════ */}
      {showExport && (
        <div
          style={{
            position       : 'fixed',
            inset          : 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex         : 100,
            display        : 'flex',
            alignItems     : 'flex-end',
            justifyContent : 'center',
          }}
          onClick={() => {
            if (!exportSuccess) {
              setShowExport(false);
              setExportSuccess(false);
            }
          }}
        >
          <div
            style={{
              background     : '#FFFFFF',
              borderRadius   : '20px 20px 0 0',
              padding        : '20px',
              width          : '100%',
              maxWidth       : '500px',
              margin         : '0 auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success flash */}
            {exportSuccess ? (
              <div
                style={{
                  textAlign      : 'center',
                  padding        : '40px 20px',
                  backgroundColor: '#D4EDDA',
                  border         : '1px solid #C3E6CB',
                  borderRadius   : '14px',
                  marginBottom   : '20px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>✓</div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#155724', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  Report exported successfully
                </span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                    Export Report
                  </span>
                  <button
                    onClick={() => {
                      setShowExport(false);
                      setExportSuccess(false);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <ChevronLeft size={20} color="#8E8E93" strokeWidth={2} />
                  </button>
                </div>

                {/* Format selector */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif', display: 'block', marginBottom: '8px' }}>
                  Format
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {['CSV', 'Excel', 'PDF'].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      style={{
                        flex           : 1,
                        padding        : '10px',
                        borderRadius   : '10px',
                        border         : 'none',
                        backgroundColor: exportFormat === fmt ? '#2D9CDB' : '#F2F2F7',
                        color          : exportFormat === fmt ? '#FFFFFF' : '#8E8E93',
                        fontSize       : '13px',
                        fontWeight     : 600,
                        cursor         : 'pointer',
                        fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                        transition     : 'all 0.15s',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                {/* Date Range */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif', display: 'block', marginBottom: '8px' }}>
                  Date Range
                </label>
                <div
                  style={{
                    width          : '100%',
                    padding        : '12px 14px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    fontWeight     : 500,
                    color          : '#1C1C1E',
                    fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                    backgroundColor: '#FAFAFA',
                    marginBottom   : '16px',
                  }}
                >
                  Last 12 months
                </div>

                {/* Include options */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif', display: 'block', marginBottom: '8px' }}>
                  Include
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {/* Transactions toggle */}
                  <button
                    onClick={() => setIncludeTransactions(!includeTransactions)}
                    style={{
                      display        : 'flex',
                      justifyContent : 'space-between',
                      alignItems     : 'center',
                      padding        : '12px 14px',
                      borderRadius   : '10px',
                      border         : '1px solid #E8E8E8',
                      backgroundColor: '#FAFAFA',
                      cursor         : 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                      Transactions
                    </span>
                    <div style={{
                      width          : '44px',
                      height         : '24px',
                      borderRadius   : '12px',
                      backgroundColor: includeTransactions ? '#2D9CDB' : '#E8E8E8',
                      position       : 'relative',
                      transition     : 'background 0.2s',
                    }}>
                      <div style={{
                        width          : '20px',
                        height         : '20px',
                        borderRadius   : '50%',
                        backgroundColor: '#FFFFFF',
                        position       : 'absolute',
                        top            : '2px',
                        left           : includeTransactions ? '22px' : '2px',
                        transition     : 'left 0.2s',
                      }} />
                    </div>
                  </button>

                  {/* Reports toggle */}
                  <button
                    onClick={() => setIncludeReports(!includeReports)}
                    style={{
                      display        : 'flex',
                      justifyContent : 'space-between',
                      alignItems     : 'center',
                      padding        : '12px 14px',
                      borderRadius   : '10px',
                      border         : '1px solid #E8E8E8',
                      backgroundColor: '#FAFAFA',
                      cursor         : 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                      Reports
                    </span>
                    <div style={{
                      width          : '44px',
                      height         : '24px',
                      borderRadius   : '12px',
                      backgroundColor: includeReports ? '#2D9CDB' : '#E8E8E8',
                      position       : 'relative',
                      transition     : 'background 0.2s',
                    }}>
                      <div style={{
                        width          : '20px',
                        height         : '20px',
                        borderRadius   : '50%',
                        backgroundColor: '#FFFFFF',
                        position       : 'absolute',
                        top            : '2px',
                        left           : includeReports ? '22px' : '2px',
                        transition     : 'left 0.2s',
                      }} />
                    </div>
                  </button>
                </div>

                {/* Download button */}
                <button
                  onClick={() => {
                    setExportSuccess(true);
                    setTimeout(() => {
                      setExportSuccess(false);
                      setShowExport(false);
                    }, 1500);
                  }}
                  style={{
                    width          : '100%',
                    padding        : '14px',
                    borderRadius   : '12px',
                    border         : 'none',
                    background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    boxShadow      : '0 4px 14px rgba(74,173,224,0.40)',
                    color          : '#FFFFFF',
                    fontSize       : '15px',
                    fontWeight     : 600,
                    fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                    cursor         : 'pointer',
                  }}
                >
                  Download {exportFormat}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
