/**
 * Wally – Application Context
 *
 * Single source of truth for every page.  Wraps all seed data imports,
 * exposes derived state, and provides mutation helpers via React Context.
 */

import React, { createContext, useContext, useState } from 'react';

// ─── Seed data ───────────────────────────────────────────────────────────────
import rafiqAccounts from './data/accounts/rafiq';
import sarahAccounts from './data/accounts/sarah';
import rafiqBudgets from './data/budgets/rafiq';
import sarahBudgets from './data/budgets/sarah';
import rafiqGoals from './data/goals/rafiq';
import sarahGoals from './data/goals/sarah';
import rafiqTransactions from './data/transactions/rafiq';
import sarahTransactions from './data/transactions/sarah';
import notifications from './data/notifications';
import reportData from './data/reports';
import ads from './data/ads';
import { rafiqResponses, sarahResponses } from './data/aiResponses';

// ─── Helpers ─────────────────────────────────────────────────────────────────
import { getLogoUrl } from './utils/brandMapping';

// Helper to enrich transactions with logo property
const enrich = (txns) => txns.map(t => ({ ...t, logo: getLogoUrl(t.merchant) }));

// ─── Context object ──────────────────────────────────────────────────────────
const AppContext = createContext();

// ─── Provider ────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Core state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState('rafiq');
  const [screen, setScreen] = useState('dashboard');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showModal, setShowModal] = useState(null);       // 'transaction' | 'notifications'
  const [showYearInReview, setShowYearInReview] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const [txnData, setTxnData] = useState({
    rafiq: enrich(rafiqTransactions),
    sarah: enrich(sarahTransactions)
  });
  const [goalData, setGoalData] = useState({ rafiq: rafiqGoals, sarah: sarahGoals });
  const [aiQuestionsLeft, setAiQuestionsLeft] = useState(20);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I am your AI Financial Coach. I analyze your spending, budgets, and goals to help you make smarter money decisions. What would you like to know?' }
  ]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [budgetData, setBudgetData] = useState({ rafiq: rafiqBudgets, sarah: sarahBudgets });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [accountData, setAccountData] = useState({ rafiq: rafiqAccounts, sarah: sarahAccounts });
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [pendingCoachPrompt, setPendingCoachPrompt] = useState(null);
  const [txnFilter, setTxnFilter] = useState(null);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  // ── Derived state ─────────────────────────────────────────────────────────
  const isPro = user === 'sarah';
  const accounts = accountData[user];
  const budgets = budgetData[user];
  const goals = goalData[user];
  const transactions = txnData[user];
  const aiData = isPro ? sarahResponses : rafiqResponses;
  const unreadCount = notifs.filter(n => !n.isRead).length;

  // ── Navigation ────────────────────────────────────────────────────────────
  function navigate(screenName, params = {}) {
    if (params.account !== undefined) {
      setSelectedAccount(params.account);
    }
    if (params.txnFilter !== undefined) {
      setTxnFilter(params.txnFilter);
    }
    if (params.selectedGoal !== undefined) {
      setSelectedGoalId(params.selectedGoal?.id || null);
    }
    setScreen(screenName);
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal(type) { setShowModal(type); }
  function closeModal() { setShowModal(null); }

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

  // ── Update Account Balance ────────────────────────────────────────────────
  function updateAccountBalance(accountId, newBalance) {
    setAccountData(prev => ({
      ...prev,
      [user]: prev[user].map(acc =>
        acc.id === accountId ? { ...acc, balance: newBalance } : acc
      ),
    }));
  }

  // ── Edit Budget ───────────────────────────────────────────────────────────
  function editBudget(budgetId, updates) {
    setBudgetData(prev => ({
      ...prev,
      [user]: prev[user].map(b =>
        b.id === budgetId ? { ...b, ...updates } : b
      ),
    }));
  }

  // ── Delete Budget ─────────────────────────────────────────────────────────
  function deleteBudget(budgetId) {
    setBudgetData(prev => ({
      ...prev,
      [user]: prev[user].filter(b => b.id !== budgetId),
    }));
  }

  // ── Get Account Commitments ───────────────────────────────────────────────
  function getAccountCommitments(accountId) {
    const linkedGoals = goals.filter(g => g.accountId === accountId);
    const totalCommitted = linkedGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    return { linkedGoals, totalCommitted };
  }

  // ── User switching (dev helper) ───────────────────────────────────────────
  function switchUser(newUser) {
    setUser(newUser);
    setScreen('dashboard');
    setSelectedAccount(null);
    setShowModal(null);
    setShowYearInReview(false);
    setSelectedTransaction(null);
    setPendingTransaction(null);
    setTxnFilter(null);
    setSelectedGoalId(null);
    setChatHistory([
      { role: 'ai', text: 'Hi! I am your AI Financial Coach. I analyze your spending, budgets, and goals to help you make smarter money decisions. What would you like to know?' }
    ]);
    setAiQuestionsLeft(20);
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
    pendingTransaction,
    setPendingTransaction,
    pendingCoachPrompt,
    setPendingCoachPrompt,
    txnFilter,
    setTxnFilter,
    selectedGoalId,
    setSelectedGoalId,

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
    editBudget,
    deleteBudget,
    updateAccountBalance,
    getAccountCommitments,
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
