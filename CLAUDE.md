# Wally — CLAUDE.md

## Project Overview
Wally is an investor-demo prototype for a Bangladeshi fintech money management mobile app. It is a React + Vite single-page application rendered inside a fixed 375×812px iPhone frame. No backend or API calls — all data is hard-coded for demo purposes.

## Tech Stack
- **React 18** — component framework
- **Vite 6** — build tool and dev server (`npm run dev`)
- **Tailwind CSS 4** — via `@tailwindcss/vite` plugin (utility classes available, but see Styling below)
- **Framer Motion 11** — animations (used in YearInReview slide transitions)
- **Recharts 2** — bar/pie charts in ReportsPage
- **React Router DOM 6** — installed but **not used**; navigation is manual via context

## Running the App
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
npm run preview    # preview production build
```

## Directory Layout
```
src/
├── main.jsx               # React root entry
├── index.css              # Global styles, CSS design tokens, base reset
├── App.jsx                # Root shell: app frame, status bar, screen router, dev user-switcher
├── AppContext.jsx          # Global state provider (the only state store)
│
├── components/
│   ├── dashboard/         # Dashboard.jsx — home screen
│   ├── budget/            # BudgetPage.jsx
│   ├── goals/             # GoalsPage.jsx (list + detail dual-view)
│   ├── coach/             # CoachPage.jsx — AI financial coach chat
│   ├── reports/           # ReportsPage.jsx — charts & analytics
│   ├── account/           # AccountDetail.jsx (list + single-account dual-view)
│   ├── transaction/       # TransactionModal.jsx — add/edit transaction overlay
│   ├── notifications/     # NotificationsPanel.jsx
│   ├── yearinreview/      # YearInReview.jsx — 24-slide "Wrapped" feature
│   ├── ads/               # AdBanner.jsx — free-tier ad card
│   ├── layout/            # BottomNav.jsx — 5-tab nav + center FAB
│   └── shared/            # Icons.jsx — SVG icon library (factory pattern)
│
├── utils/
│   ├── formatters.js      # Currency (৳), date, category color/emoji helpers
│   └── calculations.js    # Balance totals, recent txns, merchant→category suggestion
│
└── data/                  # All static demo data
    ├── accounts/          # rafiq.js (Free), sarah.js (Pro)
    ├── transactions/      # rafiq.js, sarah.js — 12 months each
    ├── budgets/           # rafiq.js, sarah.js
    ├── goals/             # rafiq.js, sarah.js
    ├── reports.js         # Pre-aggregated chart data
    ├── notifications.js
    ├── ads.js
    └── aiResponses.js     # 7 pre-written AI coach Q&A pairs
```

## State Management
All global state lives in `AppContext.jsx`. There is no Redux, Zustand, or other store library.

Key state:
- `user` — `'rafiq'` (Free tier) or `'sarah'` (Pro tier). Switched via a low-opacity gear button in the bottom-right corner of App.jsx.
- `screen` — current page name; `navigate(screenName)` changes it.
- `showModal` — `'transaction'`, `'notifications'`, or `null`.
- `showYearInReview` — boolean for the full-screen overlay.
- `selectedAccount` — the account object when viewing a single account in AccountDetail.
- Derived values (`isPro`, `accounts`, `budgets`, `goals`, `transactions`) are computed from the current user inside the provider.

## Styling Conventions
- **Inline styles are the dominant pattern.** Almost all component styling uses `style={{}}` objects. Do not add CSS classes or modules for component-level styling — match the existing inline approach.
- Tailwind utility classes are only used sparingly (e.g., `.scroll-hide`).
- Design tokens are defined as CSS custom properties in `index.css` (`--cyan-primary`, `--green-positive`, `--radius-card`, etc.). Reference them via `var(--name)` in inline styles where appropriate.
- Font families are defined as JS constants inside components: `const SF = '-apple-system, ...'` and `const SF_DISPLAY = '...'`. Copy this pattern in new components.
- The app frame is always 375×812px; content scrolls inside it with `overflow-y: auto`. A 72px bottom padding clears the fixed nav bar.

## Navigation
Navigation is **not** React Router. It is a simple screen-name string in context:
- Call `navigate('dashboard')`, `navigate('budget')`, etc.
- For account detail: `navigate('account', { selectedAccount: accountObj })`.
- Modals are separate: `openModal('transaction')` / `closeModal()`.

## Two-Tier Demo (Free vs Pro)
- **Rafiq** = Free tier. Has ads, limited goals (2 active, 3rd locked), limited AI questions (2/month), fewer report period options.
- **Sarah** = Pro tier. No ads, unlimited goals, unlimited AI, all report periods, AI suggestions in BudgetPage, export button in ReportsPage.
- Check `isPro` from context to gate features. The existing pattern uses inline conditionals or early-return guards.

## Data & Dates
- All dates use `YYYY-MM-DD` ISO format internally.
- "Today" is hard-coded as **2026-02-04** in `formatters.js` for relative-date calculations. If you add new data, use dates relative to this reference.
- Currency is Bangladeshi Taka (৳). Use `formatCurrency()` and `formatBangla()` from `utils/formatters.js` — do not format numbers manually.
- Bangladeshi comma grouping (1,27,750) is used, not Western (127,750).

## Icons
All icons are in `src/components/shared/Icons.jsx` using a factory pattern. To add a new icon, add an SVG path export following the existing `svg(...)` pattern. Import icons directly: `import { Home, Plus } from '../shared/Icons'`.

## Key Patterns to Follow
1. **Dual-view components** — GoalsPage and AccountDetail each render either a list or a detail view based on local state. Use this pattern for any new list→detail flow.
2. **Category suggestion** — `suggestCategory(merchant)` in `calculations.js` uses keyword rules. Add new merchants there, not in components.
3. **Progress bars** — use the `.progress-track` / `.progress-fill` CSS classes defined in `index.css`.
4. **Touch targets** — interactive elements should meet 44×44px minimum. Use the `.touch-target` utility class or set `minWidth`/`minHeight` in inline styles.
5. **SVG progress ring** — GoalsPage uses an SVG circle with `strokeDashoffset` for circular progress. Reuse the same math (`2πr`, offset calculation) if needed elsewhere.

## What NOT to Do
- Do not add API calls, fetch, or async data loading — this is a static demo.
- Do not add localStorage or persistence — data intentionally resets on refresh.
- Do not use React Router for navigation — use the context `navigate()` function.
- Do not add CSS modules or styled-components — use inline styles to match the codebase.
- Do not add TypeScript — the project is plain JavaScript/JSX.
- Do not install new dependencies without a clear reason; the current set covers all needs.

## AI Integration & Development Notes
- **Gemini API**: The AI Coach (`CoachPage.jsx`) is configured to use Google's Gemini API for live responses. The API key is stored in `.env` as `VITE_GEMINI_API_KEY`. The implementation includes a fallback to pre-written responses (from `data/aiResponses.js`) if the API call fails. Context is injected into prompts to provide personalized financial advice.
- **Plan Tracking**: When working on feature implementations that follow a development plan, update the plan file after completing each task. Mark completed tasks with `[x] DONE` and add a brief note if the implementation deviated from the original plan. This keeps the plan as a live record of progress.
