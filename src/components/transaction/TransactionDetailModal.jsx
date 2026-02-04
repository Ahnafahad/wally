/**
 * Wally – Transaction Detail Modal
 *
 * Full-screen modal for viewing and editing existing transactions.
 * Two modes: viewing (read-only) and editing (form mode).
 */

import React, { useState, useEffect } from 'react';
import { useApp }                      from '../../AppContext';
import { X, ChevronLeft, ChevronDown } from '../shared/Icons';
import { suggestCategory }             from '../../utils/calculations';
import { formatDate, formatCurrency, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';

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

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// ─── Component ───────────────────────────────────────────────────────────────
export default function TransactionDetailModal() {
  const { closeModal, editTransaction, selectedTransaction, accounts } = useApp();

  // Guard: no transaction selected
  if (!selectedTransaction) {
    closeModal();
    return null;
  }

  // ── Mode state ──────────────────────────────────────────────────────────────
  const [mode, setMode] = useState('viewing');  // 'viewing' | 'editing'

  // ── Form state (editing mode) ───────────────────────────────────────────────
  const [amount,      setAmount]      = useState(String(selectedTransaction.amount));
  const [merchant,    setMerchant]    = useState(selectedTransaction.merchant);
  const [category,    setCategory]    = useState(selectedTransaction.category);
  const [account,     setAccount]     = useState(selectedTransaction.account);
  const [notes,       setNotes]       = useState(selectedTransaction.notes || '');
  const [showCatPick, setShowCatPick] = useState(false);
  const [showAccPick, setShowAccPick] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when transaction changes
  useEffect(() => {
    setAmount(String(selectedTransaction.amount));
    setMerchant(selectedTransaction.merchant);
    setCategory(selectedTransaction.category);
    setAccount(selectedTransaction.account);
    setNotes(selectedTransaction.notes || '');
    setMode('viewing');
  }, [selectedTransaction]);

  // ── Save handler ──────────────────────────────────────────────────────────
  function handleSave() {
    if (!amount || parseFloat(amount) === 0) return;

    editTransaction(selectedTransaction.id, {
      amount    : parseFloat(amount),
      merchant,
      category,
      account,
      notes,
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeModal();
    }, 800);
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentAccount = accounts.find(a => a.id === account);
  const typeColor = {
    expense : '#FF3B30',
    income  : '#34C759',
    transfer: '#2D9CDB',
  }[selectedTransaction.type] || '#8E8E93';

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
        zIndex: 200,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        maxWidth: '864px',
        margin: '0 auto',
        left: '50%',
        transform: 'translateX(-50%)',
        paddingBottom: '100px',
      }}>

        {/* Success flash */}
        {showSuccess && (
          <div
            style={{
              position       : 'fixed',
              top            : '60px',
              left           : '50%',
              transform      : 'translateX(-50%)',
              zIndex         : 60,
              backgroundColor: '#D4EDDA',
              border         : '1px solid #C3E6CB',
              borderRadius   : '12px',
              padding        : '12px 20px',
              boxShadow      : '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#155724', fontFamily: SF }}>
              ✓ Changes saved!
            </span>
          </div>
        )}

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 10px', flexShrink: 0,
        }}>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <ChevronLeft size={22} color="#2D9CDB" strokeWidth={2.2} />
          </button>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
            {mode === 'viewing' ? selectedTransaction.merchant : 'Edit Transaction'}
          </span>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <X size={22} color="#8E8E93" strokeWidth={2} />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VIEWING MODE
            ══════════════════════════════════════════════════════════════ */}
        {mode === 'viewing' && (
          <>
            {/* Large amount display */}
            <div style={{ textAlign: 'center', padding: '24px 16px 16px' }}>
              <div style={{ fontSize: '36px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY }}>
                {formatCurrency(selectedTransaction.amount)}
              </div>
              {/* Type badge */}
              <div style={{ marginTop: '8px' }}>
                <span style={{
                  display        : 'inline-block',
                  fontSize       : '12px',
                  fontWeight     : 600,
                  color          : typeColor,
                  backgroundColor: typeColor + '1A',
                  borderRadius   : '12px',
                  padding        : '4px 12px',
                  fontFamily     : SF,
                }}>
                  {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Read-only rows */}
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Merchant */}
              <InfoRow label="Merchant" value={selectedTransaction.merchant} />

              {/* Category */}
              <div style={{
                display        : 'flex',
                justifyContent : 'space-between',
                alignItems     : 'center',
                padding        : '12px 14px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                backgroundColor: '#FAFAFA',
              }}>
                <span style={{ fontSize: '13px', color: '#8E8E93', fontFamily: SF }}>
                  Category
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px' }}>{getCategoryEmoji(selectedTransaction.category)}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF }}>
                    {selectedTransaction.category}
                  </span>
                </div>
              </div>

              {/* Account */}
              <div style={{
                display        : 'flex',
                justifyContent : 'space-between',
                alignItems     : 'center',
                padding        : '12px 14px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                backgroundColor: '#FAFAFA',
              }}>
                <span style={{ fontSize: '13px', color: '#8E8E93', fontFamily: SF }}>
                  Account
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: currentAccount?.brandColor || '#8E8E93', display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF }}>
                    {currentAccount?.name || '—'}
                  </span>
                </div>
              </div>

              {/* Date */}
              <InfoRow label="Date" value={formatDate(selectedTransaction.date)} />

              {/* Notes */}
              {selectedTransaction.notes && (
                <div style={{
                  padding        : '12px 14px',
                  borderRadius   : '10px',
                  border         : '1px solid #E8E8E8',
                  backgroundColor: '#FAFAFA',
                }}>
                  <div style={{ fontSize: '13px', color: '#8E8E93', fontFamily: SF, marginBottom: '6px' }}>
                    Notes
                  </div>
                  <div style={{ fontSize: '14px', color: '#1C1C1E', fontFamily: SF, lineHeight: 1.5 }}>
                    {selectedTransaction.notes}
                  </div>
                </div>
              )}
            </div>

            {/* Edit button */}
            <div style={{ padding: '24px 16px 32px', marginTop: 'auto', flexShrink: 0 }}>
              <button
                onClick={() => setMode('editing')}
                style={{
                  width          : '100%',
                  padding        : '15px',
                  borderRadius   : '12px',
                  border         : '2px solid #2D9CDB',
                  background     : 'transparent',
                  color          : '#2D9CDB',
                  fontSize       : '16px',
                  fontWeight     : 600,
                  fontFamily     : SF,
                  cursor         : 'pointer',
                  transition     : 'background 0.15s, color 0.15s',
                }}
              >
                Edit Transaction
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            EDITING MODE
            ══════════════════════════════════════════════════════════════ */}
        {mode === 'editing' && (
          <>
            {/* Form body */}
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Amount */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: SF }}>
                  Amount
                </label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '6px', borderBottom: '2px solid #2D9CDB', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#8E8E93', marginRight: '4px', fontFamily: SF_DISPLAY }}>৳</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{
                      flex: 1, border: 'none', outline: 'none', fontSize: '28px', fontWeight: 700,
                      color: '#1C1C1E', fontFamily: SF_DISPLAY, background: 'transparent',
                    }}
                  />
                </div>
              </div>

              {/* Merchant */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: SF }}>
                  Merchant / Description
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  style={{
                    width: '100%', marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                    borderRadius: '10px', fontSize: '14px', color: '#1C1C1E', outline: 'none',
                    fontFamily: SF, background: '#FAFAFA',
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: SF }}>
                  Category
                </label>
                <button
                  onClick={() => { setShowCatPick(!showCatPick); setShowAccPick(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                    borderRadius: '10px', background: '#FAFAFA', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{getCategoryEmoji(category)}</span>
                  <span style={{ fontSize: '14px', color: '#1C1C1E', fontWeight: 500, flex: 1, textAlign: 'left', fontFamily: SF }}>
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
                        <span style={{ fontSize: '13px', color: '#1C1C1E', fontWeight: c === category ? 600 : 400, fontFamily: SF }}>
                          {c}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: SF }}>
                  Account
                </label>
                <button
                  onClick={() => { setShowAccPick(!showAccPick); setShowCatPick(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                    marginTop: '6px', padding: '10px 12px', border: '1px solid #E8E8E8',
                    borderRadius: '10px', background: '#FAFAFA', cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: currentAccount?.brandColor || '#8E8E93', display: 'inline-block',
                  }} />
                  <span style={{ fontSize: '14px', color: '#1C1C1E', fontWeight: 500, flex: 1, textAlign: 'left', fontFamily: SF }}>
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
                        <span style={{ fontSize: '13px', color: '#1C1C1E', fontWeight: a.id === account ? 600 : 400, flex: 1, textAlign: 'left', fontFamily: SF }}>
                          {a.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#8E8E93', fontFamily: SF }}>
                          {a.accountNumber || '—'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: SF }}>
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
                    fontFamily: SF, background: '#FAFAFA',
                  }}
                />
              </div>
            </div>

            {/* Save button */}
            <div style={{ padding: '20px 16px 32px', flexShrink: 0 }}>
              <button
                onClick={handleSave}
                style={{
                  width: '100%', padding: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  boxShadow: '0 4px 14px rgba(74,173,224,0.40)',
                  fontSize: '16px', fontWeight: 700, color: '#fff',
                  fontFamily: SF_DISPLAY,
                  transition: 'opacity 0.15s',
                }}
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Info row helper (viewing mode) ────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div style={{
      display        : 'flex',
      justifyContent : 'space-between',
      alignItems     : 'center',
      padding        : '12px 14px',
      borderRadius   : '10px',
      border         : '1px solid #E8E8E8',
      backgroundColor: '#FAFAFA',
    }}>
      <span style={{ fontSize: '13px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
        {label}
      </span>
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
        {value}
      </span>
    </div>
  );
}
