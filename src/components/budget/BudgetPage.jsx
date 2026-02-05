/**
 * Wally – Budget Page
 *
 * Top-level summary card (cyan gradient) with an optional AI suggestion
 * for Pro users, then a scrollable list of per-category budget cards each
 * with colour-coded progress and an over-budget warning when warranted.
 * An "Add Budget" sheet lives at the bottom, controlled by local state.
 */

import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import * as Icons from '../shared/Icons';
import { formatCurrency, formatCompact, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';
import { getTotalBudgetLimit, getTotalBudgetSpent, calculateBudgetTrends, generateBudgetRecommendations, calculateSpendingProjection, applyBudgetTemplate, calculateAverageIncome } from '../../utils/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── Shared micro-styles ─────────────────────────────────────────────────────
const SF        = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// ─── Colour helper ───────────────────────────────────────────────────────────
function barColor(pct) {
  if (pct > 90) return '#FF3B30';
  if (pct > 70) return '#FF9500';
  return '#34C759';
}

// ─── All available categories for the "Add Budget" form ─────────────────────
const ALL_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
];

export default function BudgetPage() {
  const { isPro, budgets, transactions, navigate, addBudget, editBudget, deleteBudget, setPendingCoachPrompt } = useApp();

  // ── Add-budget modal state ───────────────────────────────────────────────
  const [showAdd,      setShowAdd]      = useState(false);
  const [newCategory,  setNewCategory]  = useState(ALL_CATEGORIES[0]);
  const [newLimit,     setNewLimit]     = useState('');
  const [newAlert,     setNewAlert]     = useState('80');
  const [budgetSaved,  setBudgetSaved]  = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // ── Edit-budget modal state ──────────────────────────────────────────────
  const [showEdit,        setShowEdit]        = useState(false);
  const [editingBudget,   setEditingBudget]   = useState(null);
  const [editLimit,       setEditLimit]       = useState('');
  const [editAlert,       setEditAlert]       = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Aggregates ────────────────────────────────────────────────────────────
  const totalLimit = getTotalBudgetLimit(budgets);
  const totalSpent = getTotalBudgetSpent(budgets);
  const totalPct   = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const daysLeft   = 24; // 28 days in Feb – 4 elapsed

  const summaryBarColor = totalPct > 90 ? 'var(--red-negative)' : 'var(--white)';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: 'var(--gray-50)', minHeight: '100%', paddingBottom: '24px' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display        : 'flex',
          justifyContent : 'space-between',
          alignItems     : 'center',
          padding        : '16px 24px',
          background     : 'var(--white)',
          borderBottom   : '1px solid var(--gray-200)',
        }}
      >
        {/* Back arrow */}
        <button
          onClick={() => navigate('dashboard')}
          style={{
            background  : 'none',
            border      : 'none',
            cursor      : 'pointer',
            padding     : '8px',
            minWidth    : '40px',
            minHeight   : '40px',
            display     : 'flex',
            alignItems  : 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            transition  : 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <Icons.ChevronLeft size={24} color="var(--cyan-primary)" strokeWidth={2.2} />
        </button>

        {/* Title */}
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          Budgets
        </span>

        {/* + Add */}
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background  : 'none',
            border      : 'none',
            cursor      : 'pointer',
            padding     : '8px',
            minWidth    : '40px',
            minHeight   : '40px',
            display     : 'flex',
            alignItems  : 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            transition  : 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <span style={{
            fontSize: '14px',
            color: 'var(--cyan-primary)',
            fontWeight: 600,
            fontFamily: SF,
          }}>
            + Add
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUMMARY CARD  (cyan gradient)
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px 24px' }}>
        <div
          style={{
            background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius   : 'var(--radius-xl)',
            padding        : '24px',
            position       : 'relative',
            overflow       : 'hidden',
            boxShadow      : '0 20px 25px -5px rgba(79,172,254,0.25), 0 10px 10px -5px rgba(79,172,254,0.15)',
          }}
        >
          {/* Mesh gradient overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.15), transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Watermark */}
          <div
            style={{
              position      : 'absolute',
              bottom        : '-20px',
              right         : '-12px',
              fontSize      : '120px',
              fontWeight    : 900,
              color         : 'var(--white)',
              opacity       : 0.08,
              lineHeight    : 1,
              fontFamily    : SF_DISPLAY,
              pointerEvents : 'none',
              userSelect    : 'none',
            }}
          >
            W
          </div>

          {/* "February Budget" label */}
          <div style={{
            color: 'var(--white)',
            fontSize: '11px',
            fontWeight: 600,
            opacity: 0.85,
            fontFamily: SF,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 1,
          }}>
            February Budget
          </div>

          {/* Spent amount + limit row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: '12px',
            position: 'relative',
            zIndex: 1,
          }}>
            <div>
              <div style={{
                color: 'var(--white)',
                fontSize: '32px',
                fontWeight: 800,
                fontFamily: SF_DISPLAY,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {formatCurrency(totalSpent)}
              </div>
              <div style={{
                color: 'var(--white)',
                fontSize: '13px',
                opacity: 0.75,
                fontFamily: SF,
                marginTop: '6px',
              }}>
                of {formatCurrency(totalLimit)} limit
              </div>
            </div>

            {/* Percentage */}
            <div style={{
              color: 'var(--white)',
              fontSize: '26px',
              fontWeight: 800,
              fontFamily: SF_DISPLAY,
              letterSpacing: '-0.02em',
            }}>
              {Math.round(totalPct)}%
            </div>
          </div>

          {/* Progress bar – white track at 30 % opacity, fill white or red */}
          <div
            style={{
              height         : '10px',
              backgroundColor: 'rgba(255,255,255,0.25)',
              borderRadius   : 'var(--radius-full)',
              overflow       : 'hidden',
              marginTop      : '16px',
              position       : 'relative',
              zIndex         : 1,
            }}
          >
            <div
              style={{
                height     : '100%',
                width      : `${Math.min(totalPct, 100)}%`,
                background : summaryBarColor,
                borderRadius: 'var(--radius-full)',
                transition : 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow  : totalPct > 90 ? '0 0 12px rgba(255, 59, 48, 0.6)' : 'none',
              }}
            />
          </div>

          {/* Days remaining */}
          <div style={{
            color: 'var(--white)',
            fontSize: '12px',
            opacity: 0.75,
            fontFamily: SF,
            marginTop: '12px',
            position: 'relative',
            zIndex: 1,
          }}>
            {daysLeft} days remaining
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BUDGET TRENDS GRAPH  (Pro only)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPro && (() => {
        const trendsData = calculateBudgetTrends(transactions, budgets, 6);

        if (trendsData.length < 2) return null; // need at least 2 months

        return (
          <div style={{ padding: '0 24px 20px' }}>
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Icons.TrendingUp size={20} color="var(--cyan-primary)" strokeWidth={2} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  fontFamily: SF_DISPLAY,
                  letterSpacing: '-0.01em',
                }}>
                  Spending Trends
                </span>
              </div>

              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-200)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: 'var(--gray-600)', fontFamily: SF }}
                    stroke="var(--gray-300)"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: 'var(--gray-600)', fontFamily: SF }}
                    stroke="var(--gray-300)"
                    tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--white)',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontFamily: SF,
                    }}
                    formatter={(value) => [`৳${value.toLocaleString('en-BD')}`, '']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', fontFamily: SF }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    stroke="#FF9500"
                    strokeWidth={2.5}
                    name="Actual Spending"
                    dot={{ fill: '#FF9500', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="budget"
                    stroke="#2D9CDB"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Budget Limit"
                    dot={{ fill: '#2D9CDB', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          AI BUDGET INSIGHTS  (Pro only)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPro && (() => {
        const recommendations = generateBudgetRecommendations(transactions, budgets, 3);

        // Always show the section, even if no dynamic recommendations
        return (
          <div style={{ padding: '0 24px 20px' }}>
            <div
              style={{
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* Header with logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'var(--white)',
                    border: '2px solid var(--cyan-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                  }}
                >
                  <img
                    src="/assets/logo.png"
                    alt="Wally"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--gray-900)',
                  fontFamily: SF_DISPLAY,
                  letterSpacing: '-0.01em',
                }}>
                  AI Budget Insights
                </span>
              </div>

              {/* Dynamic Recommendations */}
              {recommendations.length > 0 ? (
                recommendations.map((rec, idx) => {
                  const emoji = getCategoryEmoji(rec.category);
                  return (
                    <div key={idx} style={{
                      marginBottom: idx < recommendations.length - 1 ? '14px' : '0',
                      paddingBottom: idx < recommendations.length - 1 ? '14px' : '0',
                      borderBottom: idx < recommendations.length - 1 ? '1px solid var(--gray-200)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <span style={{ fontSize: '20px', marginTop: '1px' }}>
                          {emoji}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={{
                            fontSize: '13px',
                            color: 'var(--gray-700)',
                            lineHeight: 1.5,
                            fontFamily: SF,
                            margin: '0 0 8px',
                          }}>
                            <strong style={{ color: 'var(--gray-900)', fontWeight: 600 }}>{rec.category}:</strong>{' '}
                            {rec.reason}
                            {rec.type !== 'create' && (
                              <span style={{ color: 'var(--gray-900)' }}> → Suggest {formatCurrency(rec.suggested)}</span>
                            )}
                          </p>
                          <button
                            onClick={() => {
                              const prompt = `I see you suggest ${rec.type === 'create' ? 'creating' : 'adjusting'} my ${rec.category} budget to ${formatCurrency(rec.suggested)}. Can you explain why?`;
                              setPendingCoachPrompt(prompt);
                              navigate('coach');
                            }}
                            style={{
                              background: 'rgba(45, 156, 219, 0.08)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '5px 12px',
                              color: 'var(--cyan-primary)',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontFamily: SF,
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(45, 156, 219, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(45, 156, 219, 0.08)';
                            }}
                          >
                            Discuss with Coach
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback: Show static suggestion if no dynamic recommendations
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '20px', marginTop: '1px' }}>🛍️</span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '13px',
                        color: 'var(--gray-700)',
                        lineHeight: 1.5,
                        fontFamily: SF,
                        margin: '0 0 8px',
                      }}>
                        <strong style={{ color: 'var(--gray-900)', fontWeight: 600 }}>Shopping:</strong>{' '}
                        Consider shifting ৳2,000 from Shopping to Education this month. Your shopping habits have steadied, and the education investment will pay off long-term.
                      </p>
                      <button
                        onClick={() => {
                          setPendingCoachPrompt('Why should I shift Shopping to Education?');
                          navigate('coach');
                        }}
                        style={{
                          background: 'rgba(45, 156, 219, 0.08)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 12px',
                          color: 'var(--cyan-primary)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: SF,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(45, 156, 219, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(45, 156, 219, 0.08)';
                        }}
                      >
                        Discuss with Coach
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY LIST
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px 20px' }}>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          Categories
        </span>

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {budgets.map((b) => {
            const pct   = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            const color = barColor(pct);
            const emoji = getCategoryEmoji(b.category);
            const catColor = getCategoryColor(b.category);

            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: 'var(--white)',
                  borderRadius   : '14px',
                  border         : '1px solid #F3F4F6',
                  padding        : '16px',
                  boxShadow      : '0 2px 10px rgba(0,0,0,0.02)',
                  transition     : 'all 0.2s ease',
                  position       : 'relative',
                }}
              >
                {/* Three-dot menu */}
                <button
                  onClick={() => {
                    setEditingBudget(b);
                    setEditLimit(String(b.limit));
                    setEditAlert(String(b.alertThreshold || 80));
                    setShowEdit(true);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontSize: '18px',
                    color: 'var(--gray-400)',
                    minWidth: '32px',
                    minHeight: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--gray-100)';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = 'var(--gray-400)';
                  }}
                >
                  ⋮
                </button>

                {/* Top row: emoji + name + amounts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Category icon circle */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: catColor + '15',
                        border: `1px solid ${catColor}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{emoji}</span>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--gray-900)',
                        fontFamily: SF,
                        letterSpacing: '-0.01em',
                      }}>
                        {b.category}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--gray-500)',
                        fontFamily: SF,
                        marginTop: '2px',
                      }}>
                        {formatCompact(b.spent)} of {formatCompact(b.limit)}
                      </div>
                    </div>
                  </div>

                  {/* Percentage */}
                  <span style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: color,
                    fontFamily: SF_DISPLAY,
                    letterSpacing: '-0.01em',
                  }}>
                    {Math.round(pct)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="progress-track" style={{ marginTop: '12px', height: '6px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width      : `${Math.min(pct, 100)}%`,
                      background : color,
                      boxShadow  : `0 0 8px ${color}40`,
                    }}
                  />
                </div>

                {/* Predictive Alert (Pro only) */}
                {isPro && (() => {
                  const projection = calculateSpendingProjection(b.spent, b.limit);
                  if (!projection) return null;

                  return (
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#FF9500',
                        fontWeight: 600,
                        fontFamily: SF,
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: 'rgba(255, 149, 0, 0.08)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 149, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>⚠️</span>
                      <div style={{ flex: 1 }}>
                        <div>At current rate, you'll exceed this budget by {formatCurrency(projection.overage)} around {projection.overageDate}</div>
                        <button
                          onClick={() => {
                            setEditingBudget(b);
                            setEditLimit(String(projection.projected));
                            setShowEdit(true);
                          }}
                          style={{
                            marginTop: '6px',
                            background: 'rgba(255, 149, 0, 0.15)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            color: '#FF9500',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: SF,
                          }}
                        >
                          Adjust Budget
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Over-90 % warning */}
                {pct > 90 && (
                  <div
                    style={{
                      fontSize   : '12px',
                      color      : 'var(--red-negative)',
                      fontWeight : 600,
                      fontFamily : SF,
                      marginTop  : '10px',
                      display    : 'flex',
                      alignItems : 'center',
                      gap        : '4px',
                    }}
                  >
                    <span>⚠️</span>
                    Warning: {b.category} budget is nearly exhausted.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ADD BUDGET BUTTON
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px 24px' }}>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            width          : '100%',
            padding        : '14px',
            borderRadius   : 'var(--radius-lg)',
            border         : '2px dashed var(--cyan-primary)',
            background     : 'transparent',
            cursor         : 'pointer',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            gap            : '8px',
            minHeight      : '48px',
            transition     : 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(74, 173, 224, 0.05)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Icons.Plus size={20} color="var(--cyan-primary)" strokeWidth={2.5} />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--cyan-primary)',
            fontFamily: SF,
            letterSpacing: '-0.01em',
          }}>
            Add Budget
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ADD BUDGET MODAL  (simple sheet overlay)
          ══════════════════════════════════════════════════════════════════════ */}
      {showAdd && (
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
          onClick={() => setShowAdd(false)}
        >
          {/* Sheet */}
          <div
            style={{
              background     : '#FFFFFF',
              borderRadius   : '20px 20px 0 0',
              padding        : '20px',
              paddingBottom  : 'calc(20px + env(safe-area-inset-bottom, 0px))',
              width          : '375px',
              maxWidth       : '100%',
              maxHeight      : '60vh',
              overflowY      : 'auto',
            }}
            onClick={(e) => e.stopPropagation()}   // don't dismiss on inner click
          >
            {/* Sheet header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
                {showTemplates ? 'Choose Template' : 'Add Budget'}
              </span>
              <button
                onClick={() => {
                  if (showTemplates) {
                    setShowTemplates(false);
                  } else {
                    setShowAdd(false);
                  }
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <Icons.X size={20} color="#8E8E93" strokeWidth={2} />
              </button>
            </div>

            {/* Template selector (Pro only) */}
            {isPro && !showTemplates && (
              <button
                onClick={() => setShowTemplates(true)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px dashed #2D9CDB',
                  background: 'rgba(45, 156, 219, 0.05)',
                  color: '#2D9CDB',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: SF,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Icons.Sparkles size={16} color="#2D9CDB" strokeWidth={2} />
                Use Template
              </button>
            )}

            {/* Template grid */}
            {showTemplates ? (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '16px',
                }}>
                  {[
                    {
                      name: '50-30-20',
                      title: '50-30-20 Rule',
                      desc: 'Balanced approach',
                      recommended: 'Best for beginners',
                      preview: ['Needs: 50%', 'Wants: 30%', 'Savings: 20%'],
                    },
                    {
                      name: 'essential',
                      title: 'Essential Bills',
                      desc: 'Focus on necessities',
                      recommended: 'Best for stability',
                      preview: ['Food: 30%', 'Bills: 15%', 'Transport: 10%'],
                    },
                    {
                      name: 'aggressive',
                      title: 'Aggressive Saver',
                      desc: 'Maximum savings',
                      recommended: 'Best for savers',
                      preview: ['Food: 20%', 'Bills: 12%', 'Save: 55%'],
                    },
                    {
                      name: 'balanced',
                      title: 'Balanced Life',
                      desc: 'Equal distribution',
                      recommended: 'Best for variety',
                      preview: ['8 categories', 'Equal splits', 'All bases covered'],
                    },
                  ].map((template) => (
                    <div
                      key={template.name}
                      onClick={() => {
                        const avgIncome = calculateAverageIncome(transactions, 3);
                        const templateBudgets = applyBudgetTemplate(template.name, avgIncome);

                        // Apply all budgets from template
                        templateBudgets.forEach((tb) => {
                          // Only add if not already exists
                          const exists = budgets.find(b => b.category === tb.category);
                          if (!exists) {
                            addBudget({
                              id: 'budget-template-' + Date.now() + '-' + tb.category,
                              category: tb.category,
                              limit: tb.limit,
                              spent: 0,
                              alertThreshold: 80,
                            });
                          }
                        });

                        setBudgetSaved(true);
                        setTimeout(() => {
                          setBudgetSaved(false);
                          setShowTemplates(false);
                          setShowAdd(false);
                        }, 1200);
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #E5E7EB',
                        background: 'var(--white)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#2D9CDB';
                        e.currentTarget.style.background = 'rgba(45, 156, 219, 0.03)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E7EB';
                        e.currentTarget.style.background = 'var(--white)';
                      }}
                    >
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--gray-900)',
                        fontFamily: SF_DISPLAY,
                        marginBottom: '4px',
                      }}>
                        {template.title}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: 'var(--gray-500)',
                        fontFamily: SF,
                        marginBottom: '8px',
                      }}>
                        {template.desc}
                      </div>
                      <div style={{
                        fontSize: '10px',
                        color: '#2D9CDB',
                        fontWeight: 600,
                        fontFamily: SF,
                        marginBottom: '8px',
                      }}>
                        {template.recommended}
                      </div>
                      {template.preview.map((item, idx) => (
                        <div key={idx} style={{
                          fontSize: '10px',
                          color: 'var(--gray-600)',
                          fontFamily: SF,
                          marginBottom: '2px',
                        }}>
                          • {item}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {budgetSaved && (
                  <div style={{
                    textAlign: 'center',
                    padding: '13px',
                    borderRadius: '12px',
                    background: '#D4EDDA',
                    border: '1px solid #C3E6CB',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#155724', fontFamily: SF }}>
                      Budgets created from template!
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setShowTemplates(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    background: 'var(--white)',
                    color: 'var(--gray-700)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: SF,
                    marginTop: '12px',
                  }}
                >
                  Manual Entry Instead
                </button>
              </div>
            ) : (
              <>
                {/* Category select */}
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                width          : '100%',
                padding        : '10px 12px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                fontSize       : '14px',
                color          : '#1C1C1E',
                fontFamily     : SF,
                backgroundColor: '#FAFAFA',
                appearance     : 'none',
                cursor         : 'pointer',
                marginBottom   : '14px',
              }}
            >
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Monthly limit */}
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
              Monthly Limit (৳)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              style={{
                width          : '100%',
                padding        : '10px 12px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                fontSize       : '14px',
                color          : '#1C1C1E',
                fontFamily     : SF,
                backgroundColor: '#FAFAFA',
                boxSizing      : 'border-box',
                marginBottom   : '14px',
              }}
            />

            {/* Alert threshold */}
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
              Alert at (%)
            </label>
            <input
              type="number"
              min="50"
              max="100"
              value={newAlert}
              onChange={(e) => setNewAlert(e.target.value)}
              style={{
                width          : '100%',
                padding        : '10px 12px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                fontSize       : '14px',
                color          : '#1C1C1E',
                fontFamily     : SF,
                backgroundColor: '#FAFAFA',
                boxSizing      : 'border-box',
                marginBottom   : '20px',
              }}
            />

            {/* Save button / success flash */}
            {budgetSaved ? (
              <div style={{
                textAlign: 'center', padding: '13px', borderRadius: '12px',
                background: '#D4EDDA', border: '1px solid #C3E6CB',
              }}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#155724', fontFamily: SF }}>
                  Budget saved!
                </span>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (newCategory && newLimit) {
                    addBudget({ id: 'budget-new-' + Date.now(), category: newCategory, limit: Number(newLimit), spent: 0, alertThreshold: Number(newAlert) });
                    setBudgetSaved(true);
                    setTimeout(() => { setBudgetSaved(false); setShowAdd(false); }, 800);
                  }
                }}
                style={{
                  width          : '100%',
                  padding        : '14px',
                  borderRadius   : 'var(--radius-md)',
                  border         : 'none',
                  background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  boxShadow      : 'var(--shadow-lg)',
                  color          : 'var(--white)',
                  fontSize       : '15px',
                  fontWeight     : 600,
                  fontFamily     : SF,
                  cursor         : 'pointer',
                  transition     : 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                Save Budget
              </button>
            )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          EDIT BUDGET MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {showEdit && editingBudget && (
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
            if (!showDeleteConfirm) {
              setShowEdit(false);
              setEditingBudget(null);
              setShowDeleteConfirm(false);
            }
          }}
        >
          {/* Sheet */}
          <div
            style={{
              background     : '#FFFFFF',
              borderRadius   : '20px 20px 0 0',
              padding        : '20px',
              paddingBottom  : 'calc(20px + env(safe-area-inset-bottom, 0px))',
              width          : '375px',
              maxWidth       : '100%',
              maxHeight      : '60vh',
              overflowY      : 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Delete Confirmation */}
            {showDeleteConfirm ? (
              <>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#1C1C1E',
                    fontFamily: SF_DISPLAY,
                    margin: '0 0 8px',
                  }}>
                    Delete Budget?
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#8E8E93',
                    fontFamily: SF,
                    margin: '0 0 24px',
                    lineHeight: 1.5,
                  }}>
                    Are you sure you want to delete the {editingBudget.category} budget? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #E8E8E8',
                        background: '#fff',
                        color: '#1C1C1E',
                        fontSize: '15px',
                        fontWeight: 600,
                        fontFamily: SF,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteBudget(editingBudget.id);
                        setShowDeleteConfirm(false);
                        setShowEdit(false);
                        setEditingBudget(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#FF3B30',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 600,
                        fontFamily: SF,
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Sheet header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
                    Edit Budget
                  </span>
                  <button
                    onClick={() => {
                      setShowEdit(false);
                      setEditingBudget(null);
                      setShowDeleteConfirm(false);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Icons.X size={20} color="#8E8E93" strokeWidth={2} />
                  </button>
                </div>

                {/* Category (read-only) */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Category
                </label>
                <div
                  style={{
                    width          : '100%',
                    padding        : '10px 12px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    color          : '#8E8E93',
                    fontFamily     : SF,
                    backgroundColor: '#F5F5F5',
                    marginBottom   : '14px',
                    display        : 'flex',
                    alignItems     : 'center',
                    justifyContent : 'space-between',
                  }}
                >
                  <span>{editingBudget.category}</span>
                  <Icons.Lock size={14} color="#8E8E93" strokeWidth={2} />
                </div>

                {/* Monthly limit */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Monthly Limit (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={editLimit}
                  onChange={(e) => setEditLimit(e.target.value)}
                  style={{
                    width          : '100%',
                    padding        : '10px 12px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    color          : '#1C1C1E',
                    fontFamily     : SF,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '14px',
                  }}
                />

                {/* Alert threshold */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Alert at (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={editAlert}
                  onChange={(e) => setEditAlert(e.target.value)}
                  style={{
                    width          : '100%',
                    padding        : '10px 12px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    color          : '#1C1C1E',
                    fontFamily     : SF,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '20px',
                  }}
                />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      flex           : 1,
                      padding        : '14px',
                      borderRadius   : '12px',
                      border         : 'none',
                      background     : '#FF3B30',
                      color          : '#fff',
                      fontSize       : '15px',
                      fontWeight     : 600,
                      fontFamily     : SF,
                      cursor         : 'pointer',
                      transition     : 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,59,48,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Delete Budget
                  </button>
                  <button
                    onClick={() => {
                      if (editLimit) {
                        editBudget(editingBudget.id, {
                          limit: Number(editLimit),
                          alertThreshold: Number(editAlert),
                        });
                        setShowEdit(false);
                        setEditingBudget(null);
                      }
                    }}
                    style={{
                      flex           : 1,
                      padding        : '14px',
                      borderRadius   : '12px',
                      border         : 'none',
                      background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      boxShadow      : 'var(--shadow-lg)',
                      color          : 'var(--white)',
                      fontSize       : '15px',
                      fontWeight     : 600,
                      fontFamily     : SF,
                      cursor         : 'pointer',
                      transition     : 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
