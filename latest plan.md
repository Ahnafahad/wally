# Wally — Accounts Section Fixes

## Issues Being Fixed
1. Dutch Bangla logo missing in accounts list
2. Link Account flows identical for all types (Cash/MFS/Bank/Card)
3. Credit cards show bank logo instead of card network logo
4. Cash balance manual adjustment → record transaction flow
5. Back button broken in SingleAccountView

---

## Execution Order (dependency-driven)

Issues 1, 2, 3, 5 are independent — can be done in any order.
Issue 4 has a strict chain: **AppContext → AccountDetail → TransactionModal**.

Recommended sequence:
1. `AppContext.jsx` (Issue 4A — must go first)
2. `brandMapping.js` (Issue 1a)
3. `WallyLogo.jsx` (Issue 1b)
4. `LinkAccountPage.jsx` (Issue 2)
5. `AccountDetail.jsx` (Issues 3, 4B, 5 — all in one file)
6. `TransactionModal.jsx` (Issue 4C — must go last)

---

## FILE 1: `src/utils/brandMapping.js`

**Issue 1a — broken Dutch-Bangla domain**

Line 80. Change:
```
'Dutch-Bangla': '/brands/dbbl.png', // Local override
```
To:
```
'Dutch-Bangla': 'dbbl.com.bd',
```
`public/brands/` doesn't exist. `dbbl.com.bd` is the real registered domain; Google favicon service will resolve it.

Note: Lines 84, 86, 95 have the same broken `/brands/` pattern for Islami Bank, Prime Bank, Rocket. Islami Bank is visible in Sarah's accounts — same fix applies if needed later (`islami.com.bd`). Out of current scope.

---

## FILE 2: `src/components/shared/WallyLogo.jsx`

**Issue 1b — MerchantLogo bypasses getLogoUrl()**

### Change 1: Import (line 53)
From: `import { getBrandDomain } from '../../utils/brandMapping';`
To:   `import { getLogoUrl } from '../../utils/brandMapping';`

### Change 2: Logo URL resolution (lines 58-60)
Remove:
```javascript
  // 1. Identify Brand Domain
  const domain = getBrandDomain(merchant);
  const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
```
Replace with:
```javascript
  const logoUrl = getLogoUrl(merchant);
```

### Change 3: Add Dutch-Bangla to merchantLogos map (after line 92, before closing `};`)
```javascript
    'Dutch-Bangla': { bg: '#ED1C24', text: 'DB', textColor: '#fff', fontSize: 0.4 },
```
This is the manual fallback if the favicon fails. Color matches LinkAccountPage BANKS list.

---

## FILE 3: `src/components/account/LinkAccountPage.jsx`

**Issue 2 — differentiate auth form by account type**

All changes inside `step === 'auth'` block (lines 364–478). The badge (lines 366–398) stays unchanged for all types. Branch the form fields:

### Cash (`selectedType === 'Cash'`):
- Single field only: label "Starting Balance"
- Input has ৳ prefix (same pattern as TransactionModal line 167), placeholder "e.g. 5000"
- Binds to existing `accountNum` state (no new state needed)
- No PIN input at all
- Button text: "Link Cash Account"

### MFS (`selectedType === 'Mobile Financial'`):
- First field label → "Phone Number", placeholder → "e.g. 01712345678"
- Second field label → "Verification PIN" (keep 4-digit, password type, pin state — everything else same)
- Button text: "Authorize" (unchanged)

### Bank / Credit Card (everything else):
- No changes. Account Number + 4-digit PIN + Authorize stays as-is.

### Button (lines 449–476):
Only the button text is conditional:
```javascript
{selectedType === 'Cash' ? 'Link Cash Account' : 'Authorize'}
```
onClick, styling — all unchanged.

---

## FILE 4: `src/AppContext.jsx`

**Issue 4A — make accounts stateful, add pendingTransaction**

### Change 1: accounts → stateful (line 57 area)
Add useState with the other state declarations:
```javascript
const [accountData, setAccountData] = useState({ rafiq: rafiqAccounts, sarah: sarahAccounts });
```
Replace line 57 (`const accounts = isPro ? sarahAccounts : rafiqAccounts;`) with:
```javascript
const accounts = accountData[user];
```

### Change 2: pendingTransaction state (with other state declarations)
```javascript
const [pendingTransaction, setPendingTransaction] = useState(null);
```

### Change 3: updateAccountBalance function (after addTransaction, ~line 87)
```javascript
function updateAccountBalance(accountId, newBalance) {
  setAccountData(prev => ({
    ...prev,
    [user]: prev[user].map(a => a.id === accountId ? { ...a, balance: newBalance } : a),
  }));
}
```

### Change 4: switchUser reset (lines 150–161)
Add inside switchUser:
```javascript
setAccountData({ rafiq: rafiqAccounts, sarah: sarahAccounts });
setPendingTransaction(null);
```

### Change 5: context value object (lines 164–209)
Add to state section:
```javascript
pendingTransaction,
```
Add to functions section:
```javascript
setPendingTransaction,
updateAccountBalance,
```

---

## FILE 5: `src/components/account/AccountDetail.jsx`

**Issues 3, 4B, 5 — all in one file, non-overlapping regions**

### Issue 3: Card network logo (lines 24–27 and line 134)

Add helper after `accountIcon` (after line 24):
```javascript
function getCardNetwork(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  if (lower.includes('visa')) return 'Visa';
  if (lower.includes('mastercard')) return 'Mastercard';
  if (lower.includes('amex')) return 'Amex';
  return null;
}
```

Line 134 — change merchant prop on MerchantLogo:
```javascript
merchant={acc.type === 'credit_card' ? (getCardNetwork(acc.name) || acc.name) : (acc.institution || acc.name)}
```

Data trace:
- "City Bank Visa" → 'Visa' → visa.com favicon ✓
- "BRAC Bank Mastercard" → 'Mastercard' → mastercard.us favicon ✓
- "City Bank Visa Gold" → 'Visa' ✓
- "BRAC Bank Platinum" → null → falls back to acc.name "BRAC Bank Platinum" → fuzzy matches 'BRAC' → bracbank.com favicon ✓

### Issue 5: Back button fix (line 269)

Change:
```javascript
onClick={() => navigate('account')}
```
To:
```javascript
onClick={() => navigate('account', { account: null })}
```
`null !== undefined` is true, so navigate calls `setSelectedAccount(null)` → list view renders.

### Issue 4B: Cash balance adjustment UI

**Inside SingleAccountView:**

Add useApp destructure at top of function body:
```javascript
const { updateAccountBalance, setPendingTransaction, openModal } = useApp();
```

Add two state vars (with existing useState calls):
```javascript
const [showAdjust, setShowAdjust] = useState(false);
const [newBalance, setNewBalance] = useState('');
```

**Placement:** After the balance card closing `</div>` (line 360), before the credit card metrics block (line 362). Wrapped in `{account.type === 'cash' && (...)}`.

**UI structure:**
- When `!showAdjust`: single "Adjust Balance" button (outline style: border 2px solid #2D9CDB, transparent bg, color #2D9CDB)
- When `showAdjust`: inline card with:
  - Label "New Balance"
  - ৳-prefixed number input bound to `newBalance`
  - Two buttons: "Record Difference" (primary gradient) and "Cancel" (resets showAdjust + newBalance)

**Record Difference handler:**
```javascript
function handleRecordDifference() {
  const parsed = parseFloat(newBalance);
  if (isNaN(parsed)) return;
  const diff = parsed - account.balance;
  const type = diff >= 0 ? 'income' : 'expense';
  updateAccountBalance(account.id, parsed);
  setPendingTransaction({
    type,
    amount: Math.abs(diff),
    merchant: 'Cash Adjustment',
    account: account.id,
    category: 'Cash',
  });
  setShowAdjust(false);
  setNewBalance('');
  openModal('transaction');
}
```
Balance updates immediately. Modal opens pre-filled with the diff. User fills in details and saves.

---

## FILE 6: `src/components/transaction/TransactionModal.jsx`

**Issue 4C — pre-fill form from pendingTransaction**

### Change 1: Destructuring (line 48)
Add `pendingTransaction` and `setPendingTransaction` to useApp destructure.

### Change 2: useState initializers (lines 51–55)
```javascript
const [type,     setType]     = useState(pendingTransaction?.type || 'expense');
const [amount,   setAmount]   = useState(pendingTransaction?.amount ? String(pendingTransaction.amount) : '');
const [merchant, setMerchant] = useState(pendingTransaction?.merchant || '');
const [category, setCategory] = useState(pendingTransaction?.category || 'Food & Dining');
const [account,  setAccount]  = useState(pendingTransaction?.account || accounts[0]?.id || '');
```

### Change 3: Consumption effect (after the existing auto-suggest useEffect, ~line 65)
```javascript
useEffect(() => {
  if (pendingTransaction) setPendingTransaction(null);
}, []);
```
Clears pending data after reading it, so next normal open doesn't re-fill.

No conflict with auto-suggest: `suggestCategory('Cash Adjustment')` returns null (no keyword match), so category stays 'Cash'.

---

## Verification Checklist

- [ ] Dutch Bangla logo visible in accounts list (both Rafiq and Sarah)
- [ ] Link Account → Cash: shows Starting Balance input only, "Link Cash Account" button
- [ ] Link Account → MFS (bKash/Nagad): shows Phone Number + Verification PIN
- [ ] Link Account → Bank: shows Account Number + 4-digit PIN (unchanged)
- [ ] Link Account → Credit Card: bank → network → Account Number + PIN (unchanged)
- [ ] Credit cards in accounts list show Visa/Mastercard logo, not bank logo
- [ ] Back button works from any SingleAccountView back to the list
- [ ] Cash account detail: "Adjust Balance" button visible
- [ ] Cash adjustment: enter higher amount → opens modal pre-filled as Income
- [ ] Cash adjustment: enter lower amount → opens modal pre-filled as Expense
- [ ] Cash balance in accounts list updates after adjustment
- [ ] Switch user resets cash balance back to seed data
- [ ] Normal "+" Add Transaction still works (no stale pre-fill)
