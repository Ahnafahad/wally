/**
 * Wally – Dashboard (Optimized for 864×1536)
 * Redesigned to match Sample Design Guide patterns exactly
 * Fills entire screen with proper scaling
 * Responsive design with 16px horizontal margins for clean appearance
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../AppContext';
import * as Icons from '../shared/Icons';
import { MerchantLogo } from '../shared/WallyLogo';
import {
  formatCurrency,
  formatCompact,
  formatRelative,
  formatBangla,
  getCategoryColor,
  getCategoryEmoji,
} from '../../utils/formatters';
import {
  getTotalBalance,
  getTotalBudgetLimit,
  getTotalBudgetSpent,
  getRecentTransactions,
} from '../../utils/calculations';
import AdBanner from '../ads/AdBanner';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

export default function Dashboard() {
  const {
    user,
    isPro,
    accounts,
    transactions,
    budgets,
    unreadCount,
    navigate,
    openModal,
    setSelectedTransaction,
  } = useApp();

  const [imgError, setImgError] = useState(false);

  // Refs for measuring component dimensions
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const balanceCardRef = useRef(null);

  // Log dimensions on mount and window resize
  useEffect(() => {
    const logDimensions = () => {
      console.log('═══════════════════════════════════════════════════════');
      console.log('📐 DASHBOARD DIMENSIONS');
      console.log('═══════════════════════════════════════════════════════');
      console.log('Window:', {
        width: window.innerWidth,
        height: window.innerHeight
      });

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const styles = window.getComputedStyle(containerRef.current);
        console.log('Dashboard Container:', {
          width: rect.width,
          height: rect.height,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
        });
      }

      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        const styles = window.getComputedStyle(headerRef.current);
        console.log('Header:', {
          width: rect.width,
          height: rect.height,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
        });
      }

      if (balanceCardRef.current) {
        const rect = balanceCardRef.current.getBoundingClientRect();
        const styles = window.getComputedStyle(balanceCardRef.current);
        console.log('Balance Card:', {
          width: rect.width,
          height: rect.height,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
          borderRadius: styles.borderRadius,
        });
      }

      console.log('═══════════════════════════════════════════════════════');
    };

    logDimensions();
    window.addEventListener('resize', logDimensions);
    return () => window.removeEventListener('resize', logDimensions);
  }, []);

  const totalBalance = getTotalBalance(accounts);
  const recentTxns = getRecentTransactions(transactions, 5); // Increased to 5 for better fill
  const budgetLimit = getTotalBudgetLimit(budgets);
  const budgetSpent = getTotalBudgetSpent(budgets);
  const budgetPct = budgetLimit > 0 ? (budgetSpent / budgetLimit) * 100 : 0;
  const userName = user === 'rafiq' ? 'Rafiq' : 'Sarah';

  const bankTotal = accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0);
  const mfsTotal = accounts.filter(a => a.type === 'mfs').reduce((sum, a) => sum + a.balance, 0);
  const cashTotal = accounts.filter(a => a.type === 'cash').reduce((sum, a) => sum + a.balance, 0);
  const creditTotal = accounts.filter(a => a.type === 'credit_card').reduce((sum, a) => sum + a.balance, 0);

  // Calculate financial score (simplified algorithm)
  const calculateFinancialScore = () => {
    const balanceScore = Math.min((totalBalance / 500000) * 400, 400);
    const budgetScore = Math.min(((budgetLimit - budgetSpent) / budgetLimit) * 300, 300);
    const savingsScore = Math.min((bankTotal / 200000) * 300, 300);
    return Math.round(balanceScore + budgetScore + savingsScore);
  };

  const financialScore = calculateFinancialScore();
  const scorePercentage = Math.min((financialScore / 1000) * 100, 100);
  const scoreLabel = financialScore >= 800 ? 'Excellent' : financialScore >= 600 ? 'Good' : financialScore >= 400 ? 'Fair' : 'Needs Work';

  // Get top 3 budget categories
  const topCategories = budgets
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3)
    .map(b => ({
      name: b.category,
      spent: b.spent,
      total: b.limit,
      color: getCategoryColor(b.category),
    }));

  const totalSpent = topCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalLimit = topCategories.reduce((sum, cat) => sum + cat.total, 0);
  const remaining = totalLimit - totalSpent;

  // Calculate spending insights
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const avgDailySpend = Math.round(totalExpense / 30);

  return (
    <div ref={containerRef} style={{
      backgroundColor: '#F3F4F6',
      minHeight: '100%',
      paddingBottom: '32px',
      width: '100%',
      maxWidth: '864px',
      margin: '0 auto',
    }}>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER (Sample Design Style)
          ═══════════════════════════════════════════════════════════════════ */}
      <div ref={headerRef} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px clamp(16px, 2.5vw, 24px) 16px',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Logo with fallback */}
          {!imgError ? (
            <img
              src="/assets/logo.png"
              alt="Wally"
              style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(45, 156, 219, 0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2D9CDB',
              fontWeight: 700,
              fontSize: '16px',
            }}>
              W
            </div>
          )}
          <div style={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
          }}>
            Good Morning, <span style={{ color: '#2D9CDB' }}>{userName}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Notification bell */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => openModal('notifications')}>
            <Icons.Bell size={26} color="#374151" strokeWidth={2} />
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '11px',
                height: '11px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #fff',
                transform: 'translate(4px, -4px)',
              }} />
            )}
          </div>

          {/* Profile picture */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            border: '1px solid #E5E7EB',
          }}>
            <img
              src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&q=80&w=200&h=200"
              alt={userName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          BALANCE CARD (Sample Design Style - Simple & Clean)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <button
          ref={balanceCardRef}
          onClick={() => navigate('account')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '16px',
            padding: '28px 24px',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            textAlign: 'left',
            boxShadow: '0 20px 25px -5px rgba(79,172,254,0.25), 0 10px 10px -5px rgba(79,172,254,0.15)',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {/* Header Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            position: 'relative',
            zIndex: 10,
          }}>
            <div style={{
              fontSize: '13px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.9)',
              fontFamily: SF,
            }}>
              Total Balance
            </div>

            {/* Cloud Sync Icon */}
            <div style={{ position: 'relative', opacity: 0.9, padding: '4px' }}>
              <Icons.Cloud size={18} color="#fff" strokeWidth={2} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.25)',
                borderRadius: '50%',
                padding: '2px',
                backdropFilter: 'blur(4px)',
              }}>
                <Icons.RefreshCw size={7} color="#fff" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Main Balance */}
          <div style={{
            marginBottom: '20px',
            position: 'relative',
            zIndex: 10,
          }}>
            <div style={{
              fontSize: '42px',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontFamily: SF_DISPLAY,
            }}>
              <span style={{ fontSize: '28px', fontWeight: 600, marginRight: '8px' }}>৳</span>
              {formatBangla(totalBalance)}
            </div>
          </div>

          {/* Stats Grid - Ultra Compact */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px 10px',
            position: 'relative',
            zIndex: 10,
          }}>
            {/* Bank */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                color: 'rgba(191, 219, 254, 1)',
                fontSize: '11px',
                fontWeight: 300,
                opacity: 0.9,
                width: '36px',
                fontFamily: SF,
              }}>
                Bank:
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: SF }}>
                ৳ {formatBangla(bankTotal)}
              </span>
            </div>

            {/* MFS */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                color: 'rgba(191, 219, 254, 1)',
                fontSize: '11px',
                fontWeight: 300,
                opacity: 0.9,
                width: '36px',
                fontFamily: SF,
              }}>
                MFS:
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: SF }}>
                ৳ {formatBangla(mfsTotal)}
              </span>
            </div>

            {/* Cash */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                color: 'rgba(191, 219, 254, 1)',
                fontSize: '11px',
                fontWeight: 300,
                opacity: 0.9,
                width: '36px',
                fontFamily: SF,
              }}>
                Cash:
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: SF }}>
                ৳ {formatBangla(cashTotal)}
              </span>
            </div>

            {/* Credit */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{
                color: 'rgba(191, 219, 254, 1)',
                fontSize: '11px',
                fontWeight: 300,
                opacity: 0.9,
                width: '36px',
                fontFamily: SF,
              }}>
                Credit:
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: SF }}>
                -৳ {formatBangla(creditTotal)}
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          FINANCIAL SCORE CARD (Sample Design Style)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <button
          onClick={() => navigate('financialScore')}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            border: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#1F2937',
              marginBottom: '6px',
              fontFamily: SF_DISPLAY,
            }}>
              Financial Score
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '34px',
                fontWeight: 700,
                color: '#2D9CDB',
                letterSpacing: '-0.02em',
                fontFamily: SF_DISPLAY,
              }}>
                {financialScore}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                color: scoreLabel === 'Excellent' ? '#059669' : scoreLabel === 'Good' ? '#10B981' : '#F59E0B',
                backgroundColor: scoreLabel === 'Excellent' ? '#ECFDF5' : scoreLabel === 'Good' ? '#D1FAE5' : '#FEF3C7',
                border: `1px solid ${scoreLabel === 'Excellent' ? '#A7F3D0' : scoreLabel === 'Good' ? '#6EE7B7' : '#FCD34D'}`,
                padding: '3px 10px',
                borderRadius: '9999px',
                fontFamily: SF,
              }}>
                {scoreLabel}
              </span>
            </div>
          </div>

          {/* Circular Gauge Visualization */}
          <div style={{
            position: 'relative',
            width: '72px',
            height: '72px',
            flexShrink: 0,
          }}>
            {/* Background Track (SVG) */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="24"
                stroke="#F3F4F6"
                strokeWidth="5"
                fill="none"
              />
            </svg>

            {/* Conic Gradient Progress Ring */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `conic-gradient(from 0deg, #EF4444 0%, #F59E0B ${scorePercentage * 0.5}%, #22C55E ${scorePercentage}%, transparent ${scorePercentage}%)`,
                maskImage: 'radial-gradient(closest-side, transparent 71%, black 72%)',
                WebkitMaskImage: 'radial-gradient(closest-side, transparent 71%, black 72%)',
              }}
            />

            {/* Start Cap (Red) */}
            <div style={{
              position: 'absolute',
              inset: 0,
              transform: 'rotate(0deg)',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  marginTop: '4px',
                }} />
              </div>
            </div>

            {/* End Cap (Green) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                transform: `rotate(${scorePercentage * 3.6}deg)`,
              }}
            >
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  backgroundColor: '#22C55E',
                  borderRadius: '50%',
                  marginTop: '4px',
                }} />
              </div>
            </div>

            {/* Center Dot */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '7px',
                height: '7px',
                backgroundColor: '#2D9CDB',
                borderRadius: '50%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }} />
            </div>
          </div>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          AI COACH CARD (Sample Design Style - Compact)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          {/* Logo Section */}
          <div style={{
            flexShrink: 0,
            width: '44px',
            height: '44px',
            backgroundColor: '#EFF6FF',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {!imgError ? (
              <img
                src="/assets/logo.png"
                alt="Wally"
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                onError={() => setImgError(true)}
              />
            ) : (
              <span style={{ color: '#2D9CDB', fontWeight: 700, fontSize: '20px' }}>W</span>
            )}
          </div>

          {/* Content Section */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: SF,
              }}>
                AI Insight
              </h3>
              <span style={{
                width: '7px',
                height: '7px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
              }} />
            </div>
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              fontWeight: 300,
              fontFamily: SF,
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              Food spending is +15% vs average.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate('coach')}
            style={{
              flexShrink: 0,
              backgroundColor: 'rgba(45, 156, 219, 0.1)',
              color: '#2D9CDB',
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: SF,
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(45, 156, 219, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(45, 156, 219, 0.1)'}
          >
            Ask
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MONTHLY BUDGET CARD (Sample Design Style)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <button
          onClick={() => navigate('budget')}
          style={{
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            border: '1px solid #F3F4F6',
            cursor: 'pointer',
            textAlign: 'left',
          }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '22px',
          }}>
            <div>
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: SF_DISPLAY,
                marginBottom: '3px',
              }}>
                February Budget
              </h3>
              <span style={{
                fontSize: '11px',
                color: '#9CA3AF',
                fontWeight: 300,
                fontFamily: SF,
              }}>
                Feb 1 - Feb 28
              </span>
            </div>
            <div style={{
              backgroundColor: '#F8F9FB',
              padding: '8px 12px',
              borderRadius: '10px',
              border: '1px solid #EFF6FF',
            }}>
              <span style={{
                color: '#1A7FB0',
                fontWeight: 600,
                fontSize: '13px',
                fontFamily: SF,
              }}>
                {formatCompact(remaining)} Left
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {topCategories.map((cat) => {
              const percentage = Math.min((cat.spent / cat.total) * 100, 100);
              const emoji = getCategoryEmoji(cat.name);

              return (
                <div key={cat.name}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: '10px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: cat.color,
                      }} />
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#374151',
                        fontFamily: SF,
                      }}>
                        {cat.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontFamily: SF }}>
                      <span style={{ fontWeight: 600, color: '#1F2937' }}>
                        {formatCompact(cat.spent)}
                      </span>
                      <span style={{ color: '#9CA3AF', fontWeight: 300, margin: '0 5px' }}>
                        /
                      </span>
                      <span style={{ color: '#9CA3AF', fontWeight: 300 }}>
                        {formatCompact(cat.total)}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '7px',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        backgroundColor: cat.color,
                        width: `${percentage}%`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RECENT TRANSACTIONS (Keep existing functionality)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '28px clamp(16px, 2.5vw, 24px) 0' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
          marginBottom: '14px',
        }}>
          Recent Transactions
        </h3>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          border: '1px solid #F3F4F6',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        }}>
          {recentTxns.map((txn, idx) => {
            const isExpense = txn.type === 'expense';
            const isIncome = txn.type === 'income';
            const color = isExpense ? '#EF4444' : isIncome ? '#10B981' : '#2D9CDB';
            const sign = isExpense ? '-' : isIncome ? '+' : '';
            const emoji = getCategoryEmoji(txn.category);

            return (
              <button
                key={txn.id}
                onClick={() => {
                  setSelectedTransaction(txn);
                  openModal('transactionDetail');
                }}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  border: 'none',
                  borderBottom: idx < recentTxns.length - 1 ? '1px solid #F3F4F6' : 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: `${color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '22px',
                }}>
                  {emoji || (txn.merchant ? <MerchantLogo name={txn.merchant} size={26} /> : '💰')}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#1F2937',
                    fontFamily: SF,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {txn.merchant}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    fontFamily: SF,
                    marginTop: '3px',
                  }}>
                    {formatRelative(txn.date)}
                  </div>
                </div>

                {/* Amount */}
                <div style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: color,
                  fontFamily: SF_DISPLAY,
                  textAlign: 'right',
                }}>
                  {sign}{formatCurrency(txn.amount)}
                </div>
              </button>
            );
          })}
        </div>

        {/* View All Transactions Button */}
        <button
          onClick={() => navigate('allTransactions')}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '12px',
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            color: '#2D9CDB',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: SF,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F3F4F6';
            e.currentTarget.style.borderColor = '#2D9CDB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
        >
          View All Transactions
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          NEW COMPONENT: SPENDING INSIGHTS (Added after transactions)
          ═══════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '28px clamp(16px, 2.5vw, 24px) 0' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 600,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
          marginBottom: '14px',
        }}>
          Spending Insights
        </h3>

        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          border: '1px solid #F3F4F6',
        }}>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}>
            {/* Average Daily Spend */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #F3F4F6',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                fontWeight: 500,
                fontFamily: SF,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Avg Daily Spend
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#EF4444',
                fontFamily: SF_DISPLAY,
                letterSpacing: '-0.01em',
              }}>
                {formatCompact(avgDailySpend)}
              </div>
            </div>

            {/* Savings Rate */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #F3F4F6',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                fontWeight: 500,
                fontFamily: SF,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Savings Rate
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#10B981',
                fontFamily: SF_DISPLAY,
                letterSpacing: '-0.01em',
              }}>
                {Math.round(savingsRate)}%
              </div>
            </div>

            {/* Total Income */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #F3F4F6',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                fontWeight: 500,
                fontFamily: SF,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Total Income
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#10B981',
                fontFamily: SF_DISPLAY,
                letterSpacing: '-0.01em',
              }}>
                {formatCompact(totalIncome)}
              </div>
            </div>

            {/* Total Expense */}
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              border: '1px solid #F3F4F6',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                fontWeight: 500,
                fontFamily: SF,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Total Expense
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#EF4444',
                fontFamily: SF_DISPLAY,
                letterSpacing: '-0.01em',
              }}>
                {formatCompact(totalExpense)}
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div style={{
            marginTop: '18px',
            padding: '14px',
            backgroundColor: '#EFF6FF',
            borderRadius: '10px',
            border: '1px solid #DBEAFE',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}>
              <div style={{ fontSize: '18px' }}>💡</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#1E40AF',
                  fontFamily: SF,
                  marginBottom: '4px',
                }}>
                  Quick Tip
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#3B82F6',
                  fontFamily: SF,
                  lineHeight: 1.5,
                }}>
                  {savingsRate > 20
                    ? 'Great job! Your savings rate is excellent. Keep it up!'
                    : 'Try to reduce dining out expenses to improve your savings rate.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Banner for Free users */}
      {!isPro && (
        <div style={{ padding: '28px clamp(16px, 2.5vw, 24px) 0' }}>
          <AdBanner />
        </div>
      )}
    </div>
  );
}
