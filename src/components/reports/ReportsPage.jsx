/**
 * Wally – Reports & Analytics
 *
 * Monthly spending bar chart, category breakdown with proportion bars,
 * top-merchant list, AI insight cards, and Pro-only period tabs.
 */

import React, { useState } from 'react';
import { useApp }           from '../../AppContext';
import { ChevronLeft }      from '../shared/Icons';
import { formatCurrency, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
  const { isPro, reportData, navigate, transactions, goals } = useApp();

  // period tabs: free users only see Monthly
  const allTabs  = ['Monthly', 'Weekly', 'Quarterly', 'Yearly'];
  const tabs     = isPro ? allTabs : ['Monthly'];
  const [activeTab, setActiveTab] = useState('Monthly');

  // ── Export modal state ───────────────────────────────────────────────────
  const [showExport,          setShowExport]          = useState(false);
  const [exportFormat,        setExportFormat]        = useState('CSV');
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeReports,      setIncludeReports]      = useState(true);
  const [exportSuccess,       setExportSuccess]       = useState(false);

  // ── derived numbers (live data for current month) ───────────────────────
  // Try current month first, fall back to previous month
  const monthKey = '2026-02';
  const prevMonthKey = '2026-01';
  let monthTxns = transactions.filter(t => t.date.startsWith(monthKey));
  if (monthTxns.length === 0) monthTxns = transactions.filter(t => t.date.startsWith(prevMonthKey));
  const totalIncome   = monthTxns.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const totalExpenses = monthTxns.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const netSavings    = totalIncome - totalExpenses;
  const savingsRate   = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

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

  // category grand total for percentages
  const catGrand = reportData.categoryTotals.reduce((s, c) => s + c.total, 0);
  // sorted descending by total
  const sortedCats = [...reportData.categoryTotals].sort((a, b) => b.total - a.total);
  // max total for relative bar width
  const catMax = sortedCats[0]?.total || 1;

  // ─── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100%', paddingBottom: '100px' }}>

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
        {tabs.map(t => {
          const active = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                whiteSpace     : 'nowrap',
                background     : active ? '#2D9CDB' : 'var(--gray-100)',
                color          : active ? 'var(--white)' : 'var(--gray-600)',
                border         : 'none',
                borderRadius   : 'var(--radius-full)',
                padding        : '8px 16px',
                minHeight      : '36px',
                fontSize       : '13px',
                fontWeight     : 600,
                cursor         : 'pointer',
                fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                transition     : 'all 0.2s ease',
                boxShadow      : active ? '0 2px 10px rgba(0,0,0,0.02)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--gray-200)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--gray-100)';
                }
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* ── Weekly content ────────────────────────────────────────────── */}
      {activeTab === 'Weekly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px 16px' }}>
            {[
              { label: 'Total Income',   value: weekIncome,   rate: null, borderColor: '#34C759', emoji: '💰' },
              { label: 'Total Expenses', value: weekExpenses, rate: null, borderColor: '#FF3B30', emoji: '💸' },
              { label: 'Net Savings',    value: weekNetSavings,    rate: null, borderColor: '#2D9CDB', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: weekSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`, padding: '12px 10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{card.emoji}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: 500, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{card.label}</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Weekly bar chart */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
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
        </>
      )}

      {/* ── Quarterly content ─────────────────────────────────────────── */}
      {activeTab === 'Quarterly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px 16px' }}>
            {[
              { label: 'Total Income',   value: quarterIncome,   rate: null, borderColor: '#34C759', emoji: '💰' },
              { label: 'Total Expenses', value: quarterExpenses, rate: null, borderColor: '#FF3B30', emoji: '💸' },
              { label: 'Net Savings',    value: quarterNetSavings,    rate: null, borderColor: '#2D9CDB', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: quarterSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`, padding: '12px 10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{card.emoji}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: 500, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{card.label}</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Quarterly bar chart */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
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
        </>
      )}

      {/* ── Yearly content ────────────────────────────────────────────── */}
      {activeTab === 'Yearly' && (
        <>
          {/* Overview cards 2×2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px 16px' }}>
            {[
              { label: 'Total Income',   value: yearIncome,   rate: null, borderColor: '#34C759', emoji: '💰' },
              { label: 'Total Expenses', value: yearExpenses, rate: null, borderColor: '#FF3B30', emoji: '💸' },
              { label: 'Net Savings',    value: yearNetSavings,    rate: null, borderColor: '#2D9CDB', emoji: '🏦' },
              { label: 'Savings Rate',   value: null,          rate: yearSavingsRate + '%', borderColor: '#AF52DE', emoji: '📈' },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '12px', border: '1px solid #F3F4F6',
                borderTop: `3px solid ${card.borderColor}`, padding: '12px 10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{card.emoji}</span>
                  <span style={{ fontSize: '11px', color: '#8E8E93', fontWeight: 500, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{card.label}</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                  {card.rate ? card.rate : formatCurrency(card.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Yearly bar chart */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
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

          {/* Goal Progress */}
          <div style={{ padding: '16px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Goal Progress
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {goals.filter(g => g.isActive).map((goal) => {
                const pct = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
                return (
                  <div key={goal.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#FAFAFA', borderRadius: '10px', padding: '11px 13px',
                    border: '1px solid #F3F4F6',
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{goal.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{goal.name}</span>
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

          {/* ── Spending by Month (bar chart) ────────────────────────── */}
          <div style={{ padding: '8px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 8px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Spending by Month
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={reportData.monthlySpending} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(74,173,224,0.08)' }} />
                <Bar dataKey="total" fill="#2D9CDB" radius={[4, 4, 0, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Category Breakdown ──────────────────────────────────── */}
          <div style={{ padding: '16px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Category Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedCats.map((cat, i) => {
                const pct      = ((cat.total / catGrand) * 100).toFixed(1);
                const barWidth = (cat.total / catMax) * 100;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* dot + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '140px', flexShrink: 0 }}>
                      <span style={{ fontSize: '18px' }}>{getCategoryEmoji(cat.category)}</span>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cat.category}
                      </span>
                    </div>

                    {/* proportion bar */}
                    <div style={{ flex: 1, height: '7px', background: '#F2F2F7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${barWidth}%`, height: '100%', borderRadius: '4px', background: cat.color, transition: 'width 0.5s ease' }} />
                    </div>

                    {/* amount + pct */}
                    <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '80px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                        {formatCurrency(cat.total)}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8E8E93', marginLeft: '4px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Top Merchants ─────────────────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Top Merchants
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reportData.topMerchants.map((m, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#FAFAFA', borderRadius: '10px', padding: '11px 13px',
                  border: '1px solid #F3F4F6',
                }}>
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
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', margin: 0, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{m.merchant}</p>
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
                          {m.count} visits
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* right: total */}
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                    {formatCurrency(m.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AI Insights ───────────────────────────────────────────── */}
          <div style={{ padding: '20px 16px 4px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', margin: '0 0 10px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              AI Insights
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { emoji: '🍽️', text: 'Food spending is your largest category at 32% of total' },
                { emoji: '🎯', text: 'You stayed within budget in 9 out of 12 months' },
                { emoji: '📊', text: 'Your average monthly savings is 22%' },
              ].map((ins, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  background: '#EFF8FC', border: '1px solid #D6EDF8', borderRadius: '10px', padding: '11px 13px',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, lineHeight: 1.3 }}>{ins.emoji}</span>
                  <span style={{ fontSize: '13px', color: '#1A6B9A', fontWeight: 500, lineHeight: 1.4, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                    {ins.text}
                  </span>
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
              width          : '375px',
              maxWidth       : '100%',
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
