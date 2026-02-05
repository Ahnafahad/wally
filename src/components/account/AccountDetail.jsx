/**
 * Wally – Account Detail / All-Accounts list
 *
 * When selectedAccount is null → scrollable card list of every account.
 * When selectedAccount is set  → single-account detail with balance card,
 * credit-card metrics (if applicable), search, and filtered transaction list.
 */

import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, Search, CreditCard, Wallet, CloudDone }
  from '../shared/Icons';
import { MerchantLogo } from '../shared/WallyLogo';
import { formatCurrency, formatDate, formatRelative, getCategoryColor, getCategoryEmoji }
  from '../../utils/formatters';
import { getRecentTransactions } from '../../utils/calculations';
import { BRAND_DOMAINS } from '../../utils/brandMapping';

// ─── icon helper ──────────────────────────────────────────────────────────────
function accountIcon(type, color) {
  const sz = { size: 20, color, strokeWidth: 1.8 };
  if (type === 'credit_card') return <CreditCard {...sz} />;
  if (type === 'cash') return <Wallet     {...sz} />;
  return <Wallet     {...sz} />;
}

// ─── card network helper ──────────────────────────────────────────────────────
function getCardDisplayName(name) {
  if (!name) return null;

  // First check if there's a specific mapping for this exact card name
  if (BRAND_DOMAINS[name]) {
    return name; // Use full name if specific mapping exists
  }

  // Otherwise, try to extract the card network
  const lower = name.toLowerCase();
  if (lower.includes('visa')) return 'Visa';
  if (lower.includes('mastercard')) return 'Mastercard';
  if (lower.includes('amex')) return 'Amex';

  // Fall back to full name
  return name;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function AccountDetail() {
  const { selectedAccount, accounts, transactions, navigate, isPro, setSelectedTransaction, openModal } = useApp();

  // ─── ALL ACCOUNTS VIEW ───────────────────────────────────────────────────
  if (!selectedAccount) {
    return (
      <div style={{ background: 'var(--gray-50)', minHeight: '100%', paddingBottom: '100px' }}>

        {/* header */}
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
            My Accounts
          </span>
          <div style={{ width: '40px' }} />
        </div>

        {/* Link Account button */}
        <div style={{ padding: '16px 24px 0' }}>
          <button
            onClick={() => navigate('linkAccount')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--cyan-primary)',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
              cursor: 'pointer',
              padding: '8px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: 'var(--radius-md)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(74, 173, 224, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            + Link Account
          </button>
        </div>

        {/* account cards */}
        <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => navigate('account', { account: acc })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '16px',
                border: '1px solid #F3F4F6',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--white)',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
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
              {/* brand circle */}
              <div style={{ pointerEvents: 'none' }}>
                <MerchantLogo
                  merchant={acc.type === 'credit_card' ? getCardDisplayName(acc.name) : (acc.institution || acc.name)}
                  size={48}
                  fallbackIcon={
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: acc.brandColor + '15',
                      border: `1px solid ${acc.brandColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {accountIcon(acc.type, acc.brandColor)}
                    </div>
                  }
                />
              </div>

              {/* name + institution + sync */}
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--gray-900)',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {acc.name}
                </p>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  color: 'var(--gray-500)',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  {acc.institution}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <CloudDone size={12} color="var(--green-positive)" strokeWidth={2} />
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--green-positive)',
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    fontWeight: 500,
                  }}>
                    Synced {acc.lastSynced}
                  </span>
                </div>
              </div>

              {/* balance + masked number */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 700,
                  color: acc.balance < 0 ? 'var(--red-negative)' : 'var(--gray-900)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  letterSpacing: '-0.01em',
                }}>
                  {formatCurrency(acc.balance)}
                </p>
                {acc.accountNumber && (
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '11px',
                    color: 'var(--gray-400)',
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                  }}>
                    {acc.accountNumber}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── SINGLE ACCOUNT DETAIL ─────────────────────────────────────────────
  return <SingleAccountView account={selectedAccount} transactions={transactions} navigate={navigate} isPro={isPro} />;
}

// ─── Single account detail sub-component ────────────────────────────────────
function SingleAccountView({ account, transactions, navigate, isPro }) {
  const { updateAccountBalance, setPendingTransaction, openModal, getAccountCommitments } = useApp();
  const [searchQ, setSearchQ] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const isCreditCard = account.type === 'credit_card';
  const isCash = account.type === 'cash';

  // filter transactions to this account, then sort by date desc
  const accountTxns = getRecentTransactions(
    transactions.filter(t => t.account === account.id),
    50
  );

  // apply search filter
  const filtered = searchQ
    ? accountTxns.filter(t =>
      t.merchant.toLowerCase().includes(searchQ.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQ.toLowerCase())
    )
    : accountTxns;

  // credit card metrics
  const utilization = isCreditCard && account.creditLimit
    ? ((account.statementBalance / account.creditLimit) * 100).toFixed(1)
    : null;
  const availableCredit = isCreditCard && account.creditLimit
    ? account.creditLimit - account.statementBalance
    : null;

  function handlePayNow() {
    setPaySuccess(true);
    setTimeout(() => setPaySuccess(false), 1800);
  }

  function handleRecordDifference() {
    const targetBalance = parseFloat(newBalance);
    if (isNaN(targetBalance)) return;

    const diff = targetBalance - account.balance;
    const isIncome = diff > 0;
    const amount = Math.abs(diff);

    // Update account balance
    updateAccountBalance(account.id, targetBalance);

    // Set pending transaction for modal pre-fill
    setPendingTransaction({
      type: isIncome ? 'income' : 'expense',
      amount: amount,
      merchant: 'Cash Adjustment',
      category: isIncome ? 'Income' : 'Other',
      account: account.id,
    });

    // Close adjust UI and open transaction modal
    setShowAdjust(false);
    setNewBalance('');
    openModal('transaction');
  }

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100%', paddingBottom: '100px' }}>

      {/* header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
      }}>
        <button
          onClick={() => navigate('account', { account: null })}
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
          {account.name}
        </span>
        <div style={{ width: '40px' }} />
      </div>

      {/* balance card */}
      <div style={{
        margin: '20px 24px',
        padding: '24px',
        borderRadius: 'var(--radius-xl)',
        background: `linear-gradient(135deg, ${account.brandColor || '#4facfe'} 0%, ${account.brandColor || '#00f2fe'}dd 100%)`,
        color: 'var(--white)',
        boxShadow: '0 20px 25px -5px rgba(79,172,254,0.25), 0 10px 10px -5px rgba(79,172,254,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
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

        <p style={{
          margin: 0,
          fontSize: '11px',
          fontWeight: 600,
          opacity: 0.85,
          fontFamily: 'SF Pro Text, -apple-system, sans-serif',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}>
          {isCreditCard ? 'Statement Balance' : 'Balance'}
        </p>
        <p style={{
          margin: '8px 0 0',
          fontSize: '34px',
          fontWeight: 800,
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          position: 'relative',
          zIndex: 1,
        }}>
          {isCreditCard ? formatCurrency(account.statementBalance) : formatCurrency(account.balance)}
        </p>
        {account.accountNumber && (
          <p style={{
            margin: '10px 0 0',
            fontSize: '13px',
            opacity: 0.75,
            letterSpacing: '0.12em',
            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            position: 'relative',
            zIndex: 1,
          }}>
            {account.accountNumber}
          </p>
        )}
      </div>

      {/* cash adjustment UI */}
      {isCash && (
        <div style={{ margin: '0 24px 12px' }}>
          {!showAdjust ? (
            <button
              onClick={() => setShowAdjust(true)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #E8E8E8',
                background: '#FAFAFA',
                color: '#2D9CDB',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F0F0F3'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#FAFAFA'}
            >
              Adjust Balance
            </button>
          ) : (
            <div style={{
              background: '#fff',
              border: '1px solid #E8E8E8',
              borderRadius: '10px',
              padding: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
              <label style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#8E8E93',
                fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                display: 'block',
                marginBottom: '6px',
              }}>
                New Balance
              </label>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#8E8E93',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  ৳
                </span>
                <input
                  type="text"
                  placeholder="0"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 32px',
                    borderRadius: '8px',
                    border: '1px solid #E8E8E8',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1C1C1E',
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    backgroundColor: '#FAFAFA',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setShowAdjust(false);
                    setNewBalance('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #E8E8E8',
                    background: '#fff',
                    color: '#8E8E93',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecordDifference}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#2D9CDB',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    cursor: 'pointer',
                  }}
                >
                  Record Difference
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* credit card metrics */}
      {isCreditCard && (
        <div style={{ margin: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* grid row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Credit Limit', value: formatCurrency(account.creditLimit) },
              { label: 'Available Credit', value: formatCurrency(availableCredit) },
              { label: 'Utilization', value: utilization + '%' },
              { label: 'Payment Due', value: account.paymentDueDate ? formatDate(account.paymentDueDate) : '—' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#FAFAFA', border: '1px solid #F0F0F3', borderRadius: '10px',
                padding: '10px 12px',
              }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>{item.label}</p>
                <p style={{ margin: '3px 0 0', fontSize: '14px', fontWeight: 600, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* min payment + Pay Now */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FFF5F5', border: '1px solid #FFD6D6', borderRadius: '10px', padding: '10px 14px',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#FF3B30', fontWeight: 500, fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                Min Payment Due
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: 700, color: '#FF3B30', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                {formatCurrency(account.minPaymentDue)}
              </p>
            </div>
            {paySuccess ? (
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#34C759', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                Payment sent!
              </span>
            ) : (
              <button
                onClick={handlePayNow}
                style={{
                  background: '#FF3B30', color: '#fff', border: 'none', borderRadius: '8px',
                  padding: '8px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Goal Commitments Section */}
      {(() => {
        const { linkedGoals, totalCommitted } = getAccountCommitments(account.id);
        if (linkedGoals.length === 0) return null;
        const availableBalance = account.balance - totalCommitted;

        return (
          <div style={{ margin: '0 16px 20px' }}>
            <h3 style={{
              margin: '0 0 12px',
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--gray-900)',
              fontFamily: 'SF Pro Display, -apple-system, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              Goal Commitments
            </h3>

            <div style={{
              background: 'var(--white)',
              border: '1px solid #F3F4F6',
              borderRadius: '14px',
              padding: '12px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}>
              {linkedGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => navigate('goals', { selectedGoal: goal })}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 8px',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid #F5F5F7',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <span style={{ fontSize: '20px' }}>{goal.emoji}</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--gray-900)',
                      fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    }}>
                      {goal.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--cyan-primary)',
                    fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  }}>
                    {formatCurrency(goal.currentAmount)}
                  </span>
                </button>
              ))}

              <div style={{
                marginTop: '8px',
                paddingTop: '8px',
                borderTop: '1px solid #F0F0F3',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px',
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--gray-500)',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  Total Committed
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--orange-warn)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                }}>
                  {formatCurrency(totalCommitted)}
                </span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 8px',
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--gray-500)',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  Available Balance
                </span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--green-positive)',
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                }}>
                  {formatCurrency(availableBalance)}
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* search bar */}
      <div style={{ padding: '8px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#F2F2F7', borderRadius: '10px', padding: '8px 12px',
        }}>
          <Search size={16} color="#8E8E93" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search transactions…"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '14px',
              color: '#1C1C1E', background: 'transparent',
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}
          />
        </div>
      </div>

      {/* transaction list */}
      <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: 600, color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 && (
          <p style={{ margin: '20px 0', textAlign: 'center', fontSize: '14px', color: '#C7C7CC', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
            No transactions found
          </p>
        )}

        {filtered.map(t => {
          const isExpense = t.type === 'expense';
          const isIncome = t.type === 'income';
          return (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTransaction(t);
                openModal('transactionDetail');
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0',
                background: 'none', border: 'none', borderBottom: '1px solid #F5F5F7',
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              {/* merchant logo or category emoji circle */}
              {MerchantLogo({ merchant: t.merchant, size: 40 }) || (
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: getCategoryColor(t.category) + '1A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: '18px',
                }}>
                  {getCategoryEmoji(t.category)}
                </div>
              )}

              {/* merchant + category + date */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#1C1C1E', fontFamily: 'SF Pro Text, -apple-system, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.merchant}
                </p>
                <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#8E8E93', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                  {t.category} · {formatRelative(t.date)}
                </p>
              </div>

              {/* amount */}
              <span style={{
                fontSize: '14px', fontWeight: 600, flexShrink: 0,
                color: isExpense ? '#1C1C1E' : '#34C759',
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
              }}>
                {isExpense ? '-' : isIncome ? '+' : '~'}{formatCurrency(t.amount)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
