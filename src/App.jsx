/**
 * Wally – Root Application Shell
 *
 * Responsive app frame optimized for 864×1415 portrait screen.
 * Renders the iOS-style status bar, the active page (resolved from context),
 * the persistent bottom nav, any open modals, and a developer account-switcher.
 */

import React, { useState, useEffect, useRef } from 'react';
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
import AllTransactions        from './components/transactions/AllTransactions';
import ProfilePage            from './components/profile/ProfilePage';

// ── Shared layout & overlays ─────────────────────────────────────────────────
import BottomNav               from './components/layout/BottomNav';
import TransactionModal        from './components/transaction/TransactionModal';
import TransactionDetailModal  from './components/transaction/TransactionDetailModal';
import NotificationsPanel      from './components/notifications/NotificationsPanel';
import YearInReview            from './components/yearinreview/YearInReview';

// ─── SMS notification simulation (Pro only, triggered by Ctrl+Shift+X) ──
const SMS_CSS = `
@keyframes smsSlideIn {
  0%   { transform: translateX(-50%) translateY(-110%); opacity: 0; }
  14%  { transform: translateX(-50%) translateY(0);     opacity: 1; }
  80%  { transform: translateX(-50%) translateY(0);     opacity: 1; }
  100% { transform: translateX(-50%) translateY(-110%); opacity: 0; }
}`;
function injectSmsCss() {
  if (document.getElementById('wally-sms-css')) return;
  const s          = document.createElement('style');
  s.id             = 'wally-sms-css';
  s.textContent    = SMS_CSS;
  document.head.appendChild(s);
}

const SMS_POOL = [
  { sender: 'CITY BANK', merchant: 'NANDOS GULSHAN DHAKA',    displayMerchant: "Nando's Gulshan",  amount: 1850, category: 'Food & Dining',   accountId: 'sarah-city-cc',  cardFull: '542612**2244', helpline: '16217' },
  { sender: 'CITY BANK', merchant: 'DARAZ BANGLADESH DHAKA',  displayMerchant: 'Daraz Bangladesh', amount: 4200, category: 'Shopping',        accountId: 'sarah-city-cc',  cardFull: '542612**2244', helpline: '16217' },
  { sender: 'BRAC BANK', merchant: 'UBER DHAKA RIDE',         displayMerchant: 'Uber Dhaka',       amount: 380,  category: 'Transportation', accountId: 'sarah-brac-cc', cardFull: '677834**5566', helpline: '16010' },
  { sender: 'BRAC BANK', merchant: 'STAR CINEPLEX DHAKA',     displayMerchant: 'Star Cineplex',    amount: 800,  category: 'Entertainment',  accountId: 'sarah-brac-cc', cardFull: '677834**5566', helpline: '16010' },
  { sender: 'CITY BANK', merchant: 'AGORA SUPERMARKET DHAKA', displayMerchant: 'Agora Supermarket',amount: 2950, category: 'Food & Dining',   accountId: 'sarah-city-cc',  cardFull: '542612**2244', helpline: '16217' },
];

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
  const { screen, showModal, showYearInReview, user, accounts, budgets, addTransaction, updateAccountBalance, editBudget } = useApp();

  // ── SMS notification simulation ─────────────────────────────────────────
  const [smsNotif, setSmsNotif]   = useState(null);
  const smsActiveRef              = useRef(false);
  const smsIdxRef                 = useRef(0);
  const smsTimerRef               = useRef(null);

  injectSmsCss();

  // reset when user switches
  useEffect(() => {
    if (smsTimerRef.current) { clearTimeout(smsTimerRef.current); smsTimerRef.current = null; }
    setSmsNotif(null);
    smsActiveRef.current = false;
  }, [user]);

  // Ctrl+Shift+X → fire next SMS from pool
  useEffect(() => {
    function onKey(e) {
      if (!(e.ctrlKey && e.shiftKey && e.key === 'X')) return;
      e.preventDefault();
      if (user !== 'sarah' || smsActiveRef.current) return;
      smsActiveRef.current = true;

      const spec    = SMS_POOL[smsIdxRef.current % SMS_POOL.length];
      smsIdxRef.current++;

      const card    = accounts.find(a => a.id === spec.accountId);
      const owed    = card ? Math.abs(card.balance) : 0;
      const newOwed = owed + spec.amount;
      const avail   = (card?.creditLimit || 0) - newOwed;

      const now     = new Date();
      const pad     = n => String(n).padStart(2, '0');
      const h12     = now.getHours() % 12 || 12;
      const ampm    = now.getHours() >= 12 ? 'PM' : 'AM';
      const timeStr = `${pad(h12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${ampm}`;

      const text = `${spec.sender}: Purchase txn BDT ${spec.amount} from ${spec.merchant}. Card ${spec.cardFull} on 04-Feb-26 ${timeStr} BST. Avail Bal: BDT ${avail}.00. ${spec.sender} Helpline ${spec.helpline}`;

      setSmsNotif({ text, sender: spec.sender, spec, newOwed });

      smsTimerRef.current = setTimeout(() => {
        addTransaction({ date: '2026-02-04', merchant: spec.displayMerchant, amount: spec.amount, type: 'expense', category: spec.category, account: spec.accountId });
        updateAccountBalance(spec.accountId, -newOwed);
        const matchBudget = budgets.find(b => b.category === spec.category);
        if (matchBudget) editBudget(matchBudget.id, { spent: matchBudget.spent + spec.amount });
        setSmsNotif(null);
        smsActiveRef.current = false;
        smsTimerRef.current  = null;
      }, 3000);
    }

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (smsTimerRef.current) clearTimeout(smsTimerRef.current);
    };
  }, [user, accounts, budgets, addTransaction, updateAccountBalance, editBudget]);

  // tap-to-dismiss fires the transaction immediately
  function dismissSms() {
    if (smsTimerRef.current) { clearTimeout(smsTimerRef.current); smsTimerRef.current = null; }
    if (smsNotif) {
      const { spec, newOwed } = smsNotif;
      addTransaction({ date: '2026-02-04', merchant: spec.displayMerchant, amount: spec.amount, type: 'expense', category: spec.category, account: spec.accountId });
      updateAccountBalance(spec.accountId, -newOwed);
      const matchBudget = budgets.find(b => b.category === spec.category);
      if (matchBudget) editBudget(matchBudget.id, { spent: matchBudget.spent + spec.amount });
    }
    setSmsNotif(null);
    smsActiveRef.current = false;
  }

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
    allTransactions : AllTransactions,
    profile         : ProfilePage,
  };

  const Screen = screenMap[screen] || Dashboard;

  return (
    <div
      id="app-frame"
      style={{
        display        : 'flex',
        flexDirection  : 'column',
        minHeight      : '100dvh',
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
          height         : 0,
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

      {/* ── SMS notification banner (Pro demo) ─────────────────────────────── */}
      {smsNotif && (
        <div
          onClick={dismissSms}
          style={{
            position  : 'fixed',
            top       : 0,
            left      : '50%',
            width     : '375px',
            maxWidth  : '92vw',
            zIndex    : 9999,
            animation : 'smsSlideIn 3s ease forwards',
            cursor    : 'pointer',
          }}
        >
          <div style={{
            margin         : '10px 12px',
            background     : 'rgba(22, 22, 27, 0.93)',
            borderRadius   : '16px',
            padding        : '13px 15px',
            boxShadow      : '0 6px 28px rgba(0,0,0,0.45)',
            backdropFilter : 'blur(24px)',
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Messages app icon (green speech bubble) */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="6" fill="#34C759" />
                  <path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                  {smsNotif.sender}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
                now
              </span>
            </div>
            {/* Message body – clamped to 2 lines */}
            <p style={{
              margin         : 0,
              fontSize       : '13px',
              color          : 'rgba(255,255,255,0.82)',
              lineHeight     : 1.45,
              fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
              display        : '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow       : 'hidden',
            }}>
              {smsNotif.text}
            </p>
          </div>
        </div>
      )}

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
