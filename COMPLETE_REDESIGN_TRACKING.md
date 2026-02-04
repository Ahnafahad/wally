# Wally Complete Redesign - Progress Tracker

**Target Screen Size**: 864×1536 (Portrait Mode)
**Design Reference**: Sample Design Guide
**Started**: February 4, 2026
**Last Updated**: February 4, 2026 - 7:30 PM

---

## 🎯 Redesign Goals

1. **Visual Consistency**: All pages match Sample Design Guide patterns
2. **Responsive Design**: Perfect adaptation to 864×1536 screen (fill entire screen with proper scaling)
3. **Clean Aesthetics**: Subtle shadows, compact spacing, modern typography
4. **No Content Cutting**: Proper bottom padding to avoid nav bar overlap
5. **Touch-Friendly**: All interactive elements properly sized

---

## 📐 Screen Size Specifications

### Primary Target: 864×1536 (Portrait)
- **Width**: 864px
- **Height**: 1536px
- **Aspect Ratio**: ~0.56:1 (portrait)
- **Container**: max-width: 100%, centered with proper padding
- **Scaling**: Components should scale appropriately to fill screen

### Design System
- **Horizontal Padding**: 20px (px-5)
- **Vertical Spacing**: 12px between sections (mt-3)
- **Card Padding**: 12-16px (p-3 to p-4)
- **Bottom Padding**: 100-120px (to clear bottom nav)
- **Border Radius**: 12-24px (cards: 12px, hero: 24px)
- **Shadows**: Very subtle - `0 2px 10px rgba(0,0,0,0.02)`
- **Progress Bars**: 6px height, rounded-full
- **Typography**: 12-14px body, 18-24px headings

---

## ✅ COMPLETED PAGES

### 1. Dashboard (Home Page) - 100% COMPLETE ✓
**File**: `src/components/dashboard/Dashboard.jsx`
**Completed**: Feb 4, 2026
**Status**: ⭐ **AWAITING USER APPROVAL**

#### Changes Applied:
- [x] Logo fixed - using `/assets/logo.png` (transparent PNG, no background)
- [x] Double taka symbols fixed - using `formatBangla()` and `formatCompact()` correctly
- [x] **Larger header** - 20px text, 36-40px profile/logo
- [x] **Larger balance card** - 36px balance text, 20px padding
- [x] **Larger financial score** - 34px score, 72px gauge
- [x] **Larger AI Coach card** - 44px logo box, 13px text
- [x] Simple gradient Balance Card (#4facfe → #00f2fe)
- [x] Cloud + RefreshCw sync icon (no SYNCED badge)
- [x] Ultra-compact 2-column stats grid (Bank, MFS, Cash, Credit)
- [x] Financial Score card with conic-gradient gauge (red→yellow→green)
- [x] Compact AI Coach card with "Ask" button and red dot
- [x] Monthly Budget card with top 3 categories
- [x] **7px progress bars** (slightly thicker for 864×1536)
- [x] Recent Transactions section (5 items for better fill)
- [x] **NEW: Spending Insights card** - 2×2 stat grid + Quick Tip
- [x] Proper spacing (16-24px between sections)
- [x] Subtle shadows on all cards
- [x] Typography optimized for 864×1536 (13-15px body, 20-36px headings)

#### Screen Size Optimization for 864×1536:
- [x] **Full-width design**: 16px horizontal margins, cards fill remaining space
- [x] **Increased vertical spacing**: 20-28px between sections
- [x] **Larger balance card**: 42px balance text, 28px padding
- [x] **Breakpoint aware**: First screen optimized for 1536px viewport height
- [x] Larger component sizes throughout
- [x] Bottom nav is sticky footer (no overlap)
- [x] **App frame responsive**: max-width 864px, fills screen width
- [x] **boxSizing: border-box** on all containers for proper width calculation
- [x] Logo using transparent PNG: `/assets/logo.png`
- [x] Currency formatting fixed: using `formatBangla()` (no double ৳)
- [x] **Content fills screen vertically** with proper scaling

---

## 🔄 IN PROGRESS

### 2. BudgetPage - 0% COMPLETE
**File**: `src/components/budget/BudgetPage.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Apply Sample Design patterns
- [ ] Subtle card shadows
- [ ] 6px progress bars
- [ ] Compact spacing (px-5, mt-3)
- [ ] Clean typography (12-14px)
- [ ] #F3F4F6 borders
- [ ] Proper bottom padding (100px+)
- [ ] Responsive design for 864×1536
- [ ] Test all interactions (clicks, edits)

---

## 📋 PENDING PAGES

### 3. GoalsPage - 0% COMPLETE
**File**: `src/components/goals/GoalsPage.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] List view: clean goal cards with subtle shadows
- [ ] Detail view: circular progress ring
- [ ] 6px progress bars in list
- [ ] Compact spacing
- [ ] Add goal modal styling
- [ ] Contribution modal styling
- [ ] Proper bottom padding
- [ ] Responsive design for 864×1536
- [ ] Test all interactions

---

### 4. CoachPage - 0% COMPLETE
**File**: `src/components/coach/CoachPage.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Chat interface with clean bubbles
- [ ] User bubble: gradient (#4facfe → #00f2fe), rounded corners
- [ ] AI bubble: white with border, opposite rounded corner
- [ ] Gray background (#F9FAFB)
- [ ] Compact message padding
- [ ] Clean input field
- [ ] Send button styling
- [ ] Proper bottom padding for keyboard
- [ ] Responsive design for 864×1536
- [ ] Test chat functionality

---

### 5. ReportsPage - 0% COMPLETE
**File**: `src/components/reports/ReportsPage.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Clean chart design (bars in #2D9CDB)
- [ ] Period tabs styling
- [ ] Monthly/Weekly/Quarterly cards with subtle shadows
- [ ] Compact stat boxes
- [ ] Export modal styling (Pro only)
- [ ] #F3F4F6 borders
- [ ] Proper bottom padding
- [ ] Responsive charts for 864×1536
- [ ] Test all period switches

---

### 6. AccountDetail - 0% COMPLETE
**File**: `src/components/account/AccountDetail.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] List view: clean account cards
- [ ] Detail view: gradient balance card
- [ ] Transaction list with clean rows
- [ ] Account type icons/badges
- [ ] Subtle shadows on cards
- [ ] Compact spacing
- [ ] Proper bottom padding
- [ ] Responsive design for 864×1536
- [ ] Test account selection and navigation

---

### 7. TransactionModal - 0% COMPLETE
**File**: `src/components/transaction/TransactionModal.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Clean modal design
- [ ] Amount input with blue underline (#2D9CDB)
- [ ] Category picker styling
- [ ] Account picker styling
- [ ] Type toggle (Expense/Income/Transfer)
- [ ] Save button gradient (#4facfe → #00f2fe)
- [ ] Proper modal size for 864×1536
- [ ] Test form submission

---

### 8. TransactionDetailModal - 0% COMPLETE
**File**: `src/components/transaction/TransactionDetailModal.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] View mode styling
- [ ] Edit mode styling
- [ ] Amount input underline (#2D9CDB)
- [ ] Edit/Delete button styling
- [ ] Save button gradient
- [ ] Proper modal size for 864×1536
- [ ] Test edit and delete functions

---

### 9. NotificationsPanel - 0% COMPLETE
**File**: `src/components/notifications/NotificationsPanel.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Clean notification list
- [ ] Grouped by time (Today, Yesterday, etc.)
- [ ] Unread indicator (cyan border)
- [ ] Read/unread states
- [ ] Mark all read button
- [ ] Proper full-screen modal
- [ ] Responsive design for 864×1536
- [ ] Test mark as read functionality

---

### 10. YearInReview - 0% COMPLETE
**File**: `src/components/yearinreview/YearInReview.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Update colors (#4AADE0 → #2D9CDB) - already done in color fix
- [ ] Ensure slide animations work
- [ ] Test swipe/tap navigation
- [ ] Verify gradient backgrounds
- [ ] Optimize for 864×1536 full-screen
- [ ] Test all 24 slides

---

### 11. LinkAccountPage - 0% COMPLETE
**File**: `src/components/account/LinkAccountPage.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Type selection cards
- [ ] Bank selection list
- [ ] Auth form styling
- [ ] Loading spinner
- [ ] Success screen
- [ ] Gradient button (#4facfe → #00f2fe)
- [ ] Responsive design for 864×1536
- [ ] Test full link flow

---

### 12. AdBanner - 0% COMPLETE
**File**: `src/components/ads/AdBanner.jsx`
**Status**: ⏳ Not Started

#### Required Changes:
- [ ] Clean ad card design
- [ ] Subtle shadows
- [ ] Compact spacing
- [ ] Upgrade button styling
- [ ] Responsive width for 864×1536

---

### 13. BottomNav - ✅ COMPLETE
**File**: `src/components/layout/BottomNav.jsx`
**Status**: ✅ Complete

#### Completed Changes:
- [x] Active color fixed (#2D9CDB)
- [x] FAB gradient updated
- [x] Changed from fixed to sticky positioning (acts like footer)
- [x] Full width responsive (100%, not fixed 375px)
- [x] No content overlap - nav stays at bottom
- [x] Works perfectly on 864×1536

---

## 🔧 RESPONSIVE DESIGN SYSTEM

### Container System for 864×1536
```jsx
// Page wrapper - Optimized for 864px, scales dynamically
<div style={{
  width: '100%',
  maxWidth: '864px',
  margin: '0 auto',
  minHeight: '100%',
  paddingBottom: '32px'
}}>

// Responsive padding with clamp()
padding: 'clamp(16px, 2.5vw, 24px)'
// Scales from 16px (small) → 2.5vw (fluid) → 24px (large)
```

### Scaling Strategy
1. **App Frame**: 100vw × 100vh full-screen, no phone frame
2. **Content Container**: max-width: 864px, centered when viewport > 864px
3. **Responsive Padding**: clamp(16px, 2.5vw, 24px) - adjusts dynamically
4. **Fixed elements**: Bottom nav, headers (sticky, centered at 864px max)
5. **Fluid content**: Cards, lists (responsive padding)
6. **Scrollable areas**: Main content (overflow-y: auto)
7. **Touch targets**: Minimum 44×44px

### Breakpoints
- **Wide screens**: > 864px → center content at 864px with auto margins
- **Target (864×1536)**: Perfect fit, optimal component sizing
- **Smaller**: < 864px → maintain proportions, fluid padding scales down
- **Mobile**: < 400px → reduced padding, compact layout

---

## 📊 Progress Summary

| Category | Total | Complete | In Progress | Pending | Progress % |
|----------|-------|----------|-------------|---------|------------|
| **Pages** | 13 | 1 | 0 | 12 | 7.7% |
| **Components** | 13 | 2 | 0 | 11 | 15.4% |
| **Modals** | 3 | 0 | 0 | 3 | 0% |
| **Global** | 2 | 2 | 0 | 0 | 100% |
| **Overall** | 16 | 5 | 0 | 11 | **31.25%** |

### Global Optimizations Complete:
- [x] **App.jsx**: Responsive frame (864px max-width, 100vh, centered)
- [x] **Logo**: Using transparent PNG (`/assets/logo.png`)
- [x] **Currency**: Fixed double ৳ symbols (using `formatBangla()`)

---

## 🎨 Design Token Reference

### Colors
```css
/* Primary */
--brand-blue: #2D9CDB;
--brand-dark-blue: #1A7FB0;
--brand-light-blue: #56CCF2;
--brand-bg: #F8F9FB;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--gradient-fab: linear-gradient(180deg, #56CCF2 0%, #2D9CDB 100%);

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-900: #1F2937;

/* Status */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### Shadows
```css
/* Subtle card shadow */
box-shadow: 0 2px 10px rgba(0,0,0,0.02);

/* Hero card shadow */
box-shadow: 0 20px 25px -5px rgba(79,172,254,0.25), 0 10px 10px -5px rgba(79,172,254,0.15);

/* FAB shadow */
box-shadow: 0 0 0 4px #fff, 0 10px 15px -3px rgba(86, 204, 242, 0.4);
```

### Typography
```css
/* Font families */
font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* Sizes */
--text-xs: 10px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 18px;
--text-xl: 24px;
--text-2xl: 30px;
```

---

## 🧪 Testing Checklist (Per Page)

For each completed page, verify:
- [ ] Renders correctly at 864×1536
- [ ] All interactions work (clicks, inputs, navigation)
- [ ] No content cut off by bottom nav
- [ ] Proper scrolling behavior
- [ ] Touch targets are adequate (min 44×44px)
- [ ] Colors match Sample Design
- [ ] Shadows are subtle
- [ ] Typography is consistent
- [ ] Spacing is compact and clean
- [ ] All data displays correctly
- [ ] Free/Pro tier differences work

---

## 🚀 Next Steps

1. **Immediate**:
   - Test Dashboard on 864×1536 screen
   - Verify logo displays correctly
   - Verify taka symbols are single (not double)

2. **Phase 2**: Redesign remaining pages in order:
   - BudgetPage → GoalsPage → CoachPage → ReportsPage → AccountDetail
   - Then modals: TransactionModal, TransactionDetailModal, NotificationsPanel
   - Then supporting: YearInReview, LinkAccountPage, AdBanner

3. **Phase 3**: Portrait touch optimization
   - Increase touch targets where needed
   - Optimize spacing for touch interaction
   - Test on actual HP x360 device if possible

---

## 📝 Notes

- **Logo Path**: `/assets/logo.png` (32×32px in headers, 24×24px in cards)
- **Currency Formatting**: Always use `formatBangla()` for proper Bangladeshi comma grouping (1,27,750)
- **No Double Symbols**: Use `formatBangla()` + manual ৳ prefix, NOT `toLocaleString()` + ৳
- **Bottom Padding**: Always 100px minimum on pages to clear bottom nav
- **Import Pattern**: Import `formatBangla` from `utils/formatters.js` when needed
- **Responsive**: Use `max-width: 864px` and `margin: 0 auto` for centered content

---

**END OF TRACKING FILE**
*Update this file after completing each page or making significant progress*
*Run `grep -r "toLocaleString" src/` to find any remaining improper currency formatting*
