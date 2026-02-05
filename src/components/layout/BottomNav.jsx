/**
 * Wally – Bottom Navigation Bar
 *
 * Fixed to the bottom of #app-frame.  Five tabs with a centre FAB that
 * floats above the bar and opens the "add transaction" modal.
 */

import React from 'react';
import { useApp } from '../../AppContext';
import * as Icons from '../shared/Icons';

// ─── Tab definitions ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',     label: 'Home',     Icon: Icons.Home           },
  { id: 'reports',       label: 'Analysis', Icon: Icons.BarChart2      },
  { id: 'FAB',           label: '',         Icon: Icons.Plus           },   // centre FAB
  { id: 'budget',        label: 'Budget',   Icon: Icons.Wallet         },
  { id: 'coach',         label: 'Coach',    Icon: Icons.MessageCircle  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function BottomNav() {
  const { screen, navigate, openModal } = useApp();

  return (
    <div
      style={{
        position       : 'sticky',
        bottom         : 0,
        left           : 0,
        right          : 0,
        width          : '100%',
        maxWidth       : '864px',
        margin         : '0 auto',
        minHeight      : 'calc(72px + env(safe-area-inset-bottom, 0px))',
        background     : '#FFFFFF',
        borderTop      : '1px solid #E5E7EB',
        boxShadow      : '0 -4px 16px rgba(0, 0, 0, 0.08)',
        zIndex         : 100,
        display        : 'flex',
        justifyContent : 'space-around',
        alignItems     : 'center',
        paddingBottom  : 'calc(16px + env(safe-area-inset-bottom, 0px))',
        marginTop      : 'auto',
      }}
    >
      {TABS.map((tab) => {
        // ── FAB (centre button) ──────────────────────────────────────────────
        if (tab.id === 'FAB') {
          return (
            <button
              key="FAB"
              onClick={() => openModal('transaction')}
              aria-label="Add transaction"
              style={{
                background     : 'none',
                border         : 'none',
                cursor         : 'pointer',
                padding        : 0,
                marginTop      : '-14px',   // lift above the nav bar
                display        : 'flex',
                alignItems     : 'center',
                justifyContent : 'center',
              }}
            >
              <div
                style={{
                  width          : '64px',
                  height         : '64px',
                  borderRadius   : '50%',
                  background     : 'linear-gradient(180deg, #56CCF2 0%, #2D9CDB 100%)',
                  boxShadow      : '0 0 0 4px #fff, 0 10px 15px -3px rgba(86, 204, 242, 0.4)',
                  display        : 'flex',
                  alignItems     : 'center',
                  justifyContent : 'center',
                }}
              >
                <Icons.Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
              </div>
            </button>
          );
        }

        // ── Regular tab ──────────────────────────────────────────────────────
        const isActive = screen === tab.id;
        const colour   = isActive ? '#2D9CDB' : '#8E8E93';

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            aria-label={tab.label}
            style={{
              background     : 'none',
              border         : 'none',
              cursor         : 'pointer',
              padding        : '4px 8px',
              display        : 'flex',
              flexDirection   : 'column',
              alignItems     : 'center',
              gap            : '2px',
            }}
          >
            <tab.Icon size={22} color={colour} strokeWidth={isActive ? 2.2 : 1.8} />
            <span
              style={{
                fontSize   : '10px',
                fontWeight : isActive ? 600 : 400,
                color      : colour,
                fontFamily : 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                lineHeight : 1,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
