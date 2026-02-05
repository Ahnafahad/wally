import React from 'react';
import { useApp } from '../../AppContext';
import * as Icons from '../shared/Icons';

const SF = 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif';

export default function AdBanner({ adIndex = 0 }) {
  const { ads } = useApp();

  const ad = ads[adIndex % ads.length];

  return (
    <a
      href={ad.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        margin: '0 clamp(16px, 2.5vw, 24px)',
        padding: '16px',
        background: ad.bgColor,
        color: ad.textColor,
        borderRadius: '14px',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
    >
      {/* AD badge */}
      <span style={{
        fontSize: '9px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        opacity: 0.7,
        marginBottom: '8px',
        display: 'block',
        fontFamily: SF,
      }}>
        Sponsored
      </span>

      {/* Logo + Content */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {ad.logo && (
          <img
            src={ad.logo}
            alt={ad.title}
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#fff',
              padding: '4px',
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '4px',
            fontFamily: SF,
          }}>
            {ad.title}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '13px',
            opacity: 0.95,
            lineHeight: 1.4,
            fontFamily: SF,
          }}>
            {ad.description}
          </p>
          {ad.disclaimer && (
            <p style={{
              margin: '6px 0 0',
              fontSize: '10px',
              opacity: 0.7,
              fontFamily: SF,
            }}>
              {ad.disclaimer}
            </p>
          )}
        </div>
        {/* Arrow icon */}
        <Icons.ChevronRight size={20} color={ad.textColor} style={{ flexShrink: 0 }} />
      </div>

      {/* CTA button */}
      <button style={{
        marginTop: '12px',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        color: ad.textColor,
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
        fontFamily: SF,
      }}>
        {ad.cta} →
      </button>
    </a>
  );
}
