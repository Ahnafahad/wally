/**
 * Wally – Profile Page
 *
 * User profile with tier status, demo switcher, settings, and upgrade flow
 */

import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { ChevronLeft, ChevronRight } from '../shared/Icons';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

export default function ProfilePage() {
  const { navigate, user, isPro, switchUser } = useApp();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // User data
  const userData = {
    rafiq: { name: 'Rafiq Ahmed', email: 'rafiq.ahmed@email.com', initials: 'RA', color: '#4facfe' },
    sarah: { name: 'Sarah Khan', email: 'sarah.khan@email.com', initials: 'SK', color: '#ff6b9d' },
  };

  const currentUser = userData[user];

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100%', paddingBottom: '24px' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          HEADER
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
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
          Profile
        </span>

        <div style={{ width: '40px' }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          USER HEADER
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '20px 24px',
        padding: '20px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        {/* Avatar */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff',
          fontFamily: SF_DISPLAY,
          flexShrink: 0,
        }}>
          {currentUser.initials}
        </div>

        {/* Name + Email + Tier Badge */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: '#1F2937',
            fontFamily: SF_DISPLAY,
          }}>
            {currentUser.name}
          </h2>
          <p style={{
            margin: '2px 0 8px',
            fontSize: '13px',
            color: '#6B7280',
            fontFamily: SF,
          }}>
            {currentUser.email}
          </p>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            background: isPro ? 'linear-gradient(135deg, #ffd700, #ffed4e)' : '#F3F4F6',
            color: isPro ? '#7C2D12' : '#6B7280',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: SF,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {isPro ? '✨ Premium' : 'Free'}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TIER STATUS CARD
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '0 24px 20px',
        padding: '20px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
      }}>
        <h3 style={{
          margin: '0 0 4px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
        }}>
          {isPro ? 'Wally Premium ✨' : 'Wally Free'}
        </h3>
        <p style={{
          margin: '0 0 16px',
          fontSize: '13px',
          color: '#6B7280',
          fontFamily: SF,
        }}>
          {isPro ? 'Active subscription' : 'You\'re using the free tier'}
        </p>

        {/* Features List */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            margin: '0 0 8px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#6B7280',
            fontFamily: SF,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {isPro ? 'Premium Features' : 'Current Features'}
          </p>
          {isPro ? (
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '13px', color: '#374151', fontFamily: SF, lineHeight: 1.8 }}>
              <li>✓ Unlimited goals</li>
              <li>✓ Unlimited AI questions + live Gemini chat</li>
              <li>✓ Investment analysis & recommendations</li>
              <li>✓ AI-powered budget suggestions</li>
              <li>✓ All report periods + 6-month history</li>
              <li>✓ Data export (CSV / Excel / PDF)</li>
              <li>✓ Ad-free experience</li>
            </ul>
          ) : (
            <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: '13px', color: '#374151', fontFamily: SF, lineHeight: 1.8 }}>
              <li>✓ 2 active goals</li>
              <li>✓ 20 AI questions per month</li>
              <li>✓ Monthly reports (last 3 months)</li>
              <li>✓ Up to 3 linked accounts</li>
            </ul>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowUpgradeModal(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: isPro ? '#F3F4F6' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: isPro ? '#6B7280' : '#fff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: SF,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (!isPro) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(74,173,224,0.40)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPro) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          {isPro ? 'Manage Subscription' : 'Upgrade to Premium'}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DEMO MODE (User Switcher)
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '0 24px 20px',
        padding: '16px 20px',
        background: '#FFF7ED',
        border: '1px solid #FED7AA',
        borderRadius: '14px',
      }}>
        <h3 style={{
          margin: '0 0 12px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#9A3412',
          fontFamily: SF_DISPLAY,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Demo Mode
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['rafiq', 'sarah'].map(u => {
            const uData = userData[u];
            const isActive = user === u;
            return (
              <button
                key={u}
                onClick={() => switchUser(u)}
                disabled={isActive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: isActive ? '2px solid #FB923C' : '1px solid #FED7AA',
                  background: isActive ? '#FFF7ED' : '#fff',
                  cursor: isActive ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isActive ? 1 : 0.8,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.opacity = 0.8;
                }}
              >
                {/* Mini Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${uData.color}, ${uData.color}dd)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                  fontFamily: SF_DISPLAY,
                  flexShrink: 0,
                }}>
                  {uData.initials}
                </div>

                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: SF,
                  }}>
                    {uData.name}
                  </p>
                  <p style={{
                    margin: '1px 0 0',
                    fontSize: '12px',
                    color: '#6B7280',
                    fontFamily: SF,
                  }}>
                    {u === 'sarah' ? 'Premium' : 'Free'} tier
                  </p>
                </div>

                {isActive && (
                  <span style={{ fontSize: '18px' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          SETTINGS LIST
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '0 24px 20px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}>
        <h3 style={{
          margin: 0,
          padding: '16px 20px 12px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#6B7280',
          fontFamily: SF_DISPLAY,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Settings
        </h3>

        {[
          { label: 'Notifications', value: 'Enabled' },
          { label: 'Data Sync', value: 'Real-time' },
          { label: 'Currency', value: '৳ Taka' },
          { label: 'Language', value: 'English' },
          { label: 'Privacy', value: 'Manage' },
        ].map((item, i, arr) => (
          <button
            key={item.label}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1F2937',
              fontFamily: SF,
            }}>
              {item.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: SF,
              }}>
                {item.value}
              </span>
              <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} />
            </div>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          ABOUT SECTION
          ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        margin: '0 24px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}>
        <h3 style={{
          margin: 0,
          padding: '16px 20px 12px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#6B7280',
          fontFamily: SF_DISPLAY,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          About
        </h3>

        {[
          { label: 'App Version', value: 'v2.0.0' },
          { label: 'Terms & Privacy', value: null },
          { label: 'Help & Support', value: null },
        ].map((item, i) => (
          <button
            key={item.label}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              background: 'none',
              border: 'none',
              borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: 500,
              color: '#1F2937',
              fontFamily: SF,
            }}>
              {item.label}
            </span>
            {item.value ? (
              <span style={{
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: SF,
              }}>
                {item.value}
              </span>
            ) : (
              <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} />
            )}
          </button>
        ))}

        {/* Sign Out Button */}
        <button
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'none',
            border: 'none',
            borderTop: '1px solid #F3F4F6',
            cursor: 'pointer',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 600,
            color: '#EF4444',
            fontFamily: SF,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#FEF2F2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          Sign Out
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          UPGRADE MODAL
          ══════════════════════════════════════════════════════════════════════ */}
      {showUpgradeModal && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowUpgradeModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.40)',
              zIndex: 199,
            }}
          />

          {/* Modal Content */}
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: '#F9FAFB',
            overflowY: 'auto',
            paddingBottom: '40px',
          }}>
            {/* Header */}
            <div style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              background: '#fff',
              borderBottom: '1px solid #E5E7EB',
            }}>
              <div style={{ width: '40px' }} />
              <span style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#1F2937',
                fontFamily: SF_DISPLAY,
              }}>
                Unlock Premium
              </span>
              <button
                onClick={() => setShowUpgradeModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  fontSize: '24px',
                  color: '#6B7280',
                }}
              >
                ×
              </button>
            </div>

            {/* Feature Comparison */}
            <div style={{
              margin: '20px 24px',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: SF, fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6B7280' }}>Feature</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6B7280' }}>Free</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#2D9CDB' }}>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Linked Accounts', free: '3', premium: 'Unlimited' },
                    { feature: 'Active Goals', free: '2', premium: 'Unlimited' },
                    { feature: 'AI Questions', free: '20/month', premium: 'Unlimited' },
                    { feature: 'Investment Analysis', free: '❌', premium: '✓' },
                    { feature: 'AI Budget Tips', free: '❌', premium: '✓' },
                    { feature: 'Report Periods', free: 'Monthly', premium: 'Weekly / Monthly / Quarterly / Yearly' },
                    { feature: 'Report History', free: 'Last 3 months', premium: 'Last 6 months' },
                    { feature: 'Export Data', free: '❌', premium: 'CSV / Excel / PDF' },
                    { feature: 'Ads', free: 'Shows ads', premium: 'Ad-free' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 16px', color: '#374151', fontWeight: 500 }}>{row.feature}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#6B7280' }}>{row.free}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', color: '#2D9CDB', fontWeight: 600 }}>{row.premium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pricing Card */}
            <div style={{
              margin: '0 24px 20px',
              padding: '24px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(79,172,254,0.25)',
              color: '#fff',
            }}>
              <h3 style={{
                margin: '0 0 8px',
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: SF_DISPLAY,
              }}>
                Premium Pricing
              </h3>
              <p style={{
                margin: '0 0 16px',
                fontSize: '14px',
                opacity: 0.9,
                fontFamily: SF,
              }}>
                Choose the plan that works for you
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', opacity: 0.9 }}>Monthly</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, fontFamily: SF_DISPLAY }}>৳250</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.8 }}>per month</p>
                </div>
                <div style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255,255,255,0.5)',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', opacity: 0.9 }}>Annual</p>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, fontFamily: SF_DISPLAY }}>৳2,400</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', opacity: 0.8 }}>save 20%</p>
                </div>
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#fff',
                  color: '#2D9CDB',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: SF,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  marginBottom: '10px',
                }}
              >
                Start 7-Day Free Trial
              </button>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  // Show success toast (no-op for demo)
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: SF,
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                }}
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
