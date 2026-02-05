/**
 * Wally – Shared SVG Icon Library
 *
 * All icons (except Bell) are built with the svg() factory so that
 * the boilerplate <svg> wrapper is written exactly once.
 *
 * Props accepted by every icon:
 *   size        – pixel width & height          (default 24)
 *   color       – stroke / fill colour string   (default 'currentColor')
 *   strokeWidth – numeric stroke-width          (default 2)
 *   …rest       – forwarded to the <svg> element
 *
 * Bell also accepts:
 *   count       – notification badge number     (default 0)
 */

import React from 'react';

// ─── Factory ────────────────────────────────────────────────────────────────
const svg = (paths) => (props) => {
  const { size = 24, color = 'currentColor', strokeWidth = 2, ...rest } = props || {};
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths}
    </svg>
  );
};

// ─── Home ───────────────────────────────────────────────────────────────────
export const Home = svg(
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </>
);

// ─── BarChart2 ───────────────────────────────────────────────────────────────
export const BarChart2 = svg(
  <>
    <line x1="6"  y1="20" x2="6"  y2="14" />
    <line x1="12" y1="20" x2="12" y2="4"  />
    <line x1="18" y1="20" x2="18" y2="10" />
  </>
);

// ─── Plus ────────────────────────────────────────────────────────────────────
export const Plus = svg(
  <>
    <line x1="12" y1="5"  x2="12" y2="19" />
    <line x1="5"  y1="12" x2="19" y2="12" />
  </>
);

// ─── Target ──────────────────────────────────────────────────────────────────
export const Target = svg(
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6"  />
    <circle cx="12" cy="12" r="2"  />
  </>
);

// ─── MessageCircle ───────────────────────────────────────────────────────────
export const MessageCircle = svg(
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
);

// ─── ChevronLeft ─────────────────────────────────────────────────────────────
export const ChevronLeft = svg(
  <polyline points="15 18 9 12 15 6" />
);

// ─── ChevronRight ────────────────────────────────────────────────────────────
export const ChevronRight = svg(
  <polyline points="9 18 15 12 9 6" />
);

// ─── ChevronDown ─────────────────────────────────────────────────────────────
export const ChevronDown = svg(
  <polyline points="6 9 12 15 18 9" />
);

// ─── X (close) ───────────────────────────────────────────────────────────────
export const X = svg(
  <>
    <line x1="18" y1="6"  x2="6"  y2="18" />
    <line x1="6"  y1="6"  x2="18" y2="18" />
  </>
);

// ─── Check ───────────────────────────────────────────────────────────────────
export const Check = svg(
  <polyline points="20 6 9 17 4 12" />
);

// ─── CreditCard ──────────────────────────────────────────────────────────────
export const CreditCard = svg(
  <>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </>
);

// ─── Wallet ──────────────────────────────────────────────────────────────────
export const Wallet = svg(
  <>
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
    <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
  </>
);

// ─── TrendingUp ──────────────────────────────────────────────────────────────
export const TrendingUp = svg(
  <>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </>
);

// ─── TrendingDown ────────────────────────────────────────────────────────────
export const TrendingDown = svg(
  <>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </>
);

// ─── Sparkles ────────────────────────────────────────────────────────────────
export const Sparkles = svg(
  <>
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    <path d="M5 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
  </>
);

// ─── CloudDone ───────────────────────────────────────────────────────────────
export const CloudDone = svg(
  <>
    <path d="M9 12l2 2 4-4" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </>
);

// ─── Lock ────────────────────────────────────────────────────────────────────
export const Lock = svg(
  <>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
);

// ─── Share ───────────────────────────────────────────────────────────────────
export const Share = svg(
  <>
    <circle cx="18" cy="5"  r="3" />
    <circle cx="6"  cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
  </>
);

// ─── Search ──────────────────────────────────────────────────────────────────
export const Search = svg(
  <>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>
);

// ─── ArrowUp ─────────────────────────────────────────────────────────────────
export const ArrowUp = svg(
  <>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </>
);

// ─── Cloud ──────────────────────────────────────────────────────────────────
export const Cloud = svg(
  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
);

// ─── RefreshCw ───────────────────────────────────────────────────────────────
export const RefreshCw = svg(
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </>
);

// ─── User ────────────────────────────────────────────────────────────────────
export const User = svg(
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);

// ─── Bell (special – standalone, supports 'count' badge) ────────────────────
export function Bell(props) {
  const { size = 24, color = 'currentColor', strokeWidth = 2, count = 0, ...rest } = props || {};

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {/* Bell body */}
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      {/* Bell clapper */}
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />

      {/* Badge – rendered only when count > 0 */}
      {count > 0 && (
        <>
          <circle cx="20" cy="4" r="4.5" fill="#FF3B30" stroke="none" />
          <text
            x="20"
            y="4"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#fff"
            stroke="none"
            strokeWidth="0"
            fontSize="5.5"
            fontWeight="700"
            fontFamily="SF Pro Display, -apple-system, sans-serif"
          >
            {count > 9 ? '9+' : String(count)}
          </text>
        </>
      )}
    </svg>
  );
}
