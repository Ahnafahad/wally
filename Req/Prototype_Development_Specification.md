# Money Management App - Prototype Development Specification

**Version:** 1.0  
**Date:** February 3, 2026  
**Platform:** Mobile Web App (responsive, mobile-first design)  
**Purpose:** Investor Demo Prototype

---

## Table of Contents

1. [Overview](#overview)
2. [Prototype Architecture](#prototype-architecture)
3. [Two Account Modes](#two-account-modes)
4. [Mock Data Requirements](#mock-data-requirements)
5. [Feature-by-Feature Specifications](#feature-by-feature-specifications)
6. [Year in Review Feature](#year-in-review-feature)
7. [Advertisement System](#advertisement-system)
8. [User Interface Guidelines](#user-interface-guidelines)
9. [Development Notes](#development-notes)
10. [Important Notes](#important-notes)
11. [Conclusion](#conclusion)

---

## 1. Overview

### Purpose
This prototype is designed to demonstrate all features outlined in the PRD to potential investors. It should be fully interactive, visually polished, and contain realistic data that showcases the app's value proposition.

### Technical Approach
- **Mobile Web App**: Responsive web application optimized for mobile viewport (375x812px iPhone standard)
- **No Backend Required**: All data is pre-loaded and stored locally
- **No Real API Connections**: Simulated API responses and behaviors
- **Fully Interactive**: Users can add transactions, create budgets, ask AI questions, etc.

### Key Requirements
- Two switchable account modes (Free and Pro)
- 1 year of realistic transaction data
- Real Bangladeshi brands, banks, and merchants
- Functional AI Coach with pre-written responses (API-ready)
- Complete Year in Review feature
- Realistic targeted advertisements

---

## 2. Prototype Architecture

### Account Switcher
Create a **developer mode toggle** (accessible via a hidden gesture or button) that allows instant switching between:
- **Free Tier Account** (Rafiq's Account)
- **Pro Tier Account** (Sarah's Account)

When switching accounts, the entire app state should change including:
- Transaction history
- Account balances
- Budgets and goals
- AI coach conversations
- Reports
- Advertisement display (Free shows ads, Pro doesn't)

### Data Storage
All mock data should be structured in JSON format and loaded on app initialization. Structure:
```
/mock-data
  /rafiq-free-account
    - accounts.json
    - transactions.json
    - budgets.json
    - goals.json
    - reports.json
    - ai-responses.json
  /sarah-pro-account
    - accounts.json
    - transactions.json
    - budgets.json
    - goals.json
    - reports.json
    - ai-responses.json
```

---

## 3. Two Account Modes

### Free Tier Account (Rafiq)

**Profile:**
- Name: Rafiq Ahmed
- Age: 28
- Occupation: Software Developer
- Income: ~70,000 BDT/month
- Scenario: Young professional saving for a PS5

**Account Setup:**
- **Bank Accounts (4):**
  1. Dutch Bangla Bank (DBBL) - Savings - 85,000 BDT
  2. BRAC Bank - Salary Account - 45,000 BDT
  3. City Bank - Savings - 120,000 BDT
  4. Eastern Bank Limited (EBL) - Fixed Deposit - 200,000 BDT

- **MFS Account (1):**
  - bKash - 8,500 BDT

- **Credit Cards (2):**
  1. City Bank Gold Card - Limit: 150,000 BDT, Balance: 35,000 BDT, Due: 15th of month
  2. BRAC Bank Classic - Limit: 100,000 BDT, Balance: 18,000 BDT, Due: 20th of month

- **Cash Account:**
  - Current Balance: 5,200 BDT

**Active Goals:**
- Goal 1: Buy PS5 (Target: 85,000 BDT, Progress: 52,000 BDT, Deadline: 6 months)
- Goal 2: Emergency Fund (Target: 150,000 BDT, Progress: 95,000 BDT, Deadline: 1 year)
- Goal 3: LOCKED (shows "Upgrade to Pro for unlimited goals")

**Limitations Visible:**
- Monthly reports only
- "You have 2 questions remaining this month" banner on AI Coach
- Advertisements displayed
- Basic budgeting features
- Cannot create 3rd goal

---

### Pro Tier Account (Sarah)

**Profile:**
- Name: Sarah Khan
- Age: 32
- Occupation: Marketing Manager
- Income: ~110,000 BDT/month
- Scenario: Professional with advanced financial planning

**Account Setup:**
- **Bank Accounts (4):**
  1. Standard Chartered - Savings - 340,000 BDT
  2. HSBC - Salary Account - 78,000 BDT
  3. Mutual Trust Bank (MTB) - Savings - 225,000 BDT
  4. Dhaka Bank - Investment Account - 450,000 BDT

- **MFS Account (1):**
  - bKash - 15,000 BDT

- **Credit Cards (2):**
  1. Standard Chartered Platinum - Limit: 400,000 BDT, Balance: 85,000 BDT, Due: 10th
  2. HSBC Gold - Limit: 300,000 BDT, Balance: 42,000 BDT, Due: 25th

- **Cash Account:**
  - Current Balance: 12,000 BDT

**Active Goals:**
- Goal 1: iPhone 16 Pro Max (Target: 180,000 BDT, Progress: 145,000 BDT, Deadline: 3 months)
- Goal 2: Umrah Trip (Target: 350,000 BDT, Progress: 210,000 BDT, Deadline: 10 months)
- Goal 3: Laptop Upgrade (Target: 120,000 BDT, Progress: 80,000 BDT, Deadline: 6 months)
- Goal 4: Investment Portfolio (Target: 500,000 BDT, Progress: 320,000 BDT, Deadline: 18 months)
- Goal 5: Home Renovation Fund (Target: 800,000 BDT, Progress: 150,000 BDT, Deadline: 2 years)

**Pro Features Visible:**
- NO advertisements
- Weekly, monthly, quarterly, yearly reports
- Unlimited AI Coach questions
- Advanced budget analytics
- Financial Health Score (visible)
- Debt Payoff Planner
- Unlimited goals
- Export options available

---

## 4. Mock Data Requirements

### Transaction Data Structure
Each account should have **12 months** of transaction data (February 2025 - January 2026).

**Monthly Transaction Volume:** 25-40 transactions per month

### Transaction Categories and Realistic Merchants

#### Food & Dining (30% of transactions)
- **Restaurants:** Nando's Dhaka, Pizza Hut Gulshan, KFC Banani, Star Kabab, Khazana Restaurant
- **Groceries:** Shwapno, Meena Bazar, Agora, Unimart, Prince Bazar
- **Food Delivery:** Foodpanda, Pathao Food, HungryNaki
- **Cafes:** North End Coffee, Gloria Jean's, Coffee World

#### Transportation (20% of transactions)
- **Ride-sharing:** Uber Dhaka, Pathao, Obhai
- **Fuel:** Padma Oil, Meghna Petroleum
- **Public Transport:** DMTCL (Bus), Metro Rail Dhaka

#### Shopping (15% of transactions)
- **Retail:** Aarong, Yellow, Richman, Cats Eye, Sailor
- **Electronics:** Ryans Computers, Star Tech, Computer Village, Pickaboo
- **E-commerce:** Daraz Bangladesh, Evaly, Ajkerdeal
- **Supermarkets:** Shwapno, Meena Bazar, Agora

#### Bills & Utilities (10% of transactions)
- **Mobile:** Grameenphone, Robi, Banglalink
- **Internet:** BTCL, Carnival Internet, Amber IT
- **Electricity:** DESCO, DPDC
- **Gas:** Titas Gas

#### Entertainment (8% of transactions)
- **Movies:** Star Cineplex, Blockbuster Cinemas, Jamuna Future Park
- **Streaming:** Netflix, Spotify, YouTube Premium
- **Gaming:** PlayStation Store, Steam, Google Play Games

#### Healthcare (5% of transactions)
- **Hospitals:** Square Hospital, United Hospital, Apollo Hospital
- **Pharmacies:** Lazz Pharma, Healthcare Pharmacy, Ibn Sina
- **Lab Tests:** Popular Diagnostic, Ibn Sina Diagnostic

#### Education (4% of transactions)
- **Courses:** Udemy, Coursera, 10 Minute School
- **Books:** Boi Bichitra, Nilkhet Book Market, Rokomari.com

#### Personal Care (3% of transactions)
- **Salons:** Persona, La Belle, Farzana Shakil's
- **Gym:** Matrix Gym, Fitness Station

#### Others (5% of transactions)
- **ATM Withdrawals:** Various banks
- **Peer-to-peer transfers:** bKash Send Money, Nagad
- **Subscriptions:** Adobe Creative Cloud, Amazon Prime

### Sample Transaction Examples

**Free Tier (Rafiq) - Sample Month (December 2025):**

| Date | Merchant | Amount (BDT) | Category | Account | Type |
|------|----------|--------------|----------|---------|------|
| Dec 1 | Grameenphone Recharge | 500 | Bills | bKash | Expense |
| Dec 2 | Star Kabab, Dhanmondi | 850 | Food & Dining | City Bank Credit Card | Expense |
| Dec 3 | Pathao Ride | 180 | Transportation | bKash | Expense |
| Dec 5 | Shwapno Supermarket | 2,450 | Food & Dining | DBBL Debit | Expense |
| Dec 7 | Netflix Subscription | 1,200 | Entertainment | BRAC Bank Debit | Expense |
| Dec 8 | Star Tech - Gaming Mouse | 3,500 | Shopping | City Bank Credit Card | Expense |
| Dec 10 | Uber Ride | 320 | Transportation | bKash | Expense |
| Dec 12 | Salary Deposit | 70,000 | Income | BRAC Bank | Income |
| Dec 13 | ATM Withdrawal | 10,000 | Cash Withdrawal | BRAC Bank | Transfer |
| Dec 14 | North End Coffee | 450 | Food & Dining | Cash | Expense |
| Dec 15 | Persona Salon | 800 | Personal Care | Cash | Expense |
| Dec 16 | Daraz - PS5 Controller | 8,500 | Shopping | City Bank Credit Card | Expense |
| Dec 18 | Pizza Hut Gulshan | 1,850 | Food & Dining | BRAC Bank Debit | Expense |
| Dec 20 | DESCO Bill | 1,850 | Bills | bKash | Expense |
| Dec 22 | Ryans Computers - SSD | 5,500 | Shopping | City Bank Credit Card | Expense |
| Dec 23 | Meena Bazar | 1,200 | Food & Dining | Cash | Expense |
| Dec 25 | Star Cineplex - 2 tickets | 1,200 | Entertainment | BRAC Bank Debit | Expense |
| Dec 26 | Foodpanda Order | 950 | Food & Dining | bKash | Expense |
| Dec 27 | BTCL Internet | 1,500 | Bills | BRAC Bank Debit | Expense |
| Dec 28 | Aarong - Punjabi | 4,500 | Shopping | City Bank Credit Card | Expense |
| Dec 29 | Matrix Gym Monthly | 3,000 | Personal Care | BRAC Bank Debit | Expense |
| Dec 30 | Transfer to PS5 Goal | 10,000 | Savings | DBBL | Transfer |
| Dec 31 | KFC Banani | 1,450 | Food & Dining | Cash | Expense |

**Monthly Totals for Rafiq (Average):**
- Income: 70,000 BDT
- Expenses: 52,000 - 58,000 BDT
- Savings: 12,000 - 18,000 BDT
- Savings Rate: 17-25%

**Pro Tier (Sarah) - Sample Month (December 2025):**

| Date | Merchant | Amount (BDT) | Category | Account | Type |
|------|----------|--------------|----------|---------|------|
| Dec 1 | Robi Postpaid | 1,200 | Bills | bKash | Expense |
| Dec 3 | Nando's Gulshan | 2,800 | Food & Dining | Standard Chartered CC | Expense |
| Dec 5 | Uber Ride to Office | 450 | Transportation | bKash | Expense |
| Dec 6 | Agora Supermarket | 4,500 | Food & Dining | HSBC Debit | Expense |
| Dec 8 | Netflix Premium | 1,500 | Entertainment | Standard Chartered CC | Expense |
| Dec 9 | La Belle Salon | 3,500 | Personal Care | HSBC Debit | Expense |
| Dec 10 | Pickaboo - Apple Watch | 45,000 | Shopping | Standard Chartered CC | Expense |
| Dec 12 | Salary Deposit | 110,000 | Income | HSBC | Income |
| Dec 13 | Freelance Payment | 35,000 | Income | Standard Chartered | Income |
| Dec 14 | ATM Withdrawal | 15,000 | Cash Withdrawal | HSBC | Transfer |
| Dec 15 | Khazana Restaurant (Dinner) | 4,200 | Food & Dining | Cash | Expense |
| Dec 16 | Uber Ride | 280 | Transportation | bKash | Expense |
| Dec 17 | Coursera Subscription | 3,500 | Education | HSBC Debit | Expense |
| Dec 18 | Square Hospital Checkup | 5,000 | Healthcare | Standard Chartered CC | Expense |
| Dec 19 | Yellow - Formal Wear | 8,500 | Shopping | Standard Chartered CC | Expense |
| Dec 20 | DESCO Bill | 3,200 | Bills | bKash | Expense |
| Dec 21 | Pathao Food Order | 1,250 | Food & Dining | bKash | Expense |
| Dec 22 | Fitness Station Monthly | 5,000 | Personal Care | HSBC Debit | Expense |
| Dec 23 | Jamuna Future Park Shopping | 12,000 | Shopping | Standard Chartered CC | Expense |
| Dec 24 | Rokomari.com - Books | 2,500 | Education | HSBC Debit | Expense |
| Dec 25 | Star Cineplex Premium | 2,000 | Entertainment | Cash | Expense |
| Dec 26 | Coffee World | 650 | Food & Dining | Cash | Expense |
| Dec 27 | Carnival Internet | 2,500 | Bills | HSBC Debit | Expense |
| Dec 28 | Transfer to iPhone Goal | 25,000 | Savings | Standard Chartered | Transfer |
| Dec 29 | Transfer to Umrah Goal | 20,000 | Savings | MTB | Transfer |
| Dec 30 | Adobe Creative Cloud | 4,200 | Bills | Standard Chartered CC | Expense |
| Dec 31 | Gloria Jean's Coffee | 850 | Food & Dining | Cash | Expense |

**Monthly Totals for Sarah (Average):**
- Income: 110,000 - 145,000 BDT (including freelance)
- Expenses: 75,000 - 90,000 BDT
- Savings: 45,000 - 60,000 BDT
- Savings Rate: 35-45%

### Credit Card Data

**For Both Accounts:**
- Show current statement balance
- Show payment due date
- Show minimum payment due (10% of balance)
- Show credit utilization percentage
- Show recent transactions on each card
- Show billing cycle dates

**Notifications to Show:**
- "Credit card payment due in 3 days - City Bank Gold Card"
- "Credit utilization at 23% - within healthy range"
- "Minimum payment due: 3,500 BDT"

---

## 5. Feature-by-Feature Specifications

### 5.1 Dashboard (Home Screen)

**Layout:**
1. **Header**
   - User name and profile picture
   - Settings icon (top right)
   - Notification bell (top right) with badge count
   
2. **Account Summary Card**
   - Total balance across all accounts
   - Month-over-month change (e.g., "+5.2% from last month")
   - Quick view toggle (show/hide individual accounts)
   
3. **Account List**
   - Each account shows: Name, Balance, Account type
   - Visual distinction for different account types (bank icon, MFS icon, credit card icon, cash icon)
   - Tap to view account details
   
4. **Quick Actions (Floating Action Buttons)**
   - Add Transaction (prominent)
   - View Reports
   - AI Coach
   
5. **Recent Transactions**
   - Last 5-10 transactions
   - Show: merchant name, amount, category icon, date
   - Tap to view/edit transaction
   
6. **Budget Progress Bar**
   - Overall monthly budget status
   - "You've spent 18,500 / 25,000 BDT this month"
   - Color-coded (green if under budget, yellow if approaching, red if over)
   
7. **Goals Snapshot**
   - Mini cards showing top 2-3 goals
   - Progress bars with percentages
   - Tap to view all goals
   
8. **Advertisement Section (Free Tier Only)**
   - Banner ad at bottom of screen (sticky)
   - Relevant to user profile

**Interactions:**
- Pull-to-refresh to sync data
- Swipe left on transaction to edit/delete
- Tap account to see detailed view

---

### 5.2 Account Details Screen

**When user taps on an account, show:**

**Bank/MFS Account View:**
- Account name and bank logo
- Current balance (large, prominent)
- Available balance
- Last synced time (e.g., "Updated 2 hours ago")
- Manual refresh button
- Transaction list for this account only
  - Filter options: Date range, Category, Amount range
  - Search bar for transaction search
  - Sort options: Date, Amount, Category

**Credit Card View:**
- Card brand and last 4 digits
- Current balance
- Credit limit
- Available credit
- Credit utilization percentage (with color indicator)
- Payment due date
- Minimum payment due
- Statement balance
- "Pay Now" button (simulated)
- Transaction list for this card
- Billing cycle information

**Cash Account View:**
- Current balance
- Last 10 cash transactions
- "Add Cash Expense" button
- "Update Cash Balance" option
- Explanation: "Cash balance updated automatically from ATM withdrawals"

**Interactions:**
- Add transaction directly to this account
- Hide/show account from dashboard
- Set account nickname
- View full transaction history

---

### 5.3 Transaction Management

#### Adding a New Transaction

**Flow:**
1. User taps "Add Transaction" button
2. Modal/Screen opens with form:
   - **Amount** (number input)
   - **Type** (Expense / Income / Transfer)
   - **Account** (dropdown of all accounts)
   - **Merchant/Description** (text input)
   - **Category** (dropdown or icon picker)
   - **Date** (date picker, defaults to today)
   - **Notes** (optional text area)
   - **Receipt Upload** (optional, button to upload image)
   
3. **Smart Category Suggestion:**
   - As user types merchant name, show suggested category
   - Example: Types "Shwapno" → Auto-suggests "Food & Dining"
   - User can override
   
4. Save button adds transaction to list immediately
5. Success feedback: "Transaction added successfully"
6. Account balance updates accordingly

**For Cash Transactions:**
- If account selected is "Cash", show additional prompt
- "This will reduce your cash balance by X BDT"
- Option to tag: "Where did you get this cash from?" (if adding cash)

#### Editing a Transaction

**Flow:**
1. User taps on any transaction
2. Transaction detail view opens showing all fields
3. "Edit" button opens editable form
4. User can change:
   - Amount
   - Category
   - Date
   - Notes
   - Merchant name
5. Save button updates transaction
6. If category changed, show: "Transaction recategorized to [new category]"

#### AI Categorization Behavior

**Show AI in action:**
- When transaction is added/synced, briefly show "Categorizing..." animation
- Then show checkmark: "Categorized as Shopping"
- If user changes category, briefly show: "Learning from your feedback..."
- Show confidence indicator for AI categories (e.g., 95% confidence)

---

### 5.4 Budgeting System

#### Budget Overview Screen

**Free Tier View:**
- Monthly budget summary
- Total budget: X BDT
- Spent so far: Y BDT
- Remaining: Z BDT
- Overall progress bar

**Category Budget Cards:**
- List of all budgeted categories
- Each card shows:
  - Category name and icon
  - Budget amount
  - Spent amount
  - Progress bar (color-coded)
  - Percentage (e.g., "78% used")
  - Days remaining in month

**Budget Status Indicators:**
- Green: Under 70% spent
- Yellow: 70-90% spent
- Orange: 90-100% spent
- Red: Over budget

**Interactions:**
- Tap category to see detailed spending breakdown
- "Add Budget" button to create new category budget
- "Edit Budget" to adjust amounts

**Pro Tier Additions:**
- Budget trends graph (spending vs. budget over time)
- AI recommendations: "Based on your spending, we suggest increasing your Food budget to 12,000 BDT"
- Predictive alerts: "At current rate, you'll exceed your Transport budget by Dec 20"
- Budget templates option: "Apply 50-30-20 rule", "Essential Bills budget"
- Compare with previous months

#### Creating/Editing Budget

**Flow:**
1. User taps "Add Budget" or "Edit"
2. Form appears:
   - **Category** (dropdown)
   - **Monthly Amount** (number input)
   - **Rollover unused amount?** (toggle - Pro only)
   - **Alert at** (percentage threshold, e.g., 80%)
3. Save button
4. Budget created/updated
5. Dashboard updates immediately

**Pro Features to Show:**
- "Smart Budget" button: AI analyzes last 3 months and suggests budgets
- Template selection: Choose from pre-made budget plans
- Annual view: See budget adherence over full year

---

### 5.5 Goals and Savings

#### Goals Dashboard

**Show All Goals:**
- Card-based layout
- Each goal card displays:
  - Goal name and emoji/icon
  - Target amount
  - Current progress amount
  - Progress bar with percentage
  - Target date
  - Status: "On track" / "Behind schedule" / "Ahead of schedule"
  - Days/months remaining

**Free Tier:**
- Show 2 active goals
- Show 3rd slot with "Unlock unlimited goals with Pro" card

**Pro Tier:**
- Show all 5 goals
- "Add New Goal" button always visible
- Ability to prioritize goals (drag to reorder)

#### Goal Detail View

**When tapping a goal, show:**
- Large progress circle visualization
- Current amount / Target amount
- Progress percentage
- Timeline visualization (start date → current → target date)
- Contribution history:
  - List of all manual contributions
  - Dates and amounts
  - Source (e.g., "From DBBL Savings")
  
**AI Insights Section:**
- "To reach your goal on time, save 8,500 BDT per month"
- "You're currently ahead by 2 weeks!"
- "Based on your savings rate, you'll reach this goal by March 15, 2026"

**Actions:**
- "Add Contribution" button
- "Edit Goal" button
- "Pause Goal" option
- "Delete Goal" option

#### Adding a Goal

**Flow:**
1. User taps "Add New Goal" (Pro) or sees limit message (Free)
2. Form appears:
   - **Goal Name** (text input, e.g., "Buy PS5")
   - **Target Amount** (number input)
   - **Target Date** (date picker)
   - **Description** (optional)
   - **Icon/Emoji** (selector)
   - **Initial Contribution** (optional - if transferring existing savings)
3. AI suggestion appears:
   - "Based on your savings history, you can save 10,000 BDT/month"
   - "To reach 85,000 BDT by June 2026, save 8,500 BDT/month"
   - "Suggested target date: July 15, 2026"
4. Save button creates goal
5. Goal appears on dashboard

#### Goal Completion

**When goal reaches 100%:**
- Full-screen celebration animation (confetti, success animation)
- Message: "Congratulations! You've reached your goal: Buy PS5! 🎉"
- Options:
  - "Set New Goal"
  - "View Achievement"
  - "Share Achievement" (social sharing)
- Notification sent
- Goal moves to "Completed Goals" section

---

### 5.6 AI Financial Coach

**This is a critical demo feature - must be polished and impressive**

#### AI Coach Interface

**Layout:**
- Chat-style interface
- Coach avatar/icon at top
- Welcome message when opened
- Chat history (pre-loaded conversations)

**Free Tier:**
- Banner at top: "2 questions remaining this month"
- After using questions: "Upgrade to Pro for unlimited questions"

**Pro Tier:**
- No question limit indicator
- Additional features badge: "Unlimited Access"

#### Pre-loaded Conversations

**Create 5-6 realistic conversation examples that users can tap to view:**

**Conversation 1: Monthly Spending Review**
- **User:** "How did I do this month?"
- **AI Coach:** "Great question! Let me analyze your December spending. You spent 54,200 BDT out of your 70,000 BDT income, achieving a solid 22% savings rate. Your largest expense category was Food & Dining (15,800 BDT), followed by Shopping (12,500 BDT). You stayed within your budgets in most categories, with only Transport slightly over by 500 BDT. Overall, you're doing well! Would you like specific recommendations?"

**Conversation 2: Budget Optimization**
- **User:** "Should I adjust my food budget?"
- **AI Coach:** "Looking at your last 3 months, your average Food & Dining spending is 16,200 BDT, but your current budget is 15,000 BDT. I'd recommend increasing your Food budget to 17,000 BDT to give you more breathing room while staying realistic. This accounts for your dining out habits (averaging 5,800 BDT/month) plus groceries. You can offset this by reducing your Entertainment budget by 2,000 BDT, as you've been consistently under-spending there."

**Conversation 3: Savings Goal Planning**
- **User:** "Can I afford to buy a PS5 by June?"
- **AI Coach:** "Absolutely! Your PS5 goal requires 85,000 BDT by June 2026. You've already saved 52,000 BDT, leaving 33,000 BDT to go. That's 6 months away, so you need to save 5,500 BDT per month. Based on your current savings rate of 15,500 BDT/month, this is very achievable! You'll have extra buffer too. Want me to suggest which accounts to save from?"

**Conversation 4: Unusual Spending Alert**
- **User:** "Why did you alert me about my shopping spending?"
- **AI Coach:** "Good question! In December, you spent 12,500 BDT on shopping, which is 45% higher than your 3-month average of 8,600 BDT. I noticed a large purchase at Daraz for 8,500 BDT (PS5 Controller). While one-time purchases are normal, I wanted to make sure this was intentional and didn't impact your other financial goals. Your overall budget is still healthy though!"

**Conversation 5: Credit Card Management**
- **User:** "How am I doing with my credit cards?"
- **AI Coach:** "Your credit card health looks good! You have two cards with a combined balance of 53,000 BDT and total limit of 250,000 BDT, giving you a 21% utilization rate - excellent! Both payments are current. However, I noticed your City Bank card payment is due in 5 days (15th December). The minimum due is 3,500 BDT, but I recommend paying at least 15,000 BDT to reduce interest charges. Want to see your payment history?"

**Conversation 6: Income Comparison**
- **User:** "How much did I earn this year?"
- **AI Coach:** "In 2025, your total income was 8,40,000 BDT from your primary salary. Your highest earning month was December (70,000 BDT with bonus), and your average monthly income is 70,000 BDT. Compared to January, your income has remained stable. Your total expenses were 6,25,000 BDT, giving you a healthy 25.6% annual savings rate. You saved 2,15,000 BDT this year - excellent work!"

#### Quick Question Buttons

**Below the chat, show clickable suggested questions:**
- "How did I do this month?"
- "Where am I overspending?"
- "Can I afford [goal name]?"
- "How's my credit card health?"
- "Give me budget suggestions"
- "What's my savings rate?"
- "Compare this month to last month"

**When user clicks:**
- Question appears in chat as if they typed it
- AI response loads (with typing indicator animation)
- Pre-written response appears
- Question count decreases (Free tier)

#### AI Coach Reports

**Monthly Report (both tiers):**
- Automatically generated on 1st of each month
- Notification: "Your monthly financial report is ready!"
- Report includes:
  - Income summary
  - Expense breakdown by category
  - Budget adherence
  - Savings rate
  - Goal progress
  - Spending trends
  - Top 3 recommendations
  - Year-over-year comparison (if applicable)

**Weekly Report (Pro only):**
- Generated every Monday
- Quick pulse check on spending
- "This week you spent X, compared to Y last week"
- Budget alerts if trending toward overspending

**Quarterly Report (Pro only):**
- Comprehensive 3-month review
- Trend analysis
- Savings achievements
- Goal completion rate
- Financial health score

**Yearly Report (Pro only):**
- Full 12-month analysis
- This feeds into the "Year in Review" feature
- Detailed insights and patterns

#### API-Ready Implementation Note

**Developer Instructions:**
The AI Coach should be built with API integration in mind:
- All AI responses should come from a centralized function
- Function should accept: user message, user financial data, conversation history
- Currently, function returns pre-written responses from JSON file
- Later, function can be updated to call Gemini/Claude API with same inputs
- API key can be added to configuration without changing UI code
- Include placeholder for API endpoint configuration

**Structure:**
```javascript
async function getAIResponse(userMessage, userData, conversationHistory) {
  // Phase 1: Return pre-written response
  return mockResponses[userMessage];
  
  // Phase 2: Call AI API (future)
  // const response = await fetch(AI_API_ENDPOINT, {
  //   headers: { 'Authorization': API_KEY },
  //   body: { message: userMessage, context: userData }
  // });
  // return response;
}
```

---

### 5.7 Reports and Analytics

#### Reports Dashboard

**Free Tier:**
- Monthly reports only
- Basic visualizations
- Last 3 months accessible

**Pro Tier:**
- Weekly, monthly, quarterly, yearly reports
- Advanced visualizations
- Unlimited history
- Export options

#### Report Types

**Monthly Report:**
- Time Period Selector (January 2026, December 2025, etc.)
- Overview Cards:
  - Total Income
  - Total Expenses
  - Net Savings
  - Savings Rate %
  
- **Income Breakdown:**
  - Chart (pie chart)
  - Categories: Salary, Freelance, Gifts, etc.
  
- **Expense Breakdown:**
  - Chart (pie chart or bar chart)
  - Top 5 categories
  - Amount and percentage for each
  
- **Category Deep Dive:**
  - List view of all categories
  - Each category shows:
    - Total spent
    - Number of transactions
    - Average transaction amount
    - Top merchant in that category
    - Trend vs. previous month (up/down arrow)
  
- **Budget Performance:**
  - Table showing Category | Budget | Spent | Difference | Status
  - Color-coded (green if under, red if over)
  
- **Top Merchants:**
  - List of merchants where most money was spent
  - Amount spent at each
  
- **Spending Trend:**
  - Line graph showing daily spending throughout the month
  - Highlight peak spending days
  
- **AI Insights:**
  - 3-5 key observations
  - Examples:
    - "Your food spending increased 15% this month"
    - "You made 12 transactions at coffee shops totaling 4,200 BDT"
    - "You stayed within budget in 8 out of 10 categories"

**Weekly Report (Pro Only):**
- Similar structure but condensed
- Week-over-week comparison
- "This week vs. last week" metrics
- Quick spending pulse

**Quarterly Report (Pro Only):**
- 3-month overview
- Month-by-month comparison
- Trend identification
- Seasonal patterns
- Goal progress over quarter

**Yearly Report (Pro Only):**
- Full 12-month comprehensive review
- Month-by-month breakdown
- Income vs. expenses trend
- Savings growth chart
- Goal completion summary
- Category spending over time
- **This feeds into Year in Review feature**

#### Custom Report Generation (Pro Only)

**Feature:**
- "Create Custom Report" button
- User selects:
  - Date range (from date - to date)
  - Accounts to include (all or specific)
  - Categories to include (all or specific)
  - Report type: Overview / Category Focus / Merchant Focus / Account Focus
- Generate button creates custom report
- Option to save custom report template
- Export to PDF or Excel

#### Data Export (Pro Only)

**Export Options:**
- Export all transactions (CSV/Excel)
- Export specific report (PDF)
- Export date range
- Export by category
- Export by account

**Export Button Flow:**
1. User clicks "Export"
2. Modal appears with options:
   - Format: CSV / Excel / PDF
   - Date range
   - Include: Transactions / Reports / Both
3. "Download" button
4. File downloads to device (simulated)
5. Success message: "Report exported successfully"

---

### 5.8 Account Connection Flow

**This should demonstrate how users would link bank/MFS accounts, but simplified for prototype.**

#### Add Account Screen

**Access:**
- Settings → Add Account
- Dashboard → "Link New Account" button

**Account Type Selection:**
1. User sees options:
   - Bank Account
   - MFS Account (bKash, Nagad, Rocket)
   - Credit Card
   - Manual Cash Account

#### Linking Bank Account (Simulated OAuth)

**Flow:**
1. User selects "Bank Account"
2. Bank selection screen:
   - List of Bangladeshi banks with logos:
     - DBBL, BRAC Bank, City Bank, EBL, Standard Chartered, HSBC, etc.
   - Search bar
3. User selects a bank (e.g., "BRAC Bank")
4. Mock authentication screen appears:
   - BRAC Bank logo and branding
   - Form fields:
     - Username / Account Number
     - Password / PIN
     - (For prototype: any values work)
   - "This app will access: Your account balance, transaction history"
   - "Authorize" button
5. User clicks "Authorize"
6. Loading screen: "Connecting to BRAC Bank..."
7. Account selection (if multiple):
   - List of accounts: "BRAC Savings (****1234)", "BRAC Current (****5678)"
   - Checkboxes to select
   - "Link Selected Accounts" button
8. Success screen:
   - "Successfully linked BRAC Savings Account"
   - Account appears on dashboard immediately
   - Initial sync animation
   - "Fetching transactions..."
9. Dashboard updates with new account

#### Linking MFS Account

**Flow:**
- Same as bank, but simpler
- Only phone number needed
- OTP verification screen (any code works)
- Account linked

#### Adding Credit Card

**Flow:**
- Select bank that issued card
- Enter card last 4 digits (for identification)
- Mock authentication
- Card added with full details

---

### 5.9 Notifications System

**Create a Notifications Center accessible from bell icon**

#### Notification Types to Show (with examples):

**Budget Alerts:**
- "You've used 85% of your Food & Dining budget"
- "⚠️ You're 500 BDT over your Transport budget"
- "Great job! You stayed under budget in all categories this month 🎉"

**Goal Notifications:**
- "You're 25% closer to your PS5 goal! 🎮"
- "Reminder: Save 8,500 BDT this month to stay on track"
- "You're ahead of schedule on your Emergency Fund! 💪"
- "🎉 Congratulations! You've achieved your goal: Buy PS5"

**Credit Card Alerts:**
- "Credit card payment due in 3 days - City Bank Gold Card"
- "Minimum payment due: 3,500 BDT by December 15"
- "Credit utilization at 23% - healthy level"
- "⚠️ High credit utilization detected: 78%"

**Transaction Alerts:**
- "Large transaction detected: 45,000 BDT at Pickaboo"
- "Unusual spending pattern: 3 transactions at Daraz today"
- "ATM withdrawal: 10,000 BDT added to your cash balance"

**AI Coach Notifications:**
- "Your monthly financial report is ready!"
- "AI Coach Insight: You can save more on dining out"
- "Spending alert: You're trending 15% higher this week"

**Account Sync Notifications:**
- "All accounts synced successfully"
- "⚠️ Failed to sync BRAC Bank account - Tap to retry"
- "New transactions detected (5) - Review now"

**Advertisement Notifications (Free Tier Only):**
- "BRAC Bank is offering you a special fixed deposit rate of 8%"
- "Get 10% cashback on City Bank Credit Card"
- "Dhaka Bank offers you a pre-approved personal loan"

**System Notifications:**
- "App updated to version 2.1"
- "New feature available: Debt Payoff Planner"

#### Notification Center UI:

- Grouped by type: Today, Yesterday, This Week, Earlier
- Each notification shows:
  - Icon/badge
  - Title
  - Message
  - Timestamp
  - Tap to view details/take action
- Mark as read functionality
- "Clear all" option
- Settings button to customize notifications

---

## 6. Year in Review Feature

**This is the "Spotify Wrapped" equivalent - should be impressive, shareable, and fun!**

### Access Method

**Option 1: Dedicated Section**
- Accessible from main menu
- "Your 2025 Financial Year" card on dashboard in January
- Animated entrance

**Option 2: Notification Trigger**
- Push notification on January 1, 2026: "Your 2025 Year in Review is ready! 🎉"
- Tapping opens Year in Review

### Year in Review Structure

**Create a story-style, swipeable presentation (like Instagram Stories or Spotify Wrapped):**

#### Screen 1: Opening
- Animated entrance
- "Your 2025 Financial Journey"
- User name
- "Swipe to explore →"

#### Screen 2: The Big Picture
- **Large number animation**
- "You earned: 8,40,000 BDT"
- "You spent: 6,25,000 BDT"
- "You saved: 2,15,000 BDT"
- Animated counting up effect

#### Screen 3: Savings Achievement
- **Highlight the positive**
- "You saved 25.6% of your income!"
- Animated progress arc
- Comparison: "That's 5% more than the average Bangladeshi saver"
- Celebration animation

#### Screen 4: Transaction Stats
- "You made 384 transactions this year"
- Breakdown animation:
  - "280 expenses"
  - "24 income deposits"
  - "80 transfers"
- "That's an average of 32 transactions per month"

#### Screen 5: Top Spending Category
- **Most spent category**
- "Your #1 category: Food & Dining"
- Large icon (fork & knife)
- "You spent 1,89,600 BDT"
- "That's 30% of your total spending"
- Fun fact: "Enough to buy 2,107 cups of coffee!"

#### Screen 6: Your Favorite Places
- "Your top 3 places to spend:"
- Podium-style ranking:
  - 🥇 Shwapno: 45,200 BDT (52 visits)
  - 🥈 Star Kabab: 32,800 BDT (38 visits)
  - 🥉 bKash Merchant Payments: 28,500 BDT
- Map visualization with pins

#### Screen 7: The Big Purchase
- "Your biggest single purchase:"
- Dramatic reveal animation
- "45,000 BDT at Pickaboo"
- "Apple Watch"
- Date: December 10, 2025
- Icon/image of Apple Watch

#### Screen 8: Monthly Highlights
- "Your best saving month: March 2025"
- "You saved 24,500 BDT"
- Graph showing monthly savings
- March highlighted

- "Your highest earning month: December 2025"
- "You earned 1,05,000 BDT"

#### Screen 9: Consistency Award
- "You made transactions in all 12 months!"
- Calendar visualization with checkmarks
- "Financial consistency streak: 365 days! 🔥"

#### Screen 10: Transportation Insights
- "You traveled a lot!"
- "Spent 48,000 BDT on transportation"
- Breakdown:
  - Uber: 22,000 BDT
  - Pathao: 18,000 BDT
  - Fuel: 8,000 BDT
- Fun fact: "That's like 240 Uber rides to Gulshan!"

#### Screen 11: Healthcare Conscious
- **Positive framing**
- "You invested 18,500 BDT in your health"
- Healthcare category:
  - Doctor visits: 8,000 BDT
  - Medicines: 6,500 BDT
  - Gym: 4,000 BDT
- "Taking care of yourself matters! 💪"

#### Screen 12: Learning & Growth
- "You invested in yourself"
- Education spending: 12,000 BDT
- Courses taken: Udemy, Coursera, 10 Minute School
- "Never stop learning! 📚"

#### Screen 13: Entertainment Worth It
- "You spent 36,800 BDT on entertainment"
- Breakdown:
  - Movies: 12,000 BDT
  - Streaming services: 14,400 BDT
  - Gaming: 10,400 BDT
- "Life is meant to be enjoyed! 🎬🎮"

#### Screen 14: Small Purchases Add Up
- "Your coffee habit:"
- "82 cups of coffee this year"
- "Total: 35,650 BDT"
- "Average: 435 BDT per cup"
- Fun visualization: coffee cup animation

#### Screen 15: Budget Discipline
- **Celebrate the wins**
- "You stayed within budget:"
- "9 out of 12 months! 🎯"
- Progress circle: 75%
- "That's excellent financial discipline!"

#### Screen 16: Goals Crushed
- "Goals achieved in 2025:"
- ✅ Emergency Fund
- ✅ PS5
- List with checkmarks
- "2 out of 2 goals completed!"
- Trophy animation

#### Screen 17: Credit Card Wisdom
- "You kept credit card utilization below 30%"
- "Average utilization: 24%"
- "That's great for your financial health!"
- Thumbs up icon

#### Screen 18: Unusual Habits
- **Something quirky/interesting**
- "You made most transactions on Saturdays"
- "Saturdays: 78 transactions"
- Bar chart of weekday spending
- "Weekend warrior! 🛍️"

#### Screen 19: Night Owl Spending
- "Your late-night purchases:"
- "You spent 22,000 BDT after 10 PM"
- Usually food delivery: Foodpanda, Pathao Food
- "Someone likes midnight snacks! 🌙"

#### Screen 20: The Bad News (Gently)
- **Address challenges but end positively**
- "You went over budget 3 times"
- Months: April, July, November
- "But you recovered each time! 💪"

#### Screen 21: Overspending Category
- "You slightly overspent on: Shopping"
- Budget: 96,000 BDT
- Actual: 1,12,500 BDT
- "17% over budget"
- "Consider adjusting your 2026 budget"

#### Screen 22: Income Growth
- **End on positives**
- "Your income grew by 8% this year"
- January: 65,000 BDT → December: 70,000 BDT
- Upward arrow animation
- "Onwards and upwards! 📈"

#### Screen 23: Looking Ahead to 2026
- "Your 2026 goals:"
- List of current active goals
- "You've already saved: X BDT towards iPhone"
- "Keep up the momentum!"

#### Screen 24: Thank You / Share
- "Thank you for using [App Name] in 2025!"
- "Here's to an even better 2026! 🎉"
- **Share Button**: "Share Your Year in Review"
  - Generates shareable image (anonymized)
  - Social media sharing options
- "View Full Report" button (opens detailed yearly report)
- "Start Fresh in 2026" button (returns to dashboard)

### Design Guidelines for Year in Review:

**Visual Style:**
- Vibrant colors (green for savings, blue for spending, gold for achievements)
- Animations and transitions between screens
- Large, bold numbers
- Emoji and icons liberally used
- Confetti/celebration animations for positive stats
- Smooth swipe transitions

**Tone:**
- Celebratory and positive
- Acknowledge challenges but frame constructively
- Use second person ("You")
- Fun facts and comparisons
- Encouraging and motivational

**Technical Implementation:**
- Swipeable cards (like stories)
- Progress indicator at top (dots or line)
- Option to skip to end
- Background music option (upbeat, optional)
- Can be replayed anytime
- Shareable screens (individual or full summary)

---

## 7. Advertisement System

**For Free Tier Account (Rafiq) Only**

### Ad Placement Locations

**1. Dashboard Banner Ad (Bottom of screen)**
- Persistent sticky ad
- Refreshes on app open
- Size: 320x50px mobile banner
- Animated entrance

**2. Between Transactions List**
- Native ad format
- Appears every 10 transactions
- Looks like a card, labeled "Sponsored"

**3. Report Interstitial**
- After viewing a monthly report
- Full-screen ad with close button (5-second delay)
- Can be dismissed

**4. Occasional Pop-up (Daily)**
- Once per day maximum
- Appears on app launch
- Easy dismiss option
- Full-screen modal

**5. Notification Ads (Optional)**
- User can opt in/out
- "BRAC Bank has a special offer for you"
- Looks like regular notification but marked "Sponsored"

### Advertisement Examples (Use Real Brands)

#### Ad 1: BRAC Bank Fixed Deposit
**Target:** User with 200,000+ BDT in savings
**Ad Copy:**
"BRAC Bank Special FDR Offer: 8% Interest Rate"
"Lock in your savings today. Minimum 100,000 BDT."
**CTA Button:** "Learn More"
**Visual:** BRAC Bank logo, blue/green brand colors

#### Ad 2: City Bank Credit Card Upgrade
**Target:** User with good credit card payment history
**Ad Copy:**
"Upgrade to City Bank Platinum Card"
"Earn 5% cashback on all purchases. No annual fee first year."
**CTA Button:** "Apply Now"
**Visual:** Credit card image, City Bank branding

#### Ad 3: Praava Health Insurance
**Target:** User with healthcare spending, no insurance
**Ad Copy:**
"Protect Your Health with Praava Health Insurance"
"Comprehensive coverage for you and your family. Starting from 5,000 BDT/month."
**CTA Button:** "Get Quote"
**Visual:** Family image, Praava logo

#### Ad 4: Dhaka Bank Personal Loan
**Target:** User planning a large purchase (detected from goals)
**Ad Copy:**
"Need funds for your goals? Dhaka Bank Personal Loan"
"Pre-approved loan up to 500,000 BDT. Competitive rates."
**CTA Button:** "Check Eligibility"
**Visual:** Happy person, Dhaka Bank branding

#### Ad 5: bKash Savings Feature
**Target:** All bKash users
**Ad Copy:**
"Did you know? bKash Savings gives you 6% interest"
"Start saving with as little as 100 BDT. No account fees."
**CTA Button:** "Start Saving"
**Visual:** bKash logo (pink), piggy bank icon

#### Ad 6: IDLC Investment Plan
**Target:** User with high savings rate, no investments
**Ad Copy:**
"Grow Your Wealth with IDLC Mutual Funds"
"Professional investment management. Start with 10,000 BDT."
**CTA Button:** "Explore Plans"
**Visual:** Chart going up, IDLC branding

#### Ad 7: Nagad Cashback Offer
**Target:** Nagad users or frequent shoppers
**Ad Copy:**
"Get 10% Cashback with Nagad Payments"
"Shop at 1000+ merchants. Maximum cashback 500 BDT."
**CTA Button:** "View Offers"
**Visual:** Nagad logo (orange), shopping cart

#### Ad 8: MetLife Insurance
**Target:** User with family, earning 70,000+ BDT/month
**Ad Copy:**
"Secure Your Family's Future with MetLife"
"Life insurance from 1,000 BDT/month. Get instant quote."
**CTA Button:** "Calculate Premium"
**Visual:** Family photo, MetLife logo

### Ad Targeting Logic (For Demo)

**Show different ads based on user profile:**

**Rafiq (Free Account):**
- Has 200,000+ BDT in FDR → Show FDR/Investment ads
- Uses credit cards → Show card upgrade ads
- Has healthcare expenses → Show health insurance
- Saving for PS5 → Show personal loan offers
- Uses bKash frequently → Show bKash products

**Ad Rotation:**
- Different ad each time user opens app
- 5-6 ads in rotation
- Contextual to current screen when possible

### Ad Interaction Behavior

**When user taps ad:**
- Opens in-app browser (simulated)
- Shows generic landing page for that product
- Can close and return to app
- Ad click is tracked (show counter for demo: "Ads clicked: 3")

**Upgrade Prompt:**
- After viewing 3-4 ads: "Tired of ads? Upgrade to Pro for an ad-free experience"
- Link to Pro subscription page

---

## 8. User Interface Guidelines

**IMPORTANT: A design folder will be provided containing:**
- An image of the complete style sheet (colors, typography, spacing, components, etc.)
- An image of a sample home UI screen for reference

**Developers should reference these design files and implement the UI accordingly. All design decisions including colors, typography, component styles, animations, and layout should follow what is shown in the provided design images.**

---

## 9. Development Notes

### Technical Stack (Suggestions)

**Frontend:**
- React or Vue.js
- Tailwind CSS or Material-UI
- Chart.js or D3.js for visualizations
- Framer Motion for animations

**State Management:**
- Context API or Redux
- Local storage for data persistence

**Data Structure:**
- JSON files for mock data
- Structured as outlined in section 2

### File Structure
```
/src
  /components
    /Dashboard
    /Accounts
    /Transactions
    /Budgets
    /Goals
    /AICoach
    /Reports
    /YearInReview
    /Ads
    /Notifications
  /data
    /rafiq-account
    /sarah-account
  /utils
    /calculations.js
    /formatters.js
    /aiResponses.js
  /styles
  /assets
    /icons
    /images
    /brand-logos
```

### Key Functions Needed

**Balance Calculations:**
- Calculate total balance across all accounts
- Calculate month-to-date spending
- Calculate budget remaining
- Calculate goal progress percentage

**Transaction Processing:**
- Add new transaction
- Edit transaction
- Delete transaction
- Filter transactions by date/category/account
- Search transactions

**Budget Functions:**
- Calculate budget usage percentage
- Check if over budget
- Calculate days remaining in month
- Project end-of-month spending

**Goal Functions:**
- Calculate monthly savings needed
- Project goal completion date
- Calculate how much ahead/behind schedule

**AI Response Selector:**
- Match user question to pre-written response
- Add delay to simulate processing
- Store conversation history

**Report Generator:**
- Aggregate data by date range
- Calculate category totals
- Generate chart data
- Format numbers and percentages

### Data Format Examples

**Transaction Object:**
```json
{
  "id": "txn_001",
  "date": "2025-12-15",
  "merchant": "Star Kabab",
  "amount": 850,
  "type": "expense",
  "category": "Food & Dining",
  "account": "city_bank_cc",
  "notes": "Dinner with friends",
  "ai_confidence": 95,
  "receipt_url": null
}
```

**Account Object:**
```json
{
  "id": "dbbl_savings",
  "type": "bank",
  "name": "DBBL Savings",
  "institution": "Dutch Bangla Bank",
  "balance": 85000,
  "available_balance": 85000,
  "account_number": "****1234",
  "last_synced": "2026-02-03T10:30:00Z",
  "status": "connected"
}
```

**Budget Object:**
```json
{
  "category": "Food & Dining",
  "monthly_budget": 15000,
  "spent": 12500,
  "alert_threshold": 80,
  "rollover": false
}
```

**Goal Object:**
```json
{
  "id": "goal_001",
  "name": "Buy PS5",
  "target_amount": 85000,
  "current_amount": 52000,
  "target_date": "2026-06-30",
  "created_date": "2025-08-01",
  "icon": "🎮",
  "description": "PlayStation 5 with extra controller",
  "status": "active"
}
```

### Performance Considerations

- Lazy load reports and charts
- Pagination for transaction lists (show 20 at a time)
- Optimize images and icons
- Minimize animations on low-end devices
- Cache calculations where possible

### Testing Scenarios

**User Flow Tests:**
1. Add transaction → View in list → Edit → Delete
2. Create budget → Exceed budget → See alert
3. Create goal → Add contribution → Reach goal
4. Ask AI question → Get response → Ask followup
5. Generate report → Export report
6. Link new account → View transactions
7. Switch between Free and Pro accounts
8. View Year in Review → Share

**Edge Cases:**
- Over budget scenarios
- Negative balance (credit cards)
- Goals past deadline
- Failed account sync
- Empty states (no transactions, no goals)

---

## 10. Important Notes

### What Works in Prototype

✅ All UI interactions
✅ All calculations (budget, goals, reports)
✅ Adding/editing/deleting transactions
✅ Creating/editing budgets and goals
✅ Viewing all reports
✅ AI Coach with pre-written responses
✅ Account switching (Free/Pro)
✅ Year in Review feature
✅ Notifications display
✅ Advertisements (Free tier)
✅ All visualizations and charts

### What Doesn't Work (Simulated)

❌ Real API connections to banks/MFS
❌ Real OAuth authentication
❌ Actual AI API calls (uses pre-written responses)
❌ Real-time data sync
❌ Push notifications
❌ In-app purchases (Pro upgrade)
❌ Advertisement tracking/clicks
❌ Data export (downloads)
❌ Social sharing (opens share dialog but doesn't post)
❌ Email/SMS notifications

### Must-Have Features for Demo

🎯 Realistic transaction data (1 year worth)
🎯 Both Free and Pro account modes
🎯 AI Coach with impressive responses
🎯 Year in Review feature (fully functional)
🎯 Smooth animations and transitions
🎯 Professional design and polish
🎯 Real Bangladeshi brands and merchants
🎯 Targeted advertisements
🎯 Complete budget and goal tracking
🎯 All report types

### Polish Items

- Loading states for all async operations
- Empty states with helpful messages
- Error states with retry options
- Success confirmations
- Micro-interactions (button presses, swipes)
- Smooth scrolling
- Consistent spacing and alignment
- Proper image optimization
- Responsive touch targets

---

---

## 11. Conclusion

This prototype should demonstrate the full vision of the money management app to investors. Every feature from the PRD should be visible and interactive, even if some connections are simulated. The goal is to show:

1. **The complete user experience** - from onboarding to daily use to year-end insights
2. **The value proposition** - unified financial visibility and AI-powered insights
3. **The business model** - clear differentiation between Free and Pro tiers
4. **The local market fit** - Bangladesh-specific banks, MFS, merchants, and context
5. **The viral potential** - Year in Review as a shareable, engaging feature

The prototype should feel production-ready, with polished design, smooth interactions, and realistic data. It should excite investors about the possibilities while demonstrating a clear path to market.

Remember: First impressions matter. Make it beautiful, make it smooth, make it impressive.