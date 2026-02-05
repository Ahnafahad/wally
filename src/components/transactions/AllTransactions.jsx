/**
 * Wally – All Transactions Page
 *
 * Searchable, filterable view of all transactions with category pills
 * and merchant-name tapping to filter by merchant.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, Search } from '../shared/Icons';
import { MerchantLogo } from '../shared/WallyLogo';
import { formatCurrency, formatRelative, getCategoryColor, getCategoryEmoji } from '../../utils/formatters';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

export default function AllTransactions() {
  const { navigate, transactions, txnFilter, setTxnFilter, setSelectedTransaction, openModal } = useApp();

  // ── Local state ───────────────────────────────────────────────────────────
  const [searchQ, setSearchQ] = useState('');
  const [filterMode, setFilterMode] = useState('category'); // 'category' | 'merchant'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMerchant, setSelectedMerchant] = useState('');

  // ── Initialize filter from context (pre-set from Reports page) ──────────
  useEffect(() => {
    if (txnFilter) {
      if (txnFilter.type === 'category') {
        setFilterMode('category');
        setSelectedCategory(txnFilter.value);
      } else if (txnFilter.type === 'merchant') {
        setFilterMode('merchant');
        setSelectedMerchant(txnFilter.value);
      }
      // Clear filter from context after reading
      setTxnFilter(null);
    }
  }, []);

  // ── Derive category pills from actual data ──────────────────────────────
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryMap = {};
  expenseTransactions.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
  });
  const categories = ['All', ...Object.keys(categoryMap).sort((a, b) => categoryMap[b] - categoryMap[a])];

  // ── Filter logic ─────────────────────────────────────────────────────────
  let filtered = transactions;

  // Apply search (case-insensitive merchant name match)
  if (searchQ) {
    filtered = filtered.filter(t =>
      t.merchant.toLowerCase().includes(searchQ.toLowerCase())
    );
  }

  // Apply category/merchant filter
  if (filterMode === 'category' && selectedCategory !== 'All') {
    filtered = filtered.filter(t => t.category === selectedCategory);
  } else if (filterMode === 'merchant' && selectedMerchant) {
    filtered = filtered.filter(t => t.merchant === selectedMerchant);
  }

  // Sort by date desc
  filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  // ── Summary calculations ─────────────────────────────────────────────────
  const totalExpense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100%', paddingBottom: '100px' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          STICKY HEADER
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
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
            borderRadius: '10px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ChevronLeft size={24} color="#2D9CDB" strokeWidth={2.2} />
        </button>

        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          All Transactions
        </span>

        <div style={{ width: '40px' }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SEARCH BAR
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '16px 24px 12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F3F4F6',
          borderRadius: '10px',
          padding: '10px 12px',
        }}>
          <Search size={18} color="#6B7280" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search by merchant..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#1F2937',
              background: 'transparent',
              fontFamily: SF,
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FILTER ROW (Category Pills or Merchant Chip)
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px 12px' }}>
        {filterMode === 'merchant' ? (
          // Merchant chip with × to clear
          <button
            onClick={() => {
              setFilterMode('category');
              setSelectedMerchant('');
              setSelectedCategory('All');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid #2D9CDB',
              background: '#EFF8FC',
              color: '#2D9CDB',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: SF,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#D6EDF8'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#EFF8FC'}
          >
            <span>Merchant: {selectedMerchant}</span>
            <span style={{ fontSize: '16px', fontWeight: 700 }}>×</span>
          </button>
        ) : (
          // Category pills (horizontal scroll)
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {categories.map(cat => {
              const isActive = cat === selectedCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isActive ? '1px solid #2D9CDB' : '1px solid #E5E7EB',
                    background: isActive ? '#2D9CDB' : '#fff',
                    color: isActive ? '#fff' : '#6B7280',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: SF,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = '#fff';
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SUMMARY BAR
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '0 24px 16px',
        padding: '14px 16px',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #F3F4F6',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#6B7280',
            fontFamily: SF,
            fontWeight: 500,
          }}>
            Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#6B7280',
            fontFamily: SF,
            fontWeight: 500,
          }}>
            Total Expenses
          </p>
          <p style={{
            margin: '2px 0 0',
            fontSize: '16px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
          }}>
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TRANSACTION LIST
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 24px' }}>
        {filtered.length === 0 && (
          <p style={{
            textAlign: 'center',
            margin: '40px 0',
            fontSize: '14px',
            color: '#9CA3AF',
            fontFamily: SF,
          }}>
            No transactions found
          </p>
        )}

        {filtered.map(t => {
          const isExpense = t.type === 'expense';
          const isIncome = t.type === 'income';

          return (
            <div
              key={t.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              {/* Logo or category emoji */}
              <div style={{ flexShrink: 0 }}>
                <MerchantLogo
                  merchant={t.merchant}
                  size={44}
                  fallbackIcon={
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: getCategoryColor(t.category) + '1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}>
                      {getCategoryEmoji(t.category)}
                    </div>
                  }
                />
              </div>

              {/* Merchant + Category + Date */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Merchant name is tappable */}
                <button
                  onClick={() => {
                    setFilterMode('merchant');
                    setSelectedMerchant(t.merchant);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: SF,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textDecoration: 'underline',
                    textDecorationColor: 'transparent',
                    transition: 'text-decoration-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = '#2D9CDB'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'transparent'}
                >
                  {t.merchant}
                </button>
                <p style={{
                  margin: '2px 0 0',
                  fontSize: '12px',
                  color: '#6B7280',
                  fontFamily: SF,
                }}>
                  {t.category} · {formatRelative(t.date)}
                </p>
              </div>

              {/* Amount (tappable to open transaction detail) */}
              <button
                onClick={() => {
                  setSelectedTransaction(t);
                  openModal('transactionDetail');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isExpense ? '#1F2937' : '#10B981',
                  fontFamily: SF_DISPLAY,
                  flexShrink: 0,
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                {isExpense ? '-' : isIncome ? '+' : '~'}{formatCurrency(t.amount)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
