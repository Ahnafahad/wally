/**
 * Wally Logo Component
 *
 * Uses actual logo assets from Design folder.
 * Available in multiple variants and sizes.
 */

import React from 'react';
import logoIcon from '../../assets/logo-icon.jpg';
import logoWithText from '../../assets/logo-with-text.png';

export function WallyLogo({ size = 32, variant = 'icon' }) {
  if (variant === 'full') {
    return (
      <img
        src={logoWithText}
        alt="Wally"
        style={{
          height: `${size}px`,
          objectFit: 'contain',
          imageRendering: '-webkit-optimize-contrast',
        }}
      />
    );
  }

  // Icon-only version - clean logo without background
  return (
    <img
      src={logoIcon}
      alt="Wally"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        objectFit: 'contain',
        imageRendering: '-webkit-optimize-contrast',
      }}
    />
  );
}

export function WallyWordmark({ size = 20 }) {
  return (
    <img
      src={logoWithText}
      alt="Wally"
      style={{ height: `${size}px`, objectFit: 'contain' }}
    />
  );
}

export function MerchantLogo({ merchant, size = 36, category }) {
  // Map of merchant names to logo configurations
  const merchantLogos = {
    'KFC': { bg: '#E4002B', text: 'KFC', textColor: '#fff', fontSize: 0.35 },
    'Shwapno': { bg: '#00A651', text: 'S', textColor: '#fff', fontSize: 0.5 },
    'Uber': { bg: '#000000', text: 'uber', textColor: '#fff', fontSize: 0.32 },
    'Netflix': { bg: '#E50914', text: 'N', textColor: '#fff', fontSize: 0.5 },
    'Spotify': { bg: '#1DB954', text: '♪', textColor: '#fff', fontSize: 0.55 },
    'Amazon': { bg: '#FF9900', text: 'a', textColor: '#fff', fontSize: 0.5 },
    'Starbucks': { bg: '#00704A', text: '★', textColor: '#fff', fontSize: 0.5 },
    'McDonald\'s': { bg: '#FFC72C', text: 'M', textColor: '#DA291C', fontSize: 0.5 },
    'Daraz': { bg: '#F85606', text: 'D', textColor: '#fff', fontSize: 0.5 },
    'bKash': { bg: '#E2136E', text: 'bKash', textColor: '#fff', fontSize: 0.28 },
    'Nagad': { bg: '#EE3A24', text: 'N', textColor: '#fff', fontSize: 0.5 },
    'Pathao': { bg: '#D83535', text: 'P', textColor: '#fff', fontSize: 0.5 },
    'Foodpanda': { bg: '#D70F64', text: 'fp', textColor: '#fff', fontSize: 0.32 },
    'Uber Eats': { bg: '#06C167', text: 'UE', textColor: '#000', fontSize: 0.35 },
    'Target': { bg: '#CC0000', text: '◎', textColor: '#fff', fontSize: 0.5 },
    'Walmart': { bg: '#0071CE', text: 'W', textColor: '#FFC220', fontSize: 0.5 },
    'Best Buy': { bg: '#0046BE', text: 'BB', textColor: '#FFF200', fontSize: 0.35 },
    'Shell': { bg: '#FBCE07', text: 'S', textColor: '#DD1D21', fontSize: 0.5 },
    'BP': { bg: '#00703C', text: 'BP', textColor: '#FFF200', fontSize: 0.35 },
    'Chevron': { bg: '#003DA5', text: 'C', textColor: '#E31837', fontSize: 0.5 },
  };

  const config = merchantLogos[merchant];

  if (config) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size * 0.25}px`,
        background: config.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: config.textColor,
        fontSize: `${size * config.fontSize}px`,
        fontWeight: 700,
        fontFamily: 'SF Pro Display, -apple-system, sans-serif',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        {config.text}
      </div>
    );
  }

  // Fallback: return null to let caller use category emoji instead
  return null;
}
