/**
 * Wally – Application Context
 *
 * Single source of truth for every page.  Wraps all seed data imports,
 * exposes derived state, and provides mutation helpers via React Context.
 */

import React, { createContext, useContext, useState } from 'react';

// ─── Seed data ───────────────────────────────────────────────────────────────
import rafiqAccounts     from './data/accounts/rafiq';
import sarahAccounts     from './data/accounts/sarah';
import rafiqBudgets      from './data/budgets/rafiq';
import sarahBudgets      from './data/budgets/sarah';
import rafiqGoals        from './data/goals/rafiq';
import sarahGoals        from './data/goals/sarah';
import rafiqTransactions from './data/transactions/rafiq';
import sarahTransactions from './data/transactions/sarah';
import notifications     from './data/notifications';
import reportData        from './data/reports';
import ads               from './data/ads';
import { rafiqResponses, sarahResponses } from './data/aiResponses';

// ─── Context object ──────────────────────────────────────────────────────────
const AppContext = createContext();

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Core state ─────────────────────────────────────────────────────────────
  const [user,               setUser]               = useState('rafiq');
  const [screen,             setScreen]             = useState('dashboard');
  const [selectedAccount,    setSelectedAccount]    = useState(null);
  const [showModal,          setShowModal]          = useState(null);       // 'transaction' | 'notifications'
  const [showYearInReview,   setShowYearInReview]   = useState(false);
  const [notifs,             setNotifs]             = useState(notifications);
  const [txnData,            setTxnData]            = useState({ rafiq: rafiqTransactions, sarah: sarahTransactions });
  const [goalData,           setGoalData]           = useState({ rafiq: rafiqGoals, sarah: sarahGoals });
  const [aiQuestionsLeft,    setAiQuestionsLeft]    = useState(2);
  const [chatHistory,        setChatHistory]        = useState([
    { role: 'ai', text: 'Hi! I am your AI Financial Coach. I analyze your spending, budgets, and goals to help you make smarter money decisions. What would you like to know?' }
  ]);
  const [currentAdIndex,     setCurrentAdIndex]     = useState(0);
  const [budgetData,         setBudgetData]         = useState({ rafiq: rafiqBudgets, sarah: sarahBudgets });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // ── Derived state ─────────────────────────────────────────────────────────
  const isPro          = user === 'sarah';
  const accounts       = isPro ? sarahAccounts       : rafiqAccounts;
  const budgets        = budgetData[user];
  const goals          = goalData[user];
  const transactions   = txnData[user];
  const aiData         = isPro ? sarahResponses      : rafiqResponses;
  const unreadCount    = notifs.filter(n => !n.isRead).length;

  // ── Navigation ────────────────────────────────────────────────────────────
  function navigate(screenName, params = {}) {
    if (params.account !== undefined) {
      setSelectedAccount(params.account);
    }
    setScreen(screenName);
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal(type)  { setShowModal(type); }
  function closeModal()     { setShowModal(null); }

  // ── Transactions ──────────────────────────────────────────────────────────
  function addTransaction(txn) {
    const newTxn = {
      ...txn,
      id: user + '-new-' + Date.now(),
    };

    setTxnData(prev => ({
      ...prev,
      [user]: [newTxn, ...prev[user]],
    }));
  }

  // ── Notifications ────────────────────────────────────────────────────────
  function markNotificationRead(id) {
    setNotifs(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  }

  // ── AI Coach ─────────────────────────────────────────────────────────────
  function useAiQuestion() {
    if (!isPro && aiQuestionsLeft > 0) {
      setAiQuestionsLeft(prev => prev - 1);
    }
  }

  // ── Goals ─────────────────────────────────────────────────────────────────
  function addGoalContribution(goalId, amount) {
    setGoalData(prev => ({
      ...prev,
      [user]: prev[user].map(g => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
          contributions: [
            ...(g.contributions || []),
            { date: '2026-02-04', amount },
          ],
        };
      }),
    }));
  }

  // ── Budgets ───────────────────────────────────────────────────────────────
  function addBudget(budget) {
    setBudgetData(prev => ({
      ...prev,
      [user]: [...prev[user], budget],
    }));
  }

  // ── Add Goal ──────────────────────────────────────────────────────────────
  function addGoal(goal) {
    setGoalData(prev => ({
      ...prev,
      [user]: [...prev[user], { ...goal, id: 'goal-new-' + Date.now() }],
    }));
  }

  // ── Edit Transaction ──────────────────────────────────────────────────────
  function editTransaction(id, updates) {
    setTxnData(prev => ({
      ...prev,
      [user]: prev[user].map(t => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }

  // ── User switching (dev helper) ───────────────────────────────────────────
  function switchUser(newUser) {
    setUser(newUser);
    setScreen('dashboard');
    setSelectedAccount(null);
    setShowModal(null);
    setShowYearInReview(false);
    setSelectedTransaction(null);
    setChatHistory([
      { role: 'ai', text: 'Hi! I am your AI Financial Coach. I analyze your spending, budgets, and goals to help you make smarter money decisions. What would you like to know?' }
    ]);
    setAiQuestionsLeft(2);
  }

  // ── Context value ─────────────────────────────────────────────────────────
  const value = {
    // state
    user,
    screen,
    selectedAccount,
    showModal,
    showYearInReview,
    setShowYearInReview,
    notifs,
    txnData,
    goalData,
    aiQuestionsLeft,
    chatHistory,
    setChatHistory,
    currentAdIndex,
    setCurrentAdIndex,
    selectedTransaction,
    setSelectedTransaction,

    // derived
    isPro,
    accounts,
    budgets,
    goals,
    transactions,
    aiData,
    unreadCount,

    // static data (passed through so pages don't import directly)
    reportData,
    ads,

    // functions
    navigate,
    openModal,
    closeModal,
    addTransaction,
    editTransaction,
    markNotificationRead,
    markAllRead,
    useAiQuestion,
    addGoalContribution,
    addGoal,
    addBudget,
    switchUser,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useApp() {
  return useContext(AppContext);
}
