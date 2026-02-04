/**
 * Wally – Link Account Page
 *
 * Multi-step account linking flow: type selection → bank selection →
 * auth form → connecting animation → success screen.
 */

import React, { useState, useEffect } from 'react';
import { useApp }       from '../../AppContext';
import { ChevronLeft, Search } from '../shared/Icons';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// ─── CSS injection (spinner keyframes) ───────────────────────────────────────
const SPINNER_CSS = `
@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
function injectSpinnerCSS() {
  if (document.getElementById('wally-link-spinner-css')) return;
  const tag = document.createElement('style');
  tag.id = 'wally-link-spinner-css';
  tag.textContent = SPINNER_CSS;
  document.head.appendChild(tag);
}

// ─── Banks list ──────────────────────────────────────────────────────────────
const BANKS = [
  { name: 'BRAC Bank', abbr: 'BR', color: '#0066B2' },
  { name: 'Dutch-Bangla', abbr: 'DB', color: '#ED1C24' },
  { name: 'City Bank', abbr: 'CT', color: '#006B3D' },
  { name: 'Mutual Trust', abbr: 'MT', color: '#003DA5' },
  { name: 'Eastern Bank', abbr: 'EB', color: '#006747' },
  { name: 'Islami Bank', abbr: 'IB', color: '#00A651' },
  { name: 'Sonali Bank', abbr: 'SB', color: '#0072CE' },
  { name: 'Grameen Bank', abbr: 'GB', color: '#00A99D' },
  { name: 'Bank Asia', abbr: 'BA', color: '#E31937' },
  { name: 'UCB', abbr: 'UC', color: '#005EB8' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function LinkAccountPage() {
  const { navigate } = useApp();

  // ── State ─────────────────────────────────────────────────────────────────
  const [step,         setStep]         = useState('type');  // 'type' | 'bank' | 'auth' | 'connecting' | 'success'
  const [selectedType, setSelectedType] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchQ,      setSearchQ]      = useState('');
  const [accountNum,   setAccountNum]   = useState('');
  const [pin,          setPin]          = useState('');

  // ── Auto-advance from connecting to success ──────────────────────────────
  useEffect(() => {
    if (step === 'connecting') {
      injectSpinnerCSS();
      const t = setTimeout(() => setStep('success'), 2000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // ── Filtered banks ────────────────────────────────────────────────────────
  const filtered = searchQ
    ? BANKS.filter(b => b.name.toLowerCase().includes(searchQ.toLowerCase()))
    : BANKS;

  // ─── Render ───────────────────────────────────────────────────────────────
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
        <button
          onClick={() => {
            if (step === 'type') {
              navigate('account');
            } else if (step === 'bank') {
              setStep('type');
            } else if (step === 'auth') {
              setStep('bank');
            } else {
              navigate('account');
            }
          }}
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
          <ChevronLeft size={24} color="var(--cyan-primary)" strokeWidth={2.2} />
        </button>

        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: SF_DISPLAY,
          letterSpacing: '-0.02em',
        }}>
          {step === 'type' ? 'Link Account' :
           step === 'bank' ? 'Select Bank' :
           step === 'auth' ? 'Verify Identity' :
           step === 'connecting' ? 'Connecting...' : 'Success!'}
        </span>

        <div style={{ width: '40px' }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: TYPE SELECTION
          ══════════════════════════════════════════════════════════════════════ */}
      {step === 'type' && (
        <div style={{ padding: '24px' }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--gray-500)',
            fontFamily: SF,
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 500,
          }}>
            Choose account type to link
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { icon: '🏦', label: 'Bank' },
              { icon: '📱', label: 'Mobile Financial' },
              { icon: '💳', label: 'Credit Card' },
              { icon: '💵', label: 'Cash' },
            ].map((type) => (
              <button
                key={type.label}
                onClick={() => {
                  setSelectedType(type.label);
                  if (type.label === 'Cash') {
                    setSelectedBank({ name: 'Cash', abbr: 'CA', color: '#8E8E93' });
                    setStep('auth');
                  } else {
                    setStep('bank');
                  }
                }}
                style={{
                  display        : 'flex',
                  flexDirection  : 'column',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  gap            : '12px',
                  padding        : '32px 20px',
                  borderRadius   : 'var(--radius-lg)',
                  border         : '1px solid var(--gray-200)',
                  backgroundColor: 'var(--white)',
                  cursor         : 'pointer',
                  boxShadow      : 'var(--shadow-card)',
                  transition     : 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                }}
              >
                <span style={{ fontSize: '48px' }}>{type.icon}</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--gray-900)',
                  fontFamily: SF,
                  textAlign: 'center',
                  letterSpacing: '-0.01em',
                }}>
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: BANK SELECTION
          ══════════════════════════════════════════════════════════════════════ */}
      {step === 'bank' && (
        <div style={{ padding: '20px' }}>
          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <Search size={18} color="#8E8E93" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Search banks..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              style={{
                width          : '100%',
                padding        : '10px 12px 10px 38px',
                borderRadius   : '10px',
                border         : '1px solid #E8E8E8',
                fontSize       : '14px',
                color          : '#1C1C1E',
                fontFamily     : SF,
                backgroundColor: '#FAFAFA',
                boxSizing      : 'border-box',
              }}
            />
          </div>

          {/* Bank grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {filtered.map((bank) => (
              <button
                key={bank.name}
                onClick={() => {
                  setSelectedBank(bank);
                  setStep('auth');
                }}
                style={{
                  display        : 'flex',
                  flexDirection  : 'column',
                  alignItems     : 'center',
                  justifyContent : 'center',
                  gap            : '8px',
                  padding        : '20px 12px',
                  borderRadius   : '14px',
                  border         : '1px solid #E8E8E8',
                  backgroundColor: '#F9FAFB',
                  cursor         : 'pointer',
                  boxShadow      : '0 1px 3px rgba(0,0,0,0.06)',
                  transition     : 'all 0.15s',
                }}
              >
                <div
                  style={{
                    width          : '48px',
                    height         : '48px',
                    borderRadius   : '50%',
                    backgroundColor: bank.color,
                    display        : 'flex',
                    alignItems     : 'center',
                    justifyContent : 'center',
                    fontSize       : '18px',
                    fontWeight     : 700,
                    color          : '#FFFFFF',
                    fontFamily     : SF_DISPLAY,
                  }}
                >
                  {bank.abbr}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF, textAlign: 'center' }}>
                  {bank.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: AUTH FORM
          ══════════════════════════════════════════════════════════════════════ */}
      {step === 'auth' && selectedBank && (
        <div style={{ padding: '20px' }}>
          {/* Bank badge */}
          <div
            style={{
              display        : 'inline-flex',
              alignItems     : 'center',
              gap            : '8px',
              backgroundColor: selectedBank.color + '1A',
              borderRadius   : '20px',
              padding        : '6px 14px',
              marginBottom   : '20px',
            }}
          >
            <div
              style={{
                width          : '24px',
                height         : '24px',
                borderRadius   : '50%',
                backgroundColor: selectedBank.color,
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
                fontSize       : '11px',
                fontWeight     : 700,
                color          : '#FFFFFF',
                fontFamily     : SF_DISPLAY,
              }}
            >
              {selectedBank.abbr}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: selectedBank.color, fontFamily: SF }}>
              {selectedBank.name}
            </span>
          </div>

          {/* Account Number */}
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
            Account Number
          </label>
          <input
            type="text"
            placeholder="e.g. 1234567890"
            value={accountNum}
            onChange={(e) => setAccountNum(e.target.value)}
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

          {/* PIN */}
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#8E8E93', fontFamily: SF, display: 'block', marginBottom: '6px' }}>
            4-digit PIN
          </label>
          <input
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={4}
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
              marginBottom   : '20px',
            }}
          />

          {/* Authorize button */}
          <button
            onClick={() => setStep('connecting')}
            style={{
              width          : '100%',
              padding        : '14px',
              borderRadius   : 'var(--radius-md)',
              border         : 'none',
              background     : 'linear-gradient(135deg, var(--cyan-primary), var(--cyan-dark))',
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
            Authorize
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: CONNECTING
          ══════════════════════════════════════════════════════════════════════ */}
      {step === 'connecting' && selectedBank && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
          {/* Spinner */}
          <div
            style={{
              width          : '60px',
              height         : '60px',
              borderRadius   : '50%',
              border         : '4px solid #E8E8E8',
              borderTopColor : '#2D9CDB',
              animation      : 'spin 0.8s linear infinite',
              marginBottom   : '20px',
            }}
          />
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#1C1C1E', fontFamily: SF, margin: 0 }}>
            Connecting to {selectedBank.name}...
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          STEP: SUCCESS
          ══════════════════════════════════════════════════════════════════════ */}
      {step === 'success' && selectedBank && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
          {/* Checkmark circle */}
          <div
            style={{
              width          : '80px',
              height         : '80px',
              borderRadius   : '50%',
              backgroundColor: '#34C759',
              display        : 'flex',
              alignItems     : 'center',
              justifyContent : 'center',
              fontSize       : '40px',
              color          : '#FFFFFF',
              marginBottom   : '20px',
            }}
          >
            ✓
          </div>

          <p style={{ fontSize: '20px', fontWeight: 700, color: '#1C1C1E', fontFamily: SF_DISPLAY, margin: '0 0 8px' }}>
            Successfully linked!
          </p>
          <p style={{ fontSize: '14px', color: '#8E8E93', fontFamily: SF, margin: '0 0 32px' }}>
            {selectedBank.name}
          </p>

          {/* Go to Dashboard button */}
          <button
            onClick={() => navigate('dashboard')}
            style={{
              width          : '100%',
              maxWidth       : '280px',
              padding        : '14px',
              borderRadius   : '12px',
              border         : 'none',
              background     : 'linear-gradient(135deg, #2D9CDB, #2E8DB8)',
              boxShadow      : '0 4px 14px rgba(74,173,224,0.40)',
              color          : '#FFFFFF',
              fontSize       : '15px',
              fontWeight     : 600,
              fontFamily     : SF,
              cursor         : 'pointer',
            }}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
