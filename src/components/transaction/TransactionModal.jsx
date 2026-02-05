/**
 * Wally – Add Transaction Modal
 *
 * Full-screen overlay with Expense / Income / Transfer type toggle,
 * amount input, merchant field with auto-category suggestion,
 * category picker, account picker, date, notes, and save flow.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { X, ChevronDown } from '../shared/Icons';
import { suggestCategory } from '../../utils/calculations';
import { formatDate, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';

// ─── All selectable categories ───────────────────────────────────────────────
const ALL_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Salary',
  'Savings',
  'Cash',
  'Freelance',
];

// ─── CSS injection (spinner keyframes) ───────────────────────────────────────
const SPINNER_CSS = `
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
function injectSpinnerCSS() {
  if (document.getElementById('wally-spinner-css')) return;
  const tag = document.createElement('style');
  tag.id = 'wally-spinner-css';
  tag.textContent = SPINNER_CSS;
  document.head.appendChild(tag);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function TransactionModal() {
  const { closeModal, addTransaction, accounts, pendingTransaction, setPendingTransaction } = useApp();

  // ── form state ─────────────────────────────────────────────────────────────
  const [type, setType] = useState(pendingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(pendingTransaction?.amount?.toString() || '');
  const [merchant, setMerchant] = useState(pendingTransaction?.merchant || '');
  const [category, setCategory] = useState(pendingTransaction?.category || 'Food & Dining');
  const [account, setAccount] = useState(pendingTransaction?.account || accounts[0]?.id || '');
  const [notes, setNotes] = useState('');
  const [showCatPick, setShowCatPick] = useState(false);
  const [showAccPick, setShowAccPick] = useState(false);
  const [savePhase, setSavePhase] = useState(null);   // null | 'categorizing' | 'categorized' | 'done'

  // Clear pendingTransaction after it's been used
  useEffect(() => {
    if (pendingTransaction) {
      setPendingTransaction(null);
    }
  }, []);

  // ── auto-suggest category when merchant changes ───────────────────────────
  const suggested = suggestCategory(merchant);
  useEffect(() => {
    if (suggested) setCategory(suggested);
  }, [suggested]);

  // ── save handler ───────────────────────────────────────────────────────────
  function handleSave() {
    if (!amount || parseFloat(amount) === 0) return;   // guard: need a number

    const txn = {
      id: 'new-' + Date.now(),
      date: '2026-02-04',
      merchant: merchant || 'Unknown',
      amount: parseFloat(amount),
      type,
      category,
      account,
      notes,
    };

    addTransaction(txn);
    injectSpinnerCSS();  // inject CSS animation

    // Multi-phase animation
    setSavePhase('categorizing');
    setTimeout(() => setSavePhase('categorized'), 800);
    setTimeout(() => setSavePhase('done'), 1600);
    setTimeout(() => closeModal(), 2400);
  }

  // ── current account label ──────────────────────────────────────────────────
  const currentAccount = accounts.find(a => a.id === account);

  // ─── JSX ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* dark backdrop */}
      <div
        onClick={closeModal}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.40)', zIndex: 49 }}
      />

      {/* white panel – full-screen inside the frame */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        maxWidth: '864px',
        margin: '0 auto',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
      }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 10px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            Add Transaction
          </span>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <X size={22} color="#8E8E93" strokeWidth={2} />
          </button>
        </div>

        {/* ── Type selector ───────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '6px', padding: '0 16px 16px', flexShrink: 0 }}>
          {['expense', 'income', 'transfer'].map(t => {
            const active = type === t;
            const label = t.charAt(0).toUpperCase() + t.slice(1);
            const colors = { expense: '#FF3B30', income: '#34C759', transfer: '#2D9CDB' };
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                style={{
                  flex: 1, padding: '8px 0', border: 'none', borderRadius: '10px', cursor: 'pointer',
                  background: active ? colors[t] : '#F2F2F7',
                  color: active ? '#fff' : '#8E8E93',
                  fontSize: '13px', fontWeight: 600,
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Form body ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Amount */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Amount
            </label>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px', borderBottom: '2px solid #2D9CDB', paddingBottom: '4px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#8E8E93', marginRight: '4px', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>৳</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  flex: 1, border: 'none', outline: 'none', fontSize: '28px', fontWeight: 700,
                  color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Merchant / Description
            </label>
            <input
              type="text"
              placeholder="Who or what?"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              style={{
                width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                borderRadius: '10px', fontSize: '14px', color: '#1C1C1E', outline: 'none',
                fontFamily: 'SF Pro Text, -apple-system, sans-serif', background: '#fff',
              }}
            />
            {/* auto-suggest pill */}
            {suggested && (
              <button
                onClick={() => setCategory(suggested)}
                style={{
                  marginTop: '6px', background: '#EFF8FC', border: '1px solid #D6EDF8',
                  borderRadius: '14px', padding: '3px 10px', fontSize: '12px', fontWeight: 500,
                  color: '#1A6B9A', cursor: 'pointer', fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}
              >
                Suggested: {suggested}
              </button>
            )}
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Category
            </label>
            <button
              onClick={() => { setShowCatPick(!showCatPick); setShowAccPick(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                borderRadius: '10px', background: '#fff', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '18px' }}>{getCategoryEmoji(category)}</span>
              <span style={{ fontSize: '14px', color: '#1C1C1E', fontWeight: 500, flex: 1, textAlign: 'left', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                {category}
              </span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: getCategoryColor(category), display: 'inline-block' }} />
              <ChevronDown size={16} color="#8E8E93" strokeWidth={2} />
            </button>

            {/* category picker dropdown */}
            {showCatPick && (
              <div style={{
                marginTop: '4px', border: '1px solid #E8E8E8', borderRadius: '10px',
                background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.10)', maxHeight: '200px',
                overflowY: 'auto', zIndex: 2, position: 'relative',
              }} className="scroll-hide">
                {ALL_CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setShowCatPick(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '10px 12px', border: 'none', background: c === category ? '#EFF8FC' : '#fff',
                      cursor: 'pointer', borderBottom: '1px solid #F5F5F7',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{getCategoryEmoji(c)}</span>
                    <span style={{ fontSize: '13px', color: '#1C1C1E', fontWeight: c === category ? 600 : 400, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Account
            </label>
            <button
              onClick={() => { setShowAccPick(!showAccPick); setShowCatPick(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                borderRadius: '10px', background: '#fff', cursor: 'pointer',
              }}
            >
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: currentAccount?.brandColor || '#8E8E93', display: 'inline-block',
              }} />
              <span style={{ fontSize: '14px', color: '#1C1C1E', fontWeight: 500, flex: 1, textAlign: 'left', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                {currentAccount?.name || 'Select account'}
              </span>
              <ChevronDown size={16} color="#8E8E93" strokeWidth={2} />
            </button>

            {/* account picker dropdown */}
            {showAccPick && (
              <div style={{
                marginTop: '4px', border: '1px solid #E8E8E8', borderRadius: '10px',
                background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.10)', maxHeight: '200px',
                overflowY: 'auto', zIndex: 2, position: 'relative',
              }} className="scroll-hide">
                {accounts.map(a => (
                  <button
                    key={a.id}
                    onClick={() => { setAccount(a.id); setShowAccPick(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '10px 12px', border: 'none', background: a.id === account ? '#EFF8FC' : '#fff',
                      cursor: 'pointer', borderBottom: '1px solid #F5F5F7',
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: a.brandColor, display: 'inline-block' }} />
                    <span style={{ fontSize: '13px', color: '#1C1C1E', fontWeight: a.id === account ? 600 : 400, flex: 1, textAlign: 'left', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                      {a.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                      {a.accountNumber || '—'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Date
            </label>
            <div style={{
              marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
              borderRadius: '10px', fontSize: '14px', color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}>
              {formatDate('2026-02-04')}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Notes
            </label>
            <textarea
              placeholder="Add a note..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                borderRadius: '10px', fontSize: '14px', color: '#1C1C1E', outline: 'none', resize: 'none',
                fontFamily: 'SF Pro Text, -apple-system, sans-serif', background: '#fff',
              }}
            />
          </div>
        </div>

        {/* ── Save button / AI categorization phases ──────────────────── */}
        <div style={{ padding: '20px 16px 32px', flexShrink: 0 }}>
          {savePhase === 'categorizing' ? (
            /* Phase 1: Categorizing... with spinner */
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '14px', borderRadius: '12px', background: '#F2F2F7',
            }}>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: '3px solid #E8E8E8', borderTopColor: '#2D9CDB',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                Categorizing…
              </span>
            </div>
          ) : savePhase === 'categorized' ? (
            /* Phase 2: Categorized with confidence */
            <div style={{
              textAlign: 'center', padding: '14px', borderRadius: '12px',
              background: '#D4EDDA', border: '1px solid #C3E6CB',
            }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#155724', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                ✓ Categorized as <strong>{category}</strong> · 95% confidence
              </span>
            </div>
          ) : (
            /* Default: Save button */
            <button
              onClick={handleSave}
              style={{
                width: '100%', padding: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                boxShadow: '0 4px 14px rgba(74,173,224,0.40)',
                fontSize: '16px', fontWeight: 700, color: '#fff',
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                transition: 'opacity 0.15s',
              }}
            >
              Save Transaction
            </button>
          )}
        </div>
      </div>
    </>
  );
}
