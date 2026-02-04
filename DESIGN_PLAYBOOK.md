# Wally Design & Implementation Playbook

**Purpose**: This playbook contains all design patterns, technical standards, and implementation guidelines used in Wally's modern SaaS redesign. Use this as the single source of truth for transforming any page in the app.

**Target Screen**: 864×1536 portrait (HP x360 laptop in portrait mode, touchscreen)
**Design Philosophy**: Clean, modern SaaS aesthetic with subtle shadows, generous white space, and responsive fluid design

---

## 📐 1. RESPONSIVE DESIGN SYSTEM

### Container Pattern (CRITICAL)
```jsx
// Page wrapper - ALWAYS use this pattern
<div style={{
  minHeight: '100%',
  backgroundColor: '#F9FAFB',
  paddingBottom: '100px',  // ← CRITICAL: Prevents navbar overlap
  maxWidth: '864px',        // ← Optimal width
  margin: '0 auto',         // ← Centers on wider screens
  width: '100%',
}}>
```

### Responsive Padding (Use Everywhere)
```jsx
padding: 'clamp(16px, 2.5vw, 24px)'
// Scales: 16px (small) → 2.5vw (fluid) → 24px (max)
```

### Section Spacing
```jsx
// Between major sections
padding: '20px clamp(16px, 2.5vw, 24px) 0'

// Between minor sections
padding: '28px clamp(16px, 2.5vw, 24px) 0'
```

---

## 🎨 2. DESIGN TOKENS

### Colors
```javascript
// Primary Brand
--brand-blue: #2D9CDB
--brand-blue-light: #56CCF2
--brand-blue-dark: #1A7FB0

// Gradients (Buttons, Hero Cards)
--gradient-primary: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)
--gradient-fab: linear-gradient(180deg, #56CCF2 0%, #2D9CDB 100%)

// Neutrals (Backgrounds, Text)
--gray-50: #F9FAFB   // Page background
--gray-100: #F3F4F6  // Card borders, subtle fills
--gray-200: #E5E7EB  // Dividers
--gray-500: #6B7280  // Secondary text
--gray-700: #374151  // Body text
--gray-900: #1F2937  // Headings

// Status Colors
--success: #10B981
--warning: #F59E0B
--error: #EF4444

// Semantic Use:
- Income/Positive: #10B981
- Expense/Negative: #EF4444
- Transfer/Neutral: #2D9CDB
```

### Typography
```javascript
// Font Families (Define as constants in component)
const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

// Font Sizes (Optimized for 864px width)
- Headings (h1): 20-24px, fontWeight: 700, fontFamily: SF_DISPLAY
- Headings (h2): 18px, fontWeight: 700, fontFamily: SF_DISPLAY
- Headings (h3): 15px, fontWeight: 600, fontFamily: SF_DISPLAY
- Body text: 14px, fontWeight: 400, fontFamily: SF
- Small text: 12-13px, fontWeight: 400, fontFamily: SF
- Labels: 11-12px, fontWeight: 600, fontFamily: SF

// Large Numbers (Scores, Balances)
- Hero numbers: 42-64px, fontWeight: 700, fontFamily: SF_DISPLAY
- Card numbers: 32-36px, fontWeight: 600-700, fontFamily: SF_DISPLAY
- Stat numbers: 18-24px, fontWeight: 600, fontFamily: SF_DISPLAY
```

### Shadows (Subtle is Key)
```jsx
// Card shadows (Use these exact values)
boxShadow: '0 2px 10px rgba(0,0,0,0.02)'  // ← Default card
boxShadow: '0 4px 20px rgba(0,0,0,0.08)'  // ← Hero card
boxShadow: '0 1px 3px rgba(0,0,0,0.05)'   // ← Minimal card

// FAB shadow
boxShadow: '0 0 0 4px #fff, 0 10px 15px -3px rgba(86, 204, 242, 0.4)'
```

### Border Radius
```jsx
borderRadius: '14px'   // ← Standard cards
borderRadius: '16px'   // ← Large cards, modals
borderRadius: '12px'   // ← Buttons, small cards
borderRadius: '10px'   // ← Inputs, badges
borderRadius: '9999px' // ← Pills, progress bars
```

### Borders
```jsx
border: '1px solid #F3F4F6'  // ← Standard card border
border: '1px solid #E5E7EB'  // ← Dividers, stronger separation
```

---

## 🧱 3. COMPONENT PATTERNS

### Card Component Pattern
```jsx
// Standard card (Use this everywhere)
<div style={{
  backgroundColor: '#fff',
  borderRadius: '14px',
  padding: '18px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  border: '1px solid #F3F4F6',
}}>
  {/* Content */}
</div>

// Hero/Featured card (Gradients, larger)
<div style={{
  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  borderRadius: '16px',
  padding: '28px 24px',
  boxShadow: '0 20px 25px -5px rgba(79,172,254,0.25), 0 10px 10px -5px rgba(79,172,254,0.15)',
  color: '#fff',
}}>
  {/* Content */}
</div>
```

### Clickable Cards (Interactive)
```jsx
// When card should be clickable, wrap in button
<button
  onClick={() => navigate('targetPage')}
  style={{
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    border: '1px solid #F3F4F6',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#F9FAFB';
    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#fff';
    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
  }}
>
  {/* Content */}
</button>
```

### List Item Pattern (Transactions, Notifications)
```jsx
<button
  key={item.id}
  onClick={() => handleItemClick(item)}
  style={{
    width: '100%',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    border: 'none',
    borderBottom: isLastItem ? 'none' : '1px solid #F3F4F6',
    background: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    textAlign: 'left',
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
>
  {/* Icon */}
  <div style={{
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    {/* Icon content */}
  </div>

  {/* Text content */}
  <div style={{ flex: 1, minWidth: 0 }}>
    {/* Title, subtitle */}
  </div>

  {/* Right content (amount, chevron, etc) */}
  <div>
    {/* Right content */}
  </div>
</button>
```

### Progress Bar Pattern
```jsx
<div style={{
  width: '100%',
  height: '7px',  // ← Slightly thicker for 864px screen
  backgroundColor: '#F3F4F6',
  borderRadius: '9999px',
  overflow: 'hidden',
}}>
  <div style={{
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: color,
    borderRadius: '9999px',
    transition: 'width 0.5s ease',
  }} />
</div>
```

### Stat Grid Pattern (2-column)
```jsx
<div style={{
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
}}>
  {stats.map(stat => (
    <div key={stat.label} style={{
      backgroundColor: '#F9FAFB',
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #F3F4F6',
    }}>
      <div style={{
        fontSize: '12px',
        color: '#6B7280',
        fontFamily: SF,
        marginBottom: '6px',
      }}>
        {stat.label}
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: 700,
        color: '#1F2937',
        fontFamily: SF_DISPLAY,
      }}>
        {stat.value}
      </div>
    </div>
  ))}
</div>
```

---

## 🚪 4. MODAL & OVERLAY PATTERNS

### Full-Screen Modal (CRITICAL PATTERN)
```jsx
<>
  {/* Backdrop */}
  <div
    onClick={closeModal}
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
    zIndex: 200,              // ← Higher than everything
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    maxWidth: '864px',        // ← Centered on wide screens
    margin: '0 auto',
    left: '50%',
    transform: 'translateX(-50%)',
    paddingBottom: '100px',   // ← CRITICAL: Prevents navbar overlap
  }}>
    {/* Modal header with close button */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px clamp(16px, 2.5vw, 24px)',
      borderBottom: '1px solid #E5E7EB',
      position: 'sticky',
      top: 0,
      backgroundColor: '#fff',
      zIndex: 10,
    }}>
      <h2 style={{ fontSize: '17px', fontWeight: 700, fontFamily: SF_DISPLAY }}>
        Modal Title
      </h2>
      <button onClick={closeModal} style={{ /* close button */ }}>
        <X size={20} />
      </button>
    </div>

    {/* Modal body with proper padding */}
    <div style={{ flex: 1, padding: '20px clamp(16px, 2.5vw, 24px)' }}>
      {/* Content */}
    </div>
  </div>
</>
```

### Z-Index Hierarchy (NEVER DEVIATE)
```
1-9:    Base content
10-50:  Sticky headers, floating elements
51-99:  Dropdowns, tooltips
100:    Bottom navigation bar
101-199: Overlays, toasts
200+:   Full-screen modals
```

---

## 📱 5. PAGE STRUCTURE PATTERN

### Standard Page Template
```jsx
export default function PageName() {
  const { navigate, /* other context */ } = useApp();

  // Font constants
  const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';
  const SF_DISPLAY = 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif';

  // ⚠️ CRITICAL: ALWAYS pull data from context/props, NEVER create random data
  const realData = useRealDataFromContext();

  return (
    <div style={{
      minHeight: '100%',
      backgroundColor: '#F9FAFB',
      paddingBottom: '100px',
      maxWidth: '864px',
      margin: '0 auto',
      width: '100%',
    }}>

      {/* Header with back button */}
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
        <button onClick={() => navigate('previousPage')} style={{ /* back button */ }}>
          <ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
        </button>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#1F2937',
          fontFamily: SF_DISPLAY,
        }}>
          Page Title
        </h1>
      </div>

      {/* Content sections */}
      <div style={{ padding: '20px clamp(16px, 2.5vw, 24px) 0' }}>
        {/* Cards, lists, etc. */}
      </div>

      {/* More sections... */}

    </div>
  );
}
```

---

## 🎯 6. NAVIGATION & INTERACTION PATTERNS

### Navigation Pattern
```jsx
// From context
const { navigate, openModal, closeModal, setSelectedItem } = useApp();

// Page navigation
onClick={() => navigate('targetPage')}

// Modal navigation
onClick={() => openModal('modalName')}

// With data selection
onClick={() => {
  setSelectedItem(item);
  openModal('detailModal');
}}

// Back navigation
onClick={() => navigate('dashboard')}  // ← Default back
```

### Button Patterns
```jsx
// Primary Action Button (Gradient)
<button
  onClick={handleAction}
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
  Action Text
</button>

// Secondary Button (Outline)
<button
  onClick={handleAction}
  style={{
    width: '100%',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    color: '#2D9CDB',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: SF,
    cursor: 'pointer',
  }}
>
  Secondary Action
</button>
```

---

## 💾 7. DATA HANDLING (CRITICAL RULES)

### ⚠️ NEVER Create Random Data
```jsx
// ❌ WRONG - Creating fake data
const fakeTransactions = [
  { id: 1, amount: 1000, merchant: 'Coffee Shop' },
  { id: 2, amount: 2000, merchant: 'Restaurant' },
];

// ✅ CORRECT - Pull from context/props
const { transactions } = useApp();
const recentTransactions = getRecentTransactions(transactions, 5);
```

### Data Source Hierarchy
```
1. AppContext (useApp hook) - Primary source
2. Props passed from parent - Secondary source
3. Utility functions (calculations.js) - Computed data
4. Never hardcode data in components
```

### Example Data Pulling Pattern
```jsx
import { useApp } from '../../AppContext';
import { getTotalBalance, getRecentTransactions } from '../../utils/calculations';
import { formatCurrency, formatBangla } from '../../utils/formatters';

export default function MyComponent() {
  // Pull ALL data from context
  const {
    user,
    accounts,
    transactions,
    budgets,
    goals,
    isPro
  } = useApp();

  // Compute derived data using utility functions
  const totalBalance = getTotalBalance(accounts);
  const recentTxns = getRecentTransactions(transactions, 5);

  // ⚠️ NEVER create transactions, accounts, or budgets inside component
  // ⚠️ ALWAYS use existing data from context

  return (
    // Render using REAL data
    <div>
      {recentTxns.map(txn => (
        <div key={txn.id}>{formatCurrency(txn.amount)}</div>
      ))}
    </div>
  );
}
```

---

## 🌐 8. RESPONSIVE BREAKPOINT STRATEGY

### Screen Size Targets
```
Primary:  864×1536 (HP x360 portrait)
Wide:     > 864px (desktop, centers content)
Narrow:   < 864px (mobile, scales down)
```

### Media Query Pattern (If Needed)
```jsx
// Prefer clamp() over media queries, but if needed:
const isMobile = window.innerWidth < 640;
const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
const isDesktop = window.innerWidth >= 1024;

// Or use resize listener
useEffect(() => {
  const handleResize = () => {
    // Adjust layout
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### Touch Targets
```jsx
// Minimum touch target size
minWidth: '44px',
minHeight: '44px',

// Interactive elements
padding: '12px 16px',  // Generous padding for touch
```

---

## 🎨 9. CURRENCY & DATA FORMATTING

### Currency Formatting (Bangladeshi Taka)
```jsx
import { formatCurrency, formatBangla, formatCompact } from '../../utils/formatters';

// Standard display
formatCurrency(125000)  // → "৳1,25,000"

// Bangladeshi comma grouping only (no symbol)
formatBangla(125000)  // → "1,25,000"

// Compact format (with symbol)
formatCompact(125000)  // → "৳1.3L"
formatCompact(1250)    // → "৳1.3k"

// ⚠️ Usage in UI
<span>৳ {formatBangla(amount)}</span>  // ← Manual ৳ prefix
<span>{formatCompact(amount)}</span>    // ← Already includes ৳

// ❌ NEVER DO THIS (double ৳ symbols)
<span>৳ {formatCompact(amount)}</span>
```

### Date Formatting
```jsx
import { formatRelative, formatDate } from '../../utils/formatters';

formatRelative('2026-02-04')  // → "Today", "Yesterday", "2 days ago"
formatDate('2026-02-04')      // → "Feb 4, 2026"
```

### Category Helpers
```jsx
import { getCategoryColor, getCategoryEmoji } from '../../utils/formatters';

const color = getCategoryColor('Food & Dining');  // → "#F59E0B"
const emoji = getCategoryEmoji('Food & Dining');  // → "🍕"
```

---

## 🧪 10. TESTING CHECKLIST

### Before Marking Page Complete
- [ ] Renders correctly at 864×1536
- [ ] Content has 100px bottom padding (no navbar overlap)
- [ ] All data pulled from context/props (no hardcoded data)
- [ ] All navigation handlers work (onClick, navigate)
- [ ] Back button returns to correct page
- [ ] Modals have z-index: 200 and proper centering
- [ ] All clickable elements have hover states
- [ ] Touch targets minimum 44×44px
- [ ] Colors match design tokens exactly
- [ ] Typography uses SF Pro Text/Display
- [ ] Shadows are subtle (0 2px 10px rgba(0,0,0,0.02))
- [ ] Border radius matches patterns (12-16px)
- [ ] Responsive padding uses clamp()
- [ ] Currency formatted correctly (no double ৳)
- [ ] Free/Pro tier checks work (isPro)
- [ ] No console errors
- [ ] Smooth transitions (0.2s)

---

## 🚨 11. COMMON MISTAKES TO AVOID

### ❌ Wrong Patterns
```jsx
// DON'T: Fixed padding
padding: '20px'

// DON'T: Create fake data
const transactions = [{ id: 1, amount: 100 }];

// DON'T: Wrong modal z-index
zIndex: 50  // ← Too low, navbar will cover

// DON'T: Wrong modal name
openModal('transaction_detail')  // ← Should be camelCase

// DON'T: Missing bottom padding
paddingBottom: '32px'  // ← Not enough, navbar overlap

// DON'T: Double currency symbols
<span>৳ {formatCompact(amount)}</span>

// DON'T: Hardcoded colors
color: '#4AADE0'  // ← Old color, use #2D9CDB

// DON'T: Thick shadows
boxShadow: '0 10px 40px rgba(0,0,0,0.2)'  // ← Too heavy

// DON'T: Inline styles for repeated elements
// Use constants for repeated style objects
```

### ✅ Correct Patterns
```jsx
// DO: Responsive padding
padding: 'clamp(16px, 2.5vw, 24px)'

// DO: Pull from context
const { transactions } = useApp();

// DO: Proper modal z-index
zIndex: 200

// DO: CamelCase modal names
openModal('transactionDetail')

// DO: Sufficient bottom padding
paddingBottom: '100px'

// DO: Use formatBangla without symbol
<span>৳ {formatBangla(amount)}</span>

// DO: Use design tokens
color: '#2D9CDB'

// DO: Subtle shadows
boxShadow: '0 2px 10px rgba(0,0,0,0.02)'

// DO: Extract style objects
const cardStyle = { /* reusable styles */ };
```

---

## 📚 12. COMPONENT LIBRARY REFERENCE

### Available Icons (from shared/Icons.jsx)
```jsx
import {
  Home, Plus, Bell, Settings, User, Search,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  X, Check, AlertCircle, Info,
  TrendingUp, TrendingDown, BarChart2,
  Target, MessageCircle, Calendar,
  Cloud, RefreshCw, Edit, Trash,
  // ... and more
} from '../shared/Icons';

// Usage
<ChevronLeft size={24} color="#1F2937" strokeWidth={2} />
```

### Utility Functions
```javascript
// calculations.js
getTotalBalance(accounts)
getRecentTransactions(transactions, limit)
getTotalBudgetLimit(budgets)
getTotalBudgetSpent(budgets)
suggestCategory(merchant)

// formatters.js
formatCurrency(amount)
formatBangla(amount)
formatCompact(amount)
formatRelative(date)
formatDate(date)
getCategoryColor(category)
getCategoryEmoji(category)
```

---

## 🎓 13. IMPLEMENTATION WORKFLOW

### Step-by-Step Process
1. **Read existing page** - Understand current structure
2. **Pull data from context** - NEVER create fake data
3. **Create page wrapper** - Use standard template (paddingBottom: 100px!)
4. **Add header with back button** - Sticky, white background
5. **Build sections top-to-bottom** - Each with proper padding
6. **Apply card patterns** - Use exact shadows, borders, radius
7. **Make interactive elements clickable** - Proper hover states
8. **Add navigation handlers** - Test all clicks
9. **Format currency correctly** - No double ৳ symbols
10. **Test at 864×1536** - Verify no navbar overlap
11. **Add console.log for debugging** - Remove before commit
12. **Update routing in App.jsx** - Add page to screenMap

---

## 📝 14. QUICK REFERENCE CHEAT SHEET

```jsx
// Page Container
paddingBottom: '100px', maxWidth: '864px', margin: '0 auto'

// Responsive Padding
padding: 'clamp(16px, 2.5vw, 24px)'

// Card Style
backgroundColor: '#fff', borderRadius: '14px', padding: '18px',
boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #F3F4F6'

// Modal
zIndex: 200, maxWidth: '864px', paddingBottom: '100px',
left: '50%', transform: 'translateX(-50%)'

// Button Gradient
background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'

// Data Pulling
const { accounts, transactions, budgets } = useApp();

// Currency
<span>৳ {formatBangla(amount)}</span>

// Navigation
onClick={() => navigate('pageName')}

// Typography
fontFamily: SF (body) or SF_DISPLAY (headings)
```

---

## 🔄 15. VERSION HISTORY

**v1.0** (Feb 4, 2026)
- Initial playbook created based on Dashboard redesign
- Established responsive design system for 864×1536
- Documented modal positioning and z-index hierarchy
- Added data handling rules (no fake data)
- Created component patterns library

---

**END OF PLAYBOOK**

*This document should be sufficient to transform any page in Wally to match the modern SaaS design standard. When in doubt, reference the Dashboard component as the gold standard implementation.*
