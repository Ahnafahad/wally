/**
 * Wally – Financial Score Detail Page
 *
 * Comprehensive page explaining financial score with personalized insights.
 * Optimized for 864×1536 screen with ~1500px content height.
 */

import React from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, TrendingUp, TrendingDown } from '../shared/Icons';
import { getTotalBalance } from '../../utils/calculations';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

export default function FinancialScoreDetail() {
  const { navigate, accounts, transactions, budgets, user } = useApp();

  const totalBalance = getTotalBalance(accounts);
  const bankTotal = accounts.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.balance, 0);
  const budgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  // Calculate financial score
  const balanceScore = Math.min((totalBalance / 500000) * 400, 400);
  const budgetScore = Math.min(((budgetLimit - budgetSpent) / budgetLimit) * 300, 300);
  const savingsScore = Math.min((bankTotal / 200000) * 300, 300);
  const financialScore = Math.round(balanceScore + budgetScore + savingsScore);
  const scorePercentage = Math.min((financialScore / 1000) * 100, 100);

  const scoreLabel = financialScore >= 800 ? 'Excellent' :
                     financialScore >= 600 ? 'Good' :
                     financialScore >= 400 ? 'Fair' : 'Needs Work';

  const scoreColor = financialScore >= 800 ? '#10B981' :
                     financialScore >= 600 ? '#2D9CDB' :
                     financialScore >= 400 ? '#F59E0B' : '#EF4444';

  // Track record (simulated - in real app would come from historical data)
  const lastMonthScore = financialScore - 45; // Simulated increase
  const scoreChange = financialScore - lastMonthScore;
  const isIncreasing = scoreChange > 0;

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: '#F9FAFB',
      paddingBottom: '100px',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#fff',
        padding: '16px clamp(16px, 2.5vw, 24px)',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => navigate('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '-8px',
          }}
        >
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
        </button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
        }}>
          Financial Score
        </h1>
      </div>

      {/* Hero Score Card */}
      <div style={{ padding: '24px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '32px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB',
          textAlign: 'center',
        }}>
          {/* Large Score Display */}
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            color: scoreColor,
            fontFamily: SF_DISPLAY,
            lineHeight: 1,
            marginBottom: '12px',
          }}>
            {financialScore}
          </div>

          {/* Score Label */}
          <div style={{
            display: 'inline-block',
            backgroundColor: scoreLabel === 'Excellent' ? '#ECFDF5' :
                            scoreLabel === 'Good' ? '#EFF6FF' :
                            scoreLabel === 'Fair' ? '#FEF3C7' : '#FEE2E2',
            color: scoreLabel === 'Excellent' ? '#059669' :
                   scoreLabel === 'Good' ? '#2D9CDB' :
                   scoreLabel === 'Fair' ? '#F59E0B' : '#EF4444',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: SF,
            marginBottom: '20px',
          }}>
            {scoreLabel}
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#F3F4F6',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}>
            <div style={{
              height: '100%',
              width: `${scorePercentage}%`,
              background: `linear-gradient(90deg, ${scoreColor}dd, ${scoreColor})`,
              borderRadius: '9999px',
              transition: 'width 0.8s ease',
            }} />
          </div>

          {/* Score Change */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: isIncreasing ? '#10B981' : '#EF4444',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: SF,
          }}>
            {isIncreasing ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isIncreasing ? '+' : ''}{scoreChange} from last month
          </div>
        </div>
      </div>

      {/* What is Financial Score */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
            marginBottom: '12px',
          }}>
            💡 What is a Financial Score?
          </h2>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#4B5563',
            fontFamily: SF,
            marginBottom: '12px',
          }}>
            Your Financial Score is a comprehensive measure of your financial health, ranging from 0 to 1000.
            It combines multiple factors including your account balances, spending habits, savings rate, and
            budget adherence to give you a clear picture of your financial wellness.
          </p>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#4B5563',
            fontFamily: SF,
          }}>
            A higher score indicates better financial management and stability. Regular monitoring helps you
            track your progress toward your financial goals.
          </p>
        </div>
      </div>

      {/* How It's Calculated */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
            marginBottom: '16px',
          }}>
            📊 How It's Calculated
          </h2>

          {/* Balance Component */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: SF,
              }}>
                Account Balance (40%)
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#2D9CDB',
                fontFamily: SF,
              }}>
                {Math.round(balanceScore)} pts
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#F3F4F6',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(balanceScore / 400) * 100}%`,
                backgroundColor: '#2D9CDB',
                borderRadius: '9999px',
              }} />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: SF,
              marginTop: '6px',
            }}>
              Based on your total account balance relative to target (৳5,00,000)
            </p>
          </div>

          {/* Budget Component */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: SF,
              }}>
                Budget Management (30%)
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#10B981',
                fontFamily: SF,
              }}>
                {Math.round(budgetScore)} pts
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#F3F4F6',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(budgetScore / 300) * 100}%`,
                backgroundColor: '#10B981',
                borderRadius: '9999px',
              }} />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: SF,
              marginTop: '6px',
            }}>
              How well you stay within your monthly budget limits
            </p>
          </div>

          {/* Savings Component */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F2937',
                fontFamily: SF,
              }}>
                Savings & Investments (30%)
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#F59E0B',
                fontFamily: SF,
              }}>
                {Math.round(savingsScore)} pts
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#F3F4F6',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(savingsScore / 300) * 100}%`,
                backgroundColor: '#F59E0B',
                borderRadius: '9999px',
              }} />
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: SF,
              marginTop: '6px',
            }}>
              Your bank savings relative to target (৳2,00,000)
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Suggestions */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
            marginBottom: '16px',
          }}>
            💪 How to Improve Your Score
          </h2>

          {/* Suggestion Cards */}
          {balanceScore < 300 && (
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E40AF',
                fontFamily: SF,
                marginBottom: '6px',
              }}>
                🎯 Build Your Emergency Fund
              </div>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                fontFamily: SF,
                lineHeight: '1.5',
              }}>
                Your account balance could be stronger. Aim to save at least 3-6 months of expenses
                in your bank accounts for financial security.
              </p>
            </div>
          )}

          {budgetScore < 200 && (
            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#92400E',
                fontFamily: SF,
                marginBottom: '6px',
              }}>
                📋 Stick to Your Budget
              </div>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                fontFamily: SF,
                lineHeight: '1.5',
              }}>
                You're exceeding your budget limits. Try reducing non-essential spending and tracking
                your expenses more closely to stay on target.
              </p>
            </div>
          )}

          {savingsScore < 200 && (
            <div style={{
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#065F46',
                fontFamily: SF,
                marginBottom: '6px',
              }}>
                💰 Increase Your Savings Rate
              </div>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                fontFamily: SF,
                lineHeight: '1.5',
              }}>
                Growing your savings will improve your financial stability. Consider setting up
                automatic transfers to your savings account each month.
              </p>
            </div>
          )}

          {financialScore >= 700 && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#166534',
                fontFamily: SF,
                marginBottom: '6px',
              }}>
                ✨ Excellent Work!
              </div>
              <p style={{
                fontSize: '13px',
                color: '#374151',
                fontFamily: SF,
                lineHeight: '1.5',
              }}>
                You're managing your finances exceptionally well. Keep up the great habits and
                consider exploring investment opportunities to grow your wealth further.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Track Record */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
            marginBottom: '16px',
          }}>
            📈 Your Track Record
          </h2>

          {/* Score History */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#F9FAFB',
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: SF,
                marginBottom: '4px',
              }}>
                Last Month
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#4B5563',
                fontFamily: SF_DISPLAY,
              }}>
                {lastMonthScore}
              </div>
            </div>
            <div style={{
              fontSize: '32px',
              color: '#E5E7EB',
            }}>
              →
            </div>
            <div>
              <div style={{
                fontSize: '12px',
                color: '#6B7280',
                fontFamily: SF,
                marginBottom: '4px',
              }}>
                This Month
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: scoreColor,
                fontFamily: SF_DISPLAY,
              }}>
                {financialScore}
              </div>
            </div>
          </div>

          {/* Why Changed */}
          <div style={{
            backgroundColor: isIncreasing ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${isIncreasing ? '#A7F3D0' : '#FECACA'}`,
            borderRadius: '12px',
            padding: '16px',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isIncreasing ? '#065F46' : '#991B1B',
              fontFamily: SF,
              marginBottom: '8px',
            }}>
              {isIncreasing ? '🎉 Why Did It Increase?' : '⚠️ Why Did It Decrease?'}
            </div>
            <ul style={{
              fontSize: '13px',
              color: '#374151',
              fontFamily: SF,
              lineHeight: '1.6',
              paddingLeft: '20px',
              margin: 0,
            }}>
              {isIncreasing ? (
                <>
                  <li>Your account balance increased by ৳15,000</li>
                  <li>You stayed within budget in 2 out of 3 categories</li>
                  <li>Reduced spending on non-essentials by 12%</li>
                </>
              ) : (
                <>
                  <li>Exceeded budget limit in Shopping category</li>
                  <li>Bank savings decreased this month</li>
                  <li>Higher than usual expenses detected</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        <button
          onClick={() => navigate('budget')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: SF,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)',
          }}
        >
          Review Your Budget
        </button>
      </div>
    </div>
  );
}
