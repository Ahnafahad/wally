const notifications = [
  // Today
  { id: 'n-1', type: 'budget_alert', title: 'Entertainment Budget Warning', message: 'You\'ve used 93% of your Entertainment budget this month.', time: 'Today, 9:15 AM', isRead: false, route: '/budgets', icon: '⚡' },
  { id: 'n-2', type: 'sync', title: 'Accounts Synced', message: 'All 8 accounts synced successfully.', time: 'Today, 8:00 AM', isRead: true, route: null, icon: '✓' },
  // Yesterday
  { id: 'n-3', type: 'goal', title: 'Goal Milestone!', message: 'Your Emergency Fund reached ৳ 70,000 — 58% of target!', time: 'Yesterday, 3:30 PM', isRead: false, route: '/goals', icon: '🎯' },
  { id: 'n-4', type: 'credit_card', title: 'City Bank Visa Due Soon', message: 'Payment of ৳ 2,240 due on Feb 15. Don\'t miss it!', time: 'Yesterday, 12:00 PM', isRead: false, route: '/account/rafiq-city-cc', icon: '💳' },
  { id: 'n-5', type: 'transaction', title: 'Large Transaction', message: 'A transaction of ৳ 28,000 was made at Transcom Digital.', time: 'Yesterday, 10:45 AM', isRead: true, route: null, icon: '💰' },
  // This week
  { id: 'n-6', type: 'ai', title: 'AI Insight Ready', message: 'I found a way to save ৳ 3,200/month on your rides. Check it out!', time: 'Mon, 2:00 PM', isRead: false, route: '/coach', icon: '🤖' },
  { id: 'n-7', type: 'budget_alert', title: 'Shopping Budget 70%', message: 'Shopping budget is at 70%. Be mindful of weekend purchases.', time: 'Mon, 11:00 AM', isRead: true, route: '/budgets', icon: '🛍️' },
  { id: 'n-8', type: 'goal', title: 'Goal Contribution Reminder', message: 'Time to contribute to your Laptop fund this month.', time: 'Sun, 9:00 AM', isRead: true, route: '/goals', icon: '💻' },
  // Earlier
  { id: 'n-9', type: 'sync', title: 'New Account Connected', message: 'BRAC Bank Mastercard has been successfully linked.', time: 'Jan 25', isRead: true, route: null, icon: '🔗' },
  { id: 'n-10', type: 'transaction', title: 'Salary Deposited', message: '৳ 70,000 salary received in BRAC Bank.', time: 'Jan 25', isRead: true, route: null, icon: '💵' },
  { id: 'n-11', type: 'ai', title: 'Monthly Report Ready', message: 'Your January spending report is ready. Total: ৳ 26,900.', time: 'Jan 24', isRead: true, route: '/reports', icon: '📊' },
  { id: 'n-12', type: 'credit_card', title: 'Statement Generated', message: 'BRAC Bank Mastercard statement for January is ready.', time: 'Jan 20', isRead: true, route: '/account/rafiq-brac-cc', icon: '📄' },
  { id: 'n-13', type: 'goal', title: 'Emergency Fund Update', message: 'Monthly contribution of ৳ 5,000 recorded successfully.', time: 'Jan 6', isRead: true, route: '/goals', icon: '🛡️' },
  { id: 'n-14', type: 'budget_alert', title: 'January Budget Exceeded', message: 'Food & Dining budget exceeded by ৳ 1,200 in January.', time: 'Feb 1', isRead: true, route: '/budgets', icon: '⚠️' },
  { id: 'n-15', type: 'transaction', title: 'Transfer Received', message: '৳ 3,000 received via bKash from a friend.', time: 'Jan 30', isRead: true, route: null, icon: '📲' },
];

export default notifications;
