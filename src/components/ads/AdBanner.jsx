/**
 * Wally – Sponsored Ad Banner
 *
 * Thin, dismissible card shown on the Dashboard for free-tier users.
 * Pulls the current ad from context; dismiss hides it for the session.
 */

import React, { useState } from 'react';
import { useApp }          from '../../AppContext';
import * as Icons          from '../shared/Icons';

export default function AdBanner() {
  const { ads, currentAdIndex } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const ad = ads[currentAdIndex % ads.length];

  // Derive a very light tint from the brand colour for the card background.
  // logoColor is always a hex string like "#E8272B".
  const tintStyle = { backgroundColor: ad.logoColor + '18' }; // ~9 % opacity hex alpha

  return (
    <div style={{ paddingLeft: '20px', paddingRight: '20px', marginTop: '12px' }}>
      <div
        style={{
          display        : 'flex',
          alignItems     : 'center',
          gap            : '10px',
          borderRadius   : '12px',
          border         : `1px solid ${ad.logoColor}33`,
          padding        : '10px 10px 10px 12px',
          ...tintStyle,
        }}
      >
        {/* ── Brand logo square ──────────────────────────────────────────── */}
        <div
          style={{
            width          : '40px',
            height         : '40px',
            borderRadius   : '9px',
            backgroundColor: ad.logoColor,
            display        : 'flex',
            alignItems     : 'center',
            justifyContent : 'center',
            flexShrink     : 0,
          }}
        >
          <span
            style={{
              color      : '#FFFFFF',
              fontSize   : '11px',
              fontWeight : 700,
              fontFamily : 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              whiteSpace : 'nowrap',
              overflow   : 'hidden',
              textOverflow: 'ellipsis',
              maxWidth   : '34px',
              textAlign  : 'center',
            }}
          >
            {ad.logoText.slice(0, 4)}
          </span>
        </div>

        {/* ── Text block ─────────────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Sponsored badge */}
          <span
            style={{
              display        : 'inline-block',
              fontSize       : '9px',
              fontWeight     : 600,
              color          : '#8E8E93',
              backgroundColor: 'rgba(142,142,147,0.12)',
              borderRadius   : '3px',
              padding        : '1px 5px',
              marginBottom   : '2px',
              letterSpacing  : '0.03em',
              textTransform  : 'uppercase',
              fontFamily     : 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            Sponsored
          </span>

          {/* Title */}
          <div
            style={{
              fontSize   : '13px',
              fontWeight : 600,
              color      : '#1C1C1E',
              fontFamily : 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              whiteSpace : 'nowrap',
              overflow   : 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {ad.title}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize   : '11px',
              color      : '#8E8E93',
              fontFamily : 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              whiteSpace : 'nowrap',
              overflow   : 'hidden',
              textOverflow: 'ellipsis',
              marginTop  : '1px',
            }}
          >
            {ad.description}
          </div>
        </div>

        {/* ── Dismiss button ─────────────────────────────────────────────── */}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss ad"
          style={{
            background : 'none',
            border     : 'none',
            cursor     : 'pointer',
            padding    : '4px',
            display    : 'flex',
            alignItems : 'center',
            justifyContent: 'center',
            flexShrink : 0,
          }}
        >
          <Icons.X size={16} color="#8E8E93" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
