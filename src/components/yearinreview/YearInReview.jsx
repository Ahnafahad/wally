/**
 * Wally – Year in Review  ("Spotify Wrapped" style)
 *
 * 24 full-screen slides with framer-motion transitions, dot-progress
 * indicators, and left/right-half tap navigation.  Each slide has its
 * own gradient palette and single-stat layout.
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence }       from 'framer-motion';
import { useApp }                        from '../../AppContext';
import { X }                             from '../shared/Icons';
import { formatCurrency }                from '../../utils/formatters';

// ─── Confetti-dot layer (used on Slide 2) ────────────────────────────────────
function ConfettiDots() {
  const dots = [
    { left: '8%',  top: '12%', color: '#FFD700', size: 10, delay: '0s'   },
    { left: '82%', top: '8%',  color: '#FF6B6B', size: 7,  delay: '0.3s' },
    { left: '15%', top: '60%', color: '#2D9CDB', size: 12, delay: '0.6s' },
    { left: '75%', top: '55%', color: '#34C759', size: 8,  delay: '0.9s' },
    { left: '50%', top: '18%', color: '#AF52DE', size: 6,  delay: '0.2s' },
    { left: '5%',  top: '40%', color: '#FF9500', size: 9,  delay: '0.5s' },
    { left: '90%', top: '35%', color: '#64D2FF', size: 11, delay: '0.8s' },
    { left: '30%', top: '75%', color: '#FFD700', size: 7,  delay: '1.0s' },
    { left: '65%', top: '80%', color: '#FF375F', size: 10, delay: '0.4s' },
    { left: '45%', top: '70%', color: '#2D9CDB', size: 8,  delay: '0.7s' },
    { left: '22%', top: '30%', color: '#34C759', size: 6,  delay: '1.1s' },
    { left: '88%', top: '68%', color: '#AF52DE', size: 9,  delay: '0.1s' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.left, top: d.top,
          width: d.size, height: d.size, borderRadius: '50%',
          background: d.color, opacity: 0.7,
          animation: `confettiFall 3s ease-in-out ${d.delay} infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── CSS injection (confetti keyframes) ──────────────────────────────────────
const CONFETTI_CSS = `
@keyframes confettiFall {
  0%   { transform: translateY(0) rotate(0deg);   opacity: 0.7; }
  100% { transform: translateY(30px) rotate(180deg); opacity: 0.3; }
}
`;
function injectConfettiCSS() {
  if (document.getElementById('wally-confetti-css')) return;
  const tag = document.createElement('style');
  tag.id = 'wally-confetti-css';
  tag.textContent = CONFETTI_CSS;
  document.head.appendChild(tag);
}

// ─── Slide definitions ───────────────────────────────────────────────────────
// Each slide is a render function: (user) => JSX.  Backgrounds are inline.
// Common text style helpers
const W = (s) => ({ fontFamily: 'SF Pro Display, -apple-system, sans-serif', ...s });
const T = (s) => ({ fontFamily: 'SF Pro Text, -apple-system, sans-serif', ...s });

function Slide0({ user }) {
  return (
    <div style={{ background: 'linear-gradient(160deg, #2D9CDB 0%, #1a5276 50%, #0d2137 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* decorative circle */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-80px', right: '-80px' }} />
      <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: '-60px', left: '-60px' }} />

      <p style={W({ fontSize: '16px', color: 'rgba(255,255,255,0.85)', margin: '0 0 8px', fontWeight: 400 })}>Your 2025</p>
      <p style={W({ fontSize: '38px', color: '#fff', margin: 0, fontWeight: 700, textAlign: 'center', lineHeight: 1.15 })}>Financial<br/>Journey</p>
      <p style={W({ fontSize: '20px', color: '#fff', margin: '16px 0 0', fontWeight: 500 })}>{user === 'sarah' ? 'Sarah' : 'Rafiq'}</p>
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <p style={T({ fontSize: '13px', color: 'rgba(255,255,255,0.50)', margin: 0 })}>Swipe to explore</p>
        <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.60)', animation: 'slideDown 1.8s ease-in-out infinite' }}>›</span>
      </div>
    </div>
  );
}

function Slide1() {
  return (
    <div style={{ background: '#1a1a2e', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: '0 0 6px', fontWeight: 400 })}>You earned</p>
        <p style={W({ fontSize: '40px', color: '#fff', margin: 0, fontWeight: 700 })}>{formatCurrency(840000)}</p>
      </div>
      <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: '0 0 6px', fontWeight: 400 })}>You spent</p>
        <p style={W({ fontSize: '40px', color: '#fff', margin: 0, fontWeight: 700 })}>{formatCurrency(625000)}</p>
      </div>
      <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ textAlign: 'center' }}>
        <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: '0 0 6px', fontWeight: 400 })}>You saved</p>
        <p style={W({ fontSize: '40px', color: '#34C759', margin: 0, fontWeight: 700 })}>{formatCurrency(215000)}</p>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div style={{ background: 'linear-gradient(150deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <ConfettiDots />
      {/* arc ring */}
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ marginBottom: '24px' }}>
        <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="12" />
        <circle cx="80" cy="80" r="64" fill="none" stroke="#2D9CDB" strokeWidth="12"
          strokeDasharray={`${0.256 * 402.1} ${402.1}`} strokeDashoffset={-100.5}
          strokeLinecap="round" transform="rotate(-90 80 80)" />
        <text x="80" y="76" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="700" fontFamily="SF Pro Display, -apple-system, sans-serif">25.6%</text>
        <text x="80" y="96" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="SF Pro Text, -apple-system, sans-serif">saved</text>
      </svg>
      <p style={W({ fontSize: '22px', color: '#fff', margin: 0, fontWeight: 700, textAlign: 'center', lineHeight: 1.3, maxWidth: '260px' })}>
        You saved 25.6% of your income!
      </p>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: '10px 0 0', textAlign: 'center' })}>
        That is 5% more than the average saver
      </p>
    </div>
  );
}

function Slide3() {
  return (
    <div style={{ background: 'linear-gradient(145deg, #1C1C2E 0%, #2a2a4a 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px', padding: '0 24px' }}>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: 0 })}>This year you made</p>
      <p style={W({ fontSize: '56px', color: '#fff', margin: 0, fontWeight: 700, lineHeight: 1 })}>384</p>
      <p style={W({ fontSize: '18px', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 500 })}>transactions</p>
      <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.2)', margin: '4px 0' }} />
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.55)', margin: 0, textAlign: 'center', lineHeight: 1.5 })}>
        280 expenses · 24 income · 80 transfers<br/>
        <span style={{ color: 'rgba(255,255,255,0.35)' }}>32 transactions per month on average</span>
      </p>
    </div>
  );
}

function Slide4() {
  return (
    <div style={{ background: 'linear-gradient(155deg, #FF9500 0%, #FF6B00 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 24px' }}>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' })}>#1 Category</p>
      <p style={W({ fontSize: '28px', color: '#fff', margin: '6px 0 0', fontWeight: 700 })}>Food &amp; Dining</p>
      <span style={{ fontSize: '64px', lineHeight: 1.1 }}>🍽️</span>
      <p style={W({ fontSize: '26px', color: '#fff', margin: '4px 0 0', fontWeight: 700 })}>{formatCurrency(189600)}</p>
      <p style={T({ fontSize: '15px', color: 'rgba(255,255,255,0.80)', margin: '2px 0 0' })}>30% of your total spending</p>
      <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 16px' }}>
        <p style={T({ fontSize: '13px', color: '#fff', margin: 0 })}>
          Enough for <strong>2,107 cups of coffee!</strong>
        </p>
      </div>
    </div>
  );
}

function Slide5() {
  const places = [
    { medal: '🥇', name: 'Shwapno',           amount: 45200 },
    { medal: '🥈', name: 'Star Kabab',        amount: 32800 },
    { medal: '🥉', name: 'bKash Merchants',   amount: 28500 },
  ];
  return (
    <div style={{ background: 'linear-gradient(150deg, #1a1a2e 0%, #16213e 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '0 24px' }}>
      <p style={W({ fontSize: '22px', color: '#fff', margin: 0, fontWeight: 700 })}>Your top 3 places</p>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {places.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px 18px',
          }}>
            <span style={{ fontSize: '32px' }}>{p.medal}</span>
            <div style={{ flex: 1 }}>
              <p style={W({ fontSize: '17px', color: '#fff', margin: 0, fontWeight: 600 })}>{p.name}</p>
            </div>
            <p style={W({ fontSize: '18px', color: '#2D9CDB', margin: 0, fontWeight: 700 })}>{formatCurrency(p.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Slide6() {
  return (
    <div style={{ background: 'linear-gradient(155deg, #1C1C2E 0%, #2C1654 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 24px' }}>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.50)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 })}>Your biggest purchase</p>
      <span style={{ fontSize: '56px', marginTop: '10px' }}>💎</span>
      <p style={W({ fontSize: '42px', color: '#fff', margin: '4px 0 0', fontWeight: 700 })}>{formatCurrency(45000)}</p>
      <p style={W({ fontSize: '18px', color: 'rgba(255,255,255,0.80)', margin: '6px 0 0', fontWeight: 500 })}>Apple Watch at Pickaboo</p>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.40)', margin: '4px 0 0' })}>December 10, 2025</p>
    </div>
  );
}

function Slide7() {
  return (
    <div style={{ background: 'linear-gradient(150deg, #0d4f3c 0%, #1a7a5c 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '0 24px' }}>
      {/* best saving */}
      <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '16px', padding: '20px 24px', textAlign: 'center', width: '100%' }}>
        <p style={T({ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: '0 0 4px' })}>Best saving month</p>
        <p style={W({ fontSize: '22px', color: '#fff', margin: 0, fontWeight: 700 })}>March 2025</p>
        <p style={W({ fontSize: '20px', color: '#34C759', margin: '4px 0 0', fontWeight: 600 })}>Saved {formatCurrency(24500)}</p>
      </div>
      {/* highest earning */}
      <div style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '16px', padding: '20px 24px', textAlign: 'center', width: '100%' }}>
        <p style={T({ fontSize: '13px', color: 'rgba(255,255,255,0.60)', margin: '0 0 4px' })}>Highest earning</p>
        <p style={W({ fontSize: '22px', color: '#fff', margin: 0, fontWeight: 700 })}>December 2025</p>
        <p style={W({ fontSize: '20px', color: '#2D9CDB', margin: '4px 0 0', fontWeight: 600 })}>Earned {formatCurrency(105000)}</p>
      </div>
    </div>
  );
}

// Slides 8-22: single-stat slides.  Each has bg, emoji, big text, sub text.
const SINGLE_STAT_SLIDES = [
  // 8
  { bg: 'linear-gradient(150deg, #1a1a2e 0%, #0f3460 100%)',        emoji: '🔥', big: '365 day streak!',                                                                    sub: 'You logged in or checked finances every single day of 2025.' },
  // 9
  { bg: 'linear-gradient(155deg, #1C3144 0%, #2E6B8A 100%)',        emoji: '🚗', big: formatCurrency(48000) + ' on transport',                                              sub: 'That is the equivalent of 240 Uber rides across the city.' },
  // 10
  { bg: 'linear-gradient(150deg, #0d4f3c 0%, #1a7a5c 100%)',        emoji: '💪', big: formatCurrency(18500) + ' invested in health',                                        sub: 'Gym memberships, pharmacy visits, and check-ups combined.' },
  // 11
  { bg: 'linear-gradient(150deg, #1a1a2e 0%, #3a2070 100%)',        emoji: '📚', big: 'Education: ' + formatCurrency(12000),                                               sub: 'Courses on Udemy, Coursera, and more. An investment in you.' },
  // 12
  { bg: 'linear-gradient(155deg, #2C1654 0%, #4A1942 100%)',        emoji: '🎬', big: formatCurrency(36800) + ' on entertainment',                                         sub: 'Movies ৳ 12k · Streaming ৳ 14.4k · Gaming ৳ 10.4k' },
  // 13
  { bg: 'linear-gradient(150deg, #3B2410 0%, #6B4226 100%)',        emoji: '☕', big: '82 cups of coffee',                                                                  sub: formatCurrency(35650) + ' total. About ৳ 435 per cup.' },
  // 14
  { bg: 'linear-gradient(155deg, #1a3a1a 0%, #2E7D32 100%)',        emoji: '🎯', big: '9 out of 12 months on budget',                                                       sub: 'Budget discipline is one of the hardest habits. You nailed it.' },
  // 15
  { bg: 'linear-gradient(150deg, #1a1a2e 0%, #FFD700 100%)',        emoji: '🏆', big: '2 goals completed!',                                                                  sub: 'You crushed two financial goals in 2025. Keep the streak alive.' },
  // 16
  { bg: 'linear-gradient(150deg, #0d2137 0%, #1a5276 100%)',        emoji: '💳', big: 'Avg utilization 24%',                                                                  sub: 'Excellent credit health. Lenders love numbers below 30%.' },
  // 17
  { bg: 'linear-gradient(155deg, #2C1654 0%, #AF52DE 100%)',        emoji: '🛍️', big: 'Most active day: Saturday',                                                          sub: 'Weekends are your peak spending days — plan accordingly.' },
  // 18
  { bg: 'linear-gradient(150deg, #0a0a1a 0%, #1a1a3e 100%)',        emoji: '🌙', big: formatCurrency(22000) + ' spent after 10 PM',                                         sub: 'Late-night impulse buys add up. Might be worth a sleep-on-it rule.' },
  // 19
  { bg: 'linear-gradient(150deg, #3a1010 0%, #6B2020 100%)',        emoji: '💪', big: 'Over budget 3 times',                                                                  sub: 'But you bounced back every single time. That is resilience.' },
  // 20
  { bg: 'linear-gradient(155deg, #2C1654 0%, #6A1B9A 100%)',        emoji: '📉', big: 'Shopping: 17% over budget',                                                           sub: 'Something to keep an eye on in 2026. Small tweaks go a long way.' },
  // 21
  { bg: 'linear-gradient(150deg, #0d4f3c 0%, #34C759 100%)',        emoji: '📈', big: 'Income grew 8%',                                                                      sub: 'Steady upward trajectory. Keep building on that momentum.' },
  // 22
  { bg: 'linear-gradient(150deg, #0d2137 0%, #2D9CDB 100%)',        emoji: '🚀', big: '2026 goals set',                                                                      sub: 'You have already mapped out the road ahead. Keep the momentum!' },
];

function SingleStatSlide({ slide }) {
  return (
    <div style={{ background: slide.bg, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '0 28px' }}>
      <span style={{ fontSize: '62px', lineHeight: 1.1 }}>{slide.emoji}</span>
      <p style={W({ fontSize: '24px', color: '#fff', margin: '4px 0 0', fontWeight: 700, textAlign: 'center', lineHeight: 1.25 })}>
        {slide.big}
      </p>
      <p style={T({ fontSize: '14px', color: 'rgba(255,255,255,0.60)', margin: '4px 0 0', textAlign: 'center', lineHeight: 1.45, maxWidth: '280px' })}>
        {slide.sub}
      </p>
    </div>
  );
}

function Slide23({ setShowYearInReview }) {
  return (
    <div style={{ background: 'linear-gradient(155deg, #2D9CDB 0%, #1a5276 50%, #0d2137 100%)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '0 28px' }}>
      <span style={{ fontSize: '48px' }}>🎉</span>
      <p style={W({ fontSize: '24px', color: '#fff', margin: '8px 0 0', fontWeight: 700, textAlign: 'center', lineHeight: 1.25 })}>
        Thank you for using Wally in 2025!
      </p>
      <p style={W({ fontSize: '20px', color: 'rgba(255,255,255,0.80)', margin: '4px 0 0', fontWeight: 500 })}>
        Here is to 2026!  🎉
      </p>

      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
        {/* Share button */}
        <button style={{
          padding: '12px', border: '2px solid rgba(255,255,255,0.70)', borderRadius: '12px',
          background: 'transparent', cursor: 'pointer',
        }}>
          <span style={W({ fontSize: '15px', color: '#fff', fontWeight: 600 })}>Share Your Year</span>
        </button>
        {/* Back to Home */}
        <button
          onClick={() => setShowYearInReview(false)}
          style={{
            padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #2D9CDB 0%, #2E8DB8 100%)',
            boxShadow: '0 4px 14px rgba(74,173,224,0.40)',
          }}
        >
          <span style={W({ fontSize: '15px', color: '#fff', fontWeight: 700 })}>Back to Home</span>
        </button>
      </div>
    </div>
  );
}

// ─── Master slide renderer ────────────────────────────────────────────────────
function renderSlide(idx, user, setShowYearInReview) {
  if (idx === 0) return <Slide0 user={user} />;
  if (idx === 1) return <Slide1 />;
  if (idx === 2) return <Slide2 />;
  if (idx === 3) return <Slide3 />;
  if (idx === 4) return <Slide4 />;
  if (idx === 5) return <Slide5 />;
  if (idx === 6) return <Slide6 />;
  if (idx === 7) return <Slide7 />;
  if (idx >= 8 && idx <= 22) return <SingleStatSlide slide={SINGLE_STAT_SLIDES[idx - 8]} />;
  if (idx === 23) return <Slide23 setShowYearInReview={setShowYearInReview} />;
  return null;
}

// ─── Main component ──────────────────────────────────────────────────────────
const TOTAL_SLIDES = 24;

export default function YearInReview() {
  injectConfettiCSS();
  const { user, setShowYearInReview } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = useCallback(() => {
    setCurrentSlide(s => (s < TOTAL_SLIDES - 1 ? s + 1 : s));
  }, []);
  const goPrev = useCallback(() => {
    setCurrentSlide(s => (s > 0 ? s - 1 : s));
  }, []);

  // ── tap-zone handler: left half → prev, right half → next ──────────────
  function handleTap(e) {
    const rect  = e.currentTarget.getBoundingClientRect();
    const relX  = e.clientX - rect.left;
    if (relX < rect.width / 2) goPrev();
    else                       goNext();
  }

  // ─── JSX ───────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: '#000', overflow: 'hidden' }}>

      {/* ── Close button (always visible, top-right) ───────────────────── */}
      <button
        onClick={() => setShowYearInReview(false)}
        style={{
          position: 'absolute', top: '52px', right: '16px', zIndex: 70,
          background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '20px',
          width: '34px', height: '34px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer',
        }}
      >
        <X size={18} color="#fff" strokeWidth={2.2} />
      </button>

      {/* ── Dot progress indicator (top centre) ─────────────────────────── */}
      <div style={{
        position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 70, display: 'flex', gap: '6px', alignItems: 'center',
      }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <div
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
            style={{
              width: i === currentSlide ? '22px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === currentSlide ? '#fff' : 'rgba(255,255,255,0.30)',
              transition: 'width 0.3s ease, background 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Slide area with framer-motion ─────────────────────────────── */}
      <div
        onClick={handleTap}
        style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {renderSlide(currentSlide, user, setShowYearInReview)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide counter (bottom centre, subtle) ────────────────────── */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 70,
      }}>
        <span style={T({ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500 })}>
          {currentSlide + 1} / {TOTAL_SLIDES}
        </span>
      </div>

      {/* ── Swipe hint arrows (left / right, very subtle) ──────────────── */}
      {currentSlide > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          style={{
            position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 70, background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '16px',
            width: '28px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ color: '#fff', fontSize: '18px' }}>‹</span>
        </button>
      )}
      {currentSlide < TOTAL_SLIDES - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{
            position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 70, background: 'rgba(0,0,0,0.25)', border: 'none', borderRadius: '16px',
            width: '28px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span style={{ color: '#fff', fontSize: '18px' }}>›</span>
        </button>
      )}

      {/* inline keyframe for slide-0 arrow bounce */}
      <style>{`@keyframes slideDown { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }`}</style>
    </div>
  );
}
