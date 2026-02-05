/**
 * Wally – Goals Page
 *
 * Two logical views controlled by local state:
 *   • LIST   – stats row, active goal cards with progress, locked placeholders
 *   • DETAIL – circular SVG progress ring, stat boxes, AI insight,
 *              contribution history, and an "Add Contribution" sheet
 *
 * Data contract: every goal object carries
 *   id, name, emoji, targetAmount, currentAmount, targetDate,
 *   isActive, isLocked?, aiInsight, contributions[]
 */

import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import * as Icons from '../shared/Icons';
import { formatCurrency, formatCompact, formatDate } from '../../utils/formatters';

// ─── Shared micro-styles ─────────────────────────────────────────────────────
const SF        = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// ─── Circular progress constants ─────────────────────────────────────────────
const RING_SIZE   = 140;                            // SVG viewport px
const RING_RADIUS = 56;                             // circle radius
const RING_CIRC   = 2 * Math.PI * RING_RADIUS;     // full circumference

export default function GoalsPage() {
  const { isPro, goals, navigate, addGoalContribution, accounts, selectedGoalId, setSelectedGoalId } = useApp();

  // Pick the goal object when in detail view
  const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;

  // ── Branch to the appropriate view ──────────────────────────────────────
  if (selectedGoal) {
    return (
      <GoalDetail
        goal={selectedGoal}
        onBack={() => setSelectedGoalId(null)}
        addGoalContribution={addGoalContribution}
      />
    );
  }

  return (
    <GoalList
      goals={goals}
      isPro={isPro}
      navigate={navigate}
      onSelect={setSelectedGoalId}
      accounts={accounts}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LIST VIEW
// ══════════════════════════════════════════════════════════════════════════════
function GoalList({ goals, isPro, navigate, onSelect, accounts }) {
  const { addGoal } = useApp();  // wire addGoal from context

  const activeGoals  = goals.filter(g => g.isActive && !g.isLocked);
  const lockedGoals  = goals.filter(g => g.isLocked);
  const totalSaved   = activeGoals.reduce((s, g) => s + g.currentAmount, 0);

  // ── Add Goal modal state ──────────────────────────────────────────────────
  const [showAddGoal,  setShowAddGoal]  = useState(false);
  const [goalName,     setGoalName]     = useState('');
  const [goalEmoji,    setGoalEmoji]    = useState('🎯');
  const [targetAmount, setTargetAmount] = useState('');
  const [description,  setDescription]  = useState('');
  const [showSuccess,  setShowSuccess]  = useState(false);

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
          Goals
        </span>

        {/* "+ Add" visible only for Pro */}
        {isPro ? (
          <button
            onClick={() => setShowAddGoal(true)}
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
        ) : (
          <div style={{ width: '40px' }} />  /* spacer to keep title centred */
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS ROW  –  two small cards
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Active count */}
          <StatCard label="Active Goals" value={String(activeGoals.length)} accent="var(--cyan-primary)" />
          {/* Total saved */}
          <StatCard label="Total Saved" value={formatCompact(totalSaved)} accent="var(--green-positive)" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          GOAL CARDS  (active)
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px 20px', marginTop: '20px' }}>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          Active
        </span>

        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeGoals.map((goal) => {
            const pct = goal.targetAmount > 0
              ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
              : 0;

            // Find linked account
            const linkedAccount = goal.accountId ? accounts.find(acc => acc.id === goal.accountId) : null;

            return (
              <button
                key={goal.id}
                onClick={() => onSelect(goal.id)}
                style={{
                  display        : 'flex',
                  alignItems     : 'center',
                  gap            : '12px',
                  padding        : '16px',
                  borderRadius   : '14px',
                  border         : '1px solid #F3F4F6',
                  backgroundColor: 'var(--white)',
                  cursor         : 'pointer',
                  width          : '100%',
                  textAlign      : 'left',
                  boxShadow      : '0 2px 10px rgba(0,0,0,0.02)',
                  transition     : 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                {/* Emoji circle */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, rgba(74, 173, 224, 0.1), rgba(74, 173, 224, 0.05))',
                    border: '1px solid rgba(74, 173, 224, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '24px',
                  }}
                >
                  {goal.emoji}
                </div>

                {/* Text block */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: 'var(--gray-900)',
                      fontFamily: SF,
                      letterSpacing: '-0.01em',
                    }}>
                      {goal.name}
                    </span>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--cyan-primary)',
                      fontFamily: SF_DISPLAY,
                      letterSpacing: '-0.01em',
                    }}>
                      {Math.round(pct)}%
                    </span>
                  </div>

                  {/* Target date */}
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--gray-500)',
                    fontFamily: SF,
                    marginTop: '4px',
                  }}>
                    Target: {goal.targetDate ? formatDate(goal.targetDate) : '—'}
                  </div>

                  {/* Progress bar */}
                  <div className="progress-track" style={{ marginTop: '10px', height: '6px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--cyan-primary), var(--cyan-light))',
                        boxShadow: '0 0 8px rgba(74, 173, 224, 0.3)',
                      }}
                    />
                  </div>

                  {/* Linked Account Info */}
                  {linkedAccount && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('account', { account: linkedAccount });
                      }}
                      style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        color: 'var(--gray-500)',
                        fontFamily: SF,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--cyan-primary)';
                        e.currentTarget.style.textDecoration = 'underline';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--gray-500)';
                        e.currentTarget.style.textDecoration = 'none';
                      }}
                    >
                      Account: {linkedAccount.name} • {formatCurrency(linkedAccount.balance)}
                    </button>
                  )}
                </div>

                {/* Chevron */}
                <Icons.ChevronRight size={20} color="var(--gray-400)" strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          LOCKED GOALS  (free tier)
          ══════════════════════════════════════════════════════════════════════ */}
      {lockedGoals.length > 0 && (
        <div style={{ padding: '0 24px 20px', marginTop: '20px' }}>
          <span style={{
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--gray-900)',
            fontFamily: SF_DISPLAY,
            letterSpacing: '-0.02em',
          }}>
            Locked
          </span>

          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lockedGoals.map((goal) => (
              <div
                key={goal.id}
                style={{
                  display        : 'flex',
                  alignItems     : 'center',
                  gap            : '12px',
                  padding        : '14px',
                  borderRadius   : '14px',
                  border         : '2px dashed #E8E8E8',
                  backgroundColor: '#FAFAFA',
                }}
              >
                {/* Emoji circle (muted) */}
                <div
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: '#F0F0F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '20px', opacity: 0.5,
                  }}
                >
                  {goal.emoji}
                </div>

                {/* Text + lock */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#8E8E93', fontFamily: SF }}>
                      {goal.name}
                    </span>
                    <Icons.Lock size={14} color="#C7C7CC" strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#C7C7CC', fontFamily: SF, marginTop: '3px' }}>
                    Upgrade to Pro to unlock unlimited goals
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacer */}
      <div style={{ height: '28px' }} />

      {/* ══════════════════════════════════════════════════════════════════════
          ADD GOAL MODAL (Pro only)
          ══════════════════════════════════════════════════════════════════════ */}
      {showAddGoal && (
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
            if (!showSuccess) {
              setShowAddGoal(false);
              setGoalName('');
              setTargetAmount('');
              setDescription('');
              setGoalEmoji('🎯');
            }
          }}
        >
          <div
            style={{
              background     : '#FFFFFF',
              borderRadius   : '20px 20px 0 0',
              padding        : '20px',
              paddingBottom  : 'calc(20px + env(safe-area-inset-bottom, 0px))',
              width          : '375px',
              maxWidth       : '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success flash */}
            {showSuccess ? (
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
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#155724', fontFamily: SF_DISPLAY }}>
                  Goal created!
                </span>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
                    New Goal
                  </span>
                  <button
                    onClick={() => {
                      setShowAddGoal(false);
                      setGoalName('');
                      setTargetAmount('');
                      setDescription('');
                      setGoalEmoji('🎯');
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Icons.X size={20} color="#8E8E93" strokeWidth={2} />
                  </button>
                </div>

                {/* Emoji picker row */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '8px' }}>
                  Choose Icon
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {['🎯', '🛡️', '💻', '✈️', '🏠', '🎓', '💍', '🌴', '📱'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setGoalEmoji(emoji)}
                      style={{
                        width          : '42px',
                        height         : '42px',
                        borderRadius   : '12px',
                        border         : goalEmoji === emoji ? '2px solid #2D9CDB' : '1px solid #E8E8E8',
                        backgroundColor: goalEmoji === emoji ? '#eef8fc' : '#FAFAFA',
                        cursor         : 'pointer',
                        fontSize       : '22px',
                        display        : 'flex',
                        alignItems     : 'center',
                        justifyContent : 'center',
                        transition     : 'all 0.15s',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Goal Name */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Buy iPhone"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  style={{
                    width          : '100%',
                    padding        : '12px 14px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    fontWeight     : 500,
                    color          : '#1C1C1E',
                    fontFamily     : SF,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '16px',
                  }}
                />

                {/* Target Amount */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Target Amount (৳)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 85000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  style={{
                    width          : '100%',
                    padding        : '12px 14px',
                    borderRadius   : '12px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '18px',
                    fontWeight     : 600,
                    color          : '#1C1C1E',
                    fontFamily     : SF_DISPLAY,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '12px',
                  }}
                />

                {/* Quick-amount pills */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {[50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTargetAmount(String(amt))}
                      style={{
                        flex           : 1,
                        padding        : '8px 0',
                        borderRadius   : '8px',
                        border         : '1px solid #E8E8E8',
                        background     : '#FAFAFA',
                        cursor         : 'pointer',
                        fontSize       : '12px',
                        fontWeight     : 600,
                        color          : '#4A4A4A',
                        fontFamily     : SF,
                      }}
                    >
                      ৳{amt >= 100000 ? `${amt / 100000}L` : `${amt / 1000}k`}
                    </button>
                  ))}
                </div>

                {/* Target Date */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Target Date
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
                    fontFamily     : SF,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '16px',
                  }}
                >
                  Jun 30, 2026
                </div>

                {/* Description */}
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
                  Description (optional)
                </label>
                <textarea
                  placeholder="Add details about this goal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{
                    width          : '100%',
                    padding        : '12px 14px',
                    borderRadius   : '10px',
                    border         : '1px solid #E8E8E8',
                    fontSize       : '14px',
                    color          : '#1C1C1E',
                    fontFamily     : SF,
                    backgroundColor: '#FAFAFA',
                    boxSizing      : 'border-box',
                    marginBottom   : '20px',
                    resize         : 'none',
                  }}
                />

                {/* Save button */}
                <button
                  onClick={() => {
                    if (goalName && targetAmount) {
                      addGoal({
                        name: goalName,
                        emoji: goalEmoji,
                        targetAmount: Number(targetAmount),
                        currentAmount: 0,
                        startDate: '2026-02-04',
                        targetDate: '2026-06-30',
                        monthlyContribution: 0,
                        isActive: true,
                        aiInsight: 'New goal! Stay consistent to reach your target.',
                        contributions: [],
                      });
                      setShowSuccess(true);
                      setTimeout(() => {
                        setShowSuccess(false);
                        setShowAddGoal(false);
                        setGoalName('');
                        setTargetAmount('');
                        setDescription('');
                        setGoalEmoji('🎯');
                      }, 800);
                    }
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
                    fontFamily     : SF,
                    cursor         : 'pointer',
                  }}
                >
                  Save Goal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small stat card helper ────────────────────────────────────────────────────
function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        flex           : 1,
        backgroundColor: 'var(--white)',
        borderRadius   : 'var(--radius-lg)',
        padding        : '16px',
        border         : '1px solid #F3F4F6',
        boxShadow      : '0 2px 10px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{
        fontSize: '11px',
        color: 'var(--gray-500)',
        fontFamily: SF,
        marginBottom: '6px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: 800,
        color: accent,
        fontFamily: SF_DISPLAY,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Confetti-dot layer (celebration) ────────────────────────────────────────
function ConfettiDots() {
  const dots = [
    { left: '8%',  top: '12%', color: '#FFD700', size: 10, delay: '0s'   },
    { left: '82%', top: '8%',  color: '#FF6B6B', size: 7,  delay: '0.3s' },
    { left: '15%', top: '60%', color: '#2D9CDB', size: 12, delay: '0.6s' },
    { left: '75%', top: '55%', color: '#34C759', size: 8,  delay: '0.9s' },
    { left: '50%', top: '18%', color: '#AF52DE', size: 6,  delay: '0.2s' },
    { left: '5%',  top: '40%', color: '#FF9500', size: 9,  delay: '0.5s' },
    { left: '90%', top: '35%', color: '#64D2FF', size: 11, delay: '0.8s' },
    { left: '30%', top: '75%', color: '#FFD700', size: 7,  delay: '1.0s' },
    { left: '65%', top: '80%', color: '#FF375F', size: 10, delay: '0.4s' },
    { left: '45%', top: '70%', color: '#2D9CDB', size: 8,  delay: '0.7s' },
    { left: '22%', top: '30%', color: '#34C759', size: 6,  delay: '1.1s' },
    { left: '88%', top: '68%', color: '#AF52DE', size: 9,  delay: '0.1s' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left, top: d.top,
          width: d.size, height: d.size, borderRadius: '50%',
          background: d.color, opacity: 0.7,
          animation: `confettiFall 3s ease-in-out ${d.delay} infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── CSS injection (confetti keyframes) ──────────────────────────────────────
const CONFETTI_CSS = `
@keyframes confettiFall {
  0%   { transform: translateY(0) rotate(0deg);   opacity: 0.7; }
  100% { transform: translateY(30px) rotate(180deg); opacity: 0.3; }
}
`;
function injectConfettiCSS() {
  if (document.getElementById('wally-confetti-css')) return;
  const tag = document.createElement('style');
  tag.id = 'wally-confetti-css';
  tag.textContent = CONFETTI_CSS;
  document.head.appendChild(tag);
}

// ══════════════════════════════════════════════════════════════════════════════
// DETAIL VIEW
// ══════════════════════════════════════════════════════════════════════════════
function GoalDetail({ goal, onBack, addGoalContribution }) {
  const { isPro, navigate, setPendingCoachPrompt } = useApp();

  // ── Add-contribution modal state ─────────────────────────────────────────
  const [showContrib,      setShowContrib]      = useState(false);
  const [contribAmt,       setContribAmt]       = useState('');
  const [showCelebration,  setShowCelebration]  = useState(false);

  // ── Derived ───────────────────────────────────────────────────────────────
  const pct       = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

  // SVG ring: dashoffset = circumference * (1 - fraction)
  const offset = RING_CIRC * (1 - pct / 100);

  // Last 6 contributions, most recent first
  const recentContribs = [...(goal.contributions || [])].reverse().slice(0, 6);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: 'var(--gray-50)', minHeight: '100%', paddingBottom: '100px' }}>

      {/* ════════════════════════════════════════════════════════════════════
          HEADER
          ════════════════════════════════════════════════════════════════════ */}
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
        <button
          onClick={onBack}
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

        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          {goal.emoji} {goal.name}
        </span>

        {/* Right spacer */}
        <div style={{ width: '40px' }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CIRCULAR PROGRESS RING
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
        <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
          {/* Background ring */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="12"
          />
          {/* Foreground ring */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="#2D9CDB"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={RING_CIRC}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
          {/* Centre text – percentage */}
          <text
            x={RING_SIZE / 2}
            y={RING_SIZE / 2 - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1C1C1E"
            fontSize="22"
            fontWeight="700"
            fontFamily={SF_DISPLAY}
          >
            {Math.round(pct)}%
          </text>
          {/* Centre text – label */}
          <text
            x={RING_SIZE / 2}
            y={RING_SIZE / 2 + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8E8E93"
            fontSize="11"
            fontFamily={SF}
          >
            Complete
          </text>
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          THREE STAT BOXES  –  Saved | Target | Remaining
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px', marginTop: '20px', display: 'flex', gap: '10px' }}>
        <DetailStatBox label="Saved"     value={formatCompact(goal.currentAmount)} color="var(--cyan-primary)" />
        <DetailStatBox label="Target"    value={formatCompact(goal.targetAmount)}  color="var(--gray-900)" />
        <DetailStatBox label="Remaining" value={formatCompact(remaining)}          color="var(--orange-warn)" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          AI INSIGHT CARD
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '16px' }}>
        <div
          style={{
            backgroundColor: '#eef8fc',
            border         : '1px solid #c8e6f2',
            borderRadius   : '14px',
            padding        : '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <div
              style={{
                width: '20px', height: '20px', borderRadius: '50%',
                backgroundColor: '#2D9CDB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontSize: '9px', fontWeight: 700, fontFamily: SF_DISPLAY }}>W</span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF }}>
              AI Insight
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#4A4A4A', lineHeight: 1.5, fontFamily: SF, margin: isPro ? '0 0 10px' : 0 }}>
            {goal.aiInsight}
          </p>
          {isPro && (
            <button
              onClick={() => { setPendingCoachPrompt('Help me optimize my goal contributions'); navigate('coach'); }}
              style={{
                background: 'rgba(45, 156, 219, 0.08)',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 10px',
                color: '#2D9CDB',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: SF,
              }}
            >
              Ask AI →
            </button>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TARGET DATE
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '16px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: '#F9F9F9', borderRadius: '14px', padding: '12px 14px',
            border: '1px solid #F0F0F0',
          }}
        >
          <span style={{ fontSize: '13px', color: '#8E8E93', fontFamily: SF }}>
            Target Date
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF }}>
            {goal.targetDate ? formatDate(goal.targetDate) : '—'}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CONTRIBUTION HISTORY  (last 6, reversed)
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '18px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
          Contributions
        </span>

        <div style={{ marginTop: '8px' }}>
          {recentContribs.length === 0 && (
            <div style={{ fontSize: '13px', color: '#8E8E93', fontFamily: SF, padding: '10px 0' }}>
              No contributions yet.
            </div>
          )}

          {recentContribs.map((c, idx) => (
            <div
              key={idx}
              style={{
                display       : 'flex',
                justifyContent: 'space-between',
                alignItems    : 'center',
                paddingTop    : '10px',
                paddingBottom : '10px',
                borderBottom  : idx < recentContribs.length - 1 ? '1px solid #F0F0F0' : 'none',
              }}
            >
              {/* Date + icon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: '#eef8fc',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icons.ArrowUp size={16} color="#2D9CDB" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1C1C1E', fontFamily: SF }}>
                    Contribution
                  </div>
                  <div style={{ fontSize: '11px', color: '#8E8E93', fontFamily: SF, marginTop: '1px' }}>
                    {formatDate(c.date)}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#34C759', fontFamily: SF }}>
                +{formatCurrency(c.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ADD CONTRIBUTION BUTTON
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '20px', paddingBottom: '28px' }}>
        <button
          onClick={() => setShowContrib(true)}
          style={{
            width          : '100%',
            padding        : '14px',
            borderRadius   : '14px',
            border         : 'none',
            background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color          : '#FFFFFF',
            fontSize       : '15px',
            fontWeight     : 600,
            fontFamily     : SF,
            cursor         : 'pointer',
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            gap            : '6px',
          }}
        >
          <Icons.Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
          Add Contribution
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          ADD CONTRIBUTION MODAL
          ════════════════════════════════════════════════════════════════════ */}
      {showContrib && (
        <div
          style={{
            position       : 'fixed',
            inset          : 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex         : 100,
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
          }}
          onClick={() => setShowContrib(false)}
        >
          <div
            style={{
              background     : '#FFFFFF',
              borderRadius   : '16px',
              padding        : '20px',
              width          : '375px',
              maxWidth       : '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
                Add Contribution
              </span>
              <button
                onClick={() => setShowContrib(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
              >
                <Icons.X size={20} color="#8E8E93" strokeWidth={2} />
              </button>
            </div>

            {/* Goal name badge */}
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                backgroundColor: '#eef8fc', borderRadius: '20px',
                padding: '4px 10px', marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '14px' }}>{goal.emoji}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#2D9CDB', fontFamily: SF }}>
                {goal.name}
              </span>
            </div>

            {/* Amount input */}
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
              Amount (৳)
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={contribAmt}
              onChange={(e) => setContribAmt(e.target.value)}
              style={{
                width          : '100%',
                padding        : '12px 14px',
                borderRadius   : '12px',
                border         : '1px solid #E8E8E8',
                fontSize       : '18px',
                fontWeight     : 600,
                color          : '#1C1C1E',
                fontFamily     : SF_DISPLAY,
                backgroundColor: '#FAFAFA',
                boxSizing      : 'border-box',
                marginBottom   : '20px',
              }}
            />

            {/* Quick-amount pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1000, 2500, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setContribAmt(String(amt))}
                  style={{
                    flex           : 1,
                    padding        : '8px 0',
                    borderRadius   : '8px',
                    border         : '1px solid #E8E8E8',
                    background     : '#FAFAFA',
                    cursor         : 'pointer',
                    fontSize       : '12px',
                    fontWeight     : 600,
                    color          : '#4A4A4A',
                    fontFamily     : SF,
                  }}
                >
                  {amt >= 1000 ? `৳${amt / 1000}k` : `৳${amt}`}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button
              onClick={() => {
                const val = Number(contribAmt);
                if (val > 0) {
                  addGoalContribution(goal.id, val);
                  // Check if goal will be complete after this contribution
                  const newAmount = goal.currentAmount + val;
                  if (newAmount >= goal.targetAmount) {
                    injectConfettiCSS();  // inject CSS animation
                    setShowCelebration(true);
                  }
                }
                setContribAmt('');
                setShowContrib(false);
              }}
              style={{
                width          : '100%',
                padding        : '14px',
                borderRadius   : '12px',
                border         : 'none',
                background     : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color          : '#FFFFFF',
                fontSize       : '15px',
                fontWeight     : 600,
                fontFamily     : SF,
                cursor         : 'pointer',
              }}
            >
              Contribute
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          GOAL COMPLETION CELEBRATION
          ════════════════════════════════════════════════════════════════════ */}
      {showCelebration && (
        <div
          style={{
            position       : 'fixed',
            inset          : 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex         : 200,
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
          }}
        >
          {/* Confetti animation */}
          <ConfettiDots />

          {/* Celebration card */}
          <div
            style={{
              background   : '#FFFFFF',
              borderRadius : '24px',
              padding      : '32px',
              maxWidth     : '320px',
              width        : '90%',
              textAlign    : 'center',
              position     : 'relative',
              zIndex       : 1,
            }}
          >
            {/* Large emoji */}
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>
              {goal.emoji}
            </div>

            {/* Congratulations heading */}
            <h2 style={{
              fontSize   : '28px',
              fontWeight : 700,
              color      : '#1C1C1E',
              fontFamily : SF_DISPLAY,
              margin     : '0 0 8px',
            }}>
              Congratulations!
            </h2>

            {/* Goal name */}
            <p style={{
              fontSize   : '16px',
              fontWeight : 600,
              color      : '#2D9CDB',
              fontFamily : SF,
              margin     : '0 0 8px',
            }}>
              {goal.name}
            </p>

            {/* Success message */}
            <p style={{
              fontSize   : '14px',
              fontWeight : 300,
              color      : '#4A4A4A',
              fontFamily : SF,
              margin     : '0 0 24px',
              lineHeight : 1.5,
            }}>
              You've reached your goal!
            </p>

            {/* Back to Goals button */}
            <button
              onClick={() => {
                setShowCelebration(false);
                onBack();
              }}
              style={{
                width          : '100%',
                padding        : '14px',
                borderRadius   : '12px',
                border         : '2px solid #2D9CDB',
                background     : 'transparent',
                color          : '#2D9CDB',
                fontSize       : '15px',
                fontWeight     : 600,
                fontFamily     : SF,
                cursor         : 'pointer',
                transition     : 'all 0.15s',
              }}
            >
              Back to Goals
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Detail stat box ───────────────────────────────────────────────────────────
function DetailStatBox({ label, value, color }) {
  return (
    <div
      style={{
        flex           : 1,
        textAlign      : 'center',
        backgroundColor: 'var(--white)',
        borderRadius   : 'var(--radius-lg)',
        padding        : '14px 8px',
        border         : '1px solid var(--gray-200)',
        boxShadow      : 'var(--shadow-card)',
      }}
    >
      <div style={{
        fontSize: '10px',
        color: 'var(--gray-500)',
        fontFamily: SF,
        marginBottom: '6px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: '16px',
        fontWeight: 700,
        color: color,
        fontFamily: SF_DISPLAY,
        letterSpacing: '-0.01em',
      }}>
        {value}
      </div>
    </div>
  );
}
