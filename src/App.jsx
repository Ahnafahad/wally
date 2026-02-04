/**
 * Wally – Root Application Shell
 *
 * Responsive app frame optimized for 864×1415 portrait screen.
 * Renders the iOS-style status bar, the active page (resolved from context),
 * the persistent bottom nav, any open modals, and a developer account-switcher.
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './AppContext';

// ── Page-level routes ────────────────────────────────────────────────────────
import Dashboard              from './components/dashboard/Dashboard';
import BudgetPage             from './components/budget/BudgetPage';
import GoalsPage              from './components/goals/GoalsPage';
import CoachPage              from './components/coach/CoachPage';
import ReportsPage            from './components/reports/ReportsPage';
import AccountDetail          from './components/account/AccountDetail';
import LinkAccountPage        from './components/account/LinkAccountPage';
import FinancialScoreDetail   from './components/financialScore/FinancialScoreDetail';

// ── Shared layout & overlays ─────────────────────────────────────────────────
import BottomNav               from './components/layout/BottomNav';
import TransactionModal        from './components/transaction/TransactionModal';
import TransactionDetailModal  from './components/transaction/TransactionDetailModal';
import NotificationsPanel      from './components/notifications/NotificationsPanel';
import YearInReview            from './components/yearinreview/YearInReview';

// ─── Entry point ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

// ─── Shell layout ────────────────────────────────────────────────────────────
function AppShell() {
  const { screen, showModal, showYearInReview } = useApp();

  // Route table – map screen keys to page components
  const screenMap = {
    dashboard       : Dashboard,
    budget          : BudgetPage,
    goals           : GoalsPage,
    coach           : CoachPage,
    reports         : ReportsPage,
    account         : AccountDetail,
    linkAccount     : LinkAccountPage,
    financialScore  : FinancialScoreDetail,
    allTransactions : Dashboard, // TODO: Create dedicated AllTransactions page
  };

  const Screen = screenMap[screen] || Dashboard;

  return (
    <div
      id="app-frame"
      style={{
        display        : 'flex',
        flexDirection  : 'column',
        minHeight      : '100vh',
        width          : '100%',
        position       : 'relative',
        overflow       : 'hidden',
        boxSizing      : 'border-box',
      }}
    >
      {/* ── iOS Status Bar (always visible at the very top) ──────────────── */}
      <StatusBar />

      {/* ── Main scrollable content area ──────────────────────────────────── */}
      <div
        className="scroll-hide"
        style={{
          flex           : 1,
          overflowY      : 'auto',
          background     : '#F5F7FA',
          maxWidth       : '864px',
          margin         : '0 auto',
          width          : '100%',
        }}
      >
        <Screen />
      </div>

      {/* ── Bottom Navigation (fixed to the bottom of the frame) ─────────── */}
      <BottomNav />

      {/* ── Modal / overlay layer ─────────────────────────────────────────── */}
      {showModal === 'transaction'       && <TransactionModal />}
      {showModal === 'transactionDetail' && <TransactionDetailModal />}
      {showModal === 'notifications'     && <NotificationsPanel />}
      {showYearInReview                  && <YearInReview />}

      {/* ── Developer account switcher (subtle, bottom-right) ─────────────── */}
      <DevSwitcher />
    </div>
  );
}

// ─── iOS-style Status Bar ────────────────────────────────────────────────────
function StatusBar() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div
      style={{
        display        : 'flex',
        justifyContent : 'space-between',
        alignItems     : 'center',
        paddingTop     : '12px',
        paddingBottom  : '4px',
        paddingLeft    : 'clamp(16px, 2.5vw, 24px)',
        paddingRight   : 'clamp(16px, 2.5vw, 24px)',
        background     : '#fff',
        flexShrink     : 0,
        zIndex         : 10,
        maxWidth       : '864px',
        margin         : '0 auto',
        width          : '100%',
        boxSizing      : 'border-box',
      }}
    >
      {/* Left – time */}
      <span style={{ fontSize: '12px', fontWeight: 700, color: '#000', fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {timeString}
      </span>

      {/* Right – signal / wifi / battery icons (inline SVG micro-icons) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <rect x="0"  y="8"  width="3" height="4"  rx="0.8" fill="#000" />
          <rect x="4"  y="5"  width="3" height="7"  rx="0.8" fill="#000" />
          <rect x="8"  y="2"  width="3" height="10" rx="0.8" fill="#000" />
          <rect x="12" y="0"  width="3" height="12" rx="0.8" fill="#000" opacity="0.35" />
        </svg>

        {/* Wi-Fi arcs */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
          <path d="M7 10a1.2 1.2 0 1 1 0 2.4A1.2 1.2 0 0 1 7 10z" fill="#000" />
          <path d="M4.5 8.2a3.5 3.5 0 0 1 5 0" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2.5 6a6.5 6.5 0 0 1 9 0" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M0.8 3.8a9.2 9.2 0 0 1 12.4 0" stroke="#000" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
        </svg>

        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          {/* Outer shell */}
          <rect x="0.5"  y="0.5"  width="21" height="11" rx="2.5" stroke="#000" strokeWidth="1" />
          {/* Nub */}
          <rect x="22"   y="3.5"  width="2"  height="5"  rx="1"   fill="#000" />
          {/* Fill – ~85 % */}
          <rect x="2"    y="2"    width="15" height="8"  rx="1.5" fill="#000" />
        </svg>
      </div>
    </div>
  );
}

// ─── Developer Account Switcher ──────────────────────────────────────────────
function DevSwitcher() {
  const { user, switchUser } = useApp();
  const [open, setOpen]      = useState(false);

  return (
    <>
      {/* Gear trigger – sits in the bottom-right corner, very subtle */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          position       : 'absolute',
          bottom         : '80px',
          right          : '8px',
          zIndex         : 50,
          opacity        : 0.25,
          background     : 'none',
          border         : 'none',
          cursor         : 'pointer',
          padding        : '4px',
          lineHeight     : 1,
        }}
        aria-label="Developer switcher"
      >
        {/* Gear SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      {/* Floating panel */}
      {open && (
        <div
          style={{
            position       : 'absolute',
            bottom         : '104px',
            right          : '12px',
            zIndex         : 51,
            background     : '#fff',
            borderRadius   : '12px',
            boxShadow      : '0 4px 20px rgba(0,0,0,0.15)',
            padding        : '10px',
            display        : 'flex',
            flexDirection  : 'column',
            gap            : '6px',
            minWidth       : '140px',
          }}
        >
          {/* Label */}
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
            Switch Account
          </div>

          {/* Free (Rafiq) */}
          <button
            onClick={() => { switchUser('rafiq'); setOpen(false); }}
            style={{
              padding        : '8px 12px',
              borderRadius   : '8px',
              border         : 'none',
              cursor         : 'pointer',
              fontSize       : '13px',
              fontWeight     : 600,
              fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
              background     : user === 'rafiq' ? '#2D9CDB' : '#F2F2F7',
              color          : user === 'rafiq' ? '#fff'    : '#1C1C1E',
              transition     : 'background 0.15s, color 0.15s',
            }}
          >
            Free (Rafiq)
          </button>

          {/* Pro (Sarah) */}
          <button
            onClick={() => { switchUser('sarah'); setOpen(false); }}
            style={{
              padding        : '8px 12px',
              borderRadius   : '8px',
              border         : 'none',
              cursor         : 'pointer',
              fontSize       : '13px',
              fontWeight     : 600,
              fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
              background     : user === 'sarah' ? '#2D9CDB' : '#F2F2F7',
              color          : user === 'sarah' ? '#fff'    : '#1C1C1E',
              transition     : 'background 0.15s, color 0.15s',
            }}
          >
            Pro (Sarah)
          </button>
        </div>
      )}
    </>
  );
}
