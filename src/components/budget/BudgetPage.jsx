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
import { getTotalBudgetLimit, getTotalBudgetSpent } from '../../utils/calculations';

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
  const { isPro, budgets, navigate, addBudget } = useApp();

  // ── Add-budget modal state ───────────────────────────────────────────────
  const [showAdd,      setShowAdd]      = useState(false);
  const [newCategory,  setNewCategory]  = useState(ALL_CATEGORIES[0]);
  const [newLimit,     setNewLimit]     = useState('');
  const [newAlert,     setNewAlert]     = useState('80');
  const [budgetSaved,  setBudgetSaved]  = useState(false);

  // ── Aggregates ────────────────────────────────────────────────────────────
  const totalLimit = getTotalBudgetLimit(budgets);
  const totalSpent = getTotalBudgetSpent(budgets);
  const totalPct   = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const daysLeft   = 24; // 28 days in Feb – 4 elapsed

  const summaryBarColor = totalPct > 90 ? 'var(--red-negative)' : 'var(--white)';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: 'var(--gray-50)', minHeight: '100%', paddingBottom: '100px' }}>

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
          AI SUGGESTION  (Pro only)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPro && (
        <div style={{ padding: '0 24px 20px' }}>
          <div
            style={{
              backgroundColor: 'var(--white)',
              border         : '1px solid var(--gray-200)',
              borderRadius   : 'var(--radius-lg)',
              padding        : '18px',
              boxShadow      : 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {/* W circle */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, var(--cyan-primary), var(--cyan-dark))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <span style={{
                  color: 'var(--white)',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: SF_DISPLAY,
                }}>W</span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--gray-900)',
                fontFamily: SF,
                letterSpacing: '-0.01em',
              }}>
                AI Suggestion
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: 'var(--gray-600)',
              lineHeight: 1.5,
              fontFamily: SF,
              margin: 0,
            }}>
              Consider shifting ৳ 2,000 from Shopping to Education this month. Your shopping habits have steadied, and the education investment will pay off long-term.
            </p>
          </div>
        </div>
      )}

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
                  borderRadius   : 'var(--radius-lg)',
                  border         : '1px solid #F3F4F6',
                  padding        : '16px',
                  boxShadow      : '0 2px 10px rgba(0,0,0,0.02)',
                  transition     : 'all 0.2s ease',
                }}
              >
                {/* Top row: emoji + name + amounts */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                Add Budget
              </span>
              <button
                onClick={() => setShowAdd(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <Icons.X size={20} color="#8E8E93" strokeWidth={2} />
              </button>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
}
