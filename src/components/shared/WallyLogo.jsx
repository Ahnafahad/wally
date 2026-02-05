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

// Enhanced MerchantLogo with Real Brand Icons (Clearbit)
import { getLogoUrl } from '../../utils/brandMapping';

export function MerchantLogo({ merchant, size = 36, category, fallbackIcon }) {
  const [imgError, setImgError] = React.useState(false);

  // 1. Identify Brand Domain
  const logoUrl = getLogoUrl(merchant);

  // 2. Verified Brand Colors (Manual Map)
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
    // Local additions
    'Pickaboo': { bg: '#F39C12', text: 'Pb', textColor: '#fff', fontSize: 0.4 },
    'Ryans': { bg: '#1E1E1E', text: 'R', textColor: '#fff', fontSize: 0.5 },
    'Star Tech': { bg: '#EF4444', text: 'ST', textColor: '#fff', fontSize: 0.4 },
    'Aarong': { bg: '#F59E0B', text: 'Ar', textColor: '#fff', fontSize: 0.4 },
    'Meena Bazar': { bg: '#059669', text: 'MB', textColor: '#fff', fontSize: 0.35 },
    'Grameenphone': { bg: '#00A1E0', text: 'GP', textColor: '#fff', fontSize: 0.35 },
    'Robi': { bg: '#EB1C24', text: 'R', textColor: '#fff', fontSize: 0.5 },
    'Gloria Jeans': { bg: '#3E2723', text: 'GJ', textColor: '#fff', fontSize: 0.35 },
    'Dutch-Bangla': { bg: '#ED1C24', text: 'DB', textColor: '#fff', fontSize: 0.4 },
  };

  // Helper to find SPECIFIC config
  const getSpecificConfig = (name) => {
    if (!name) return null;
    // Exact match
    if (merchantLogos[name]) return merchantLogos[name];
    // Fuzzy fallback via keys
    const foundKey = Object.keys(merchantLogos).find(key => name.toLowerCase().includes(key.toLowerCase()));
    if (foundKey) return merchantLogos[foundKey];
    return null;
  };

  const specificConfig = getSpecificConfig(merchant);

  // 1. Render Real Image (Priority)
  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={merchant}
        onError={() => setImgError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${size * 0.25}px`,
          objectFit: 'contain',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        }}
      />
    );
  }

  // 2. Render Specific Manual Config (Fallback 1)
  if (specificConfig) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size * 0.25}px`,
        background: specificConfig.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: specificConfig.textColor,
        fontSize: `${size * specificConfig.fontSize}px`,
        fontWeight: 700,
        fontFamily: 'SF Pro Display, -apple-system, sans-serif',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      }}>
        {specificConfig.text}
      </div>
    );
  }

  // 3. Render Category Icon / Emoji (Fallback 2)
  if (fallbackIcon) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${size * 0.6}px`, // Appropriate size for emoji
      }}>
        {fallbackIcon}
      </div>
    );
  }

  // 4. Final Generic Fallback (Gray Box)
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${size * 0.25}px`,
      background: '#F3F4F6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6B7280',
      fontSize: `${size * 0.5}px`,
      fontWeight: 700,
      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
      flexShrink: 0,
    }}>
      {merchant ? merchant.charAt(0).toUpperCase() : '?'}
    </div>
  );
}
