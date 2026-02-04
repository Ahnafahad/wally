/**
 * Wally – AI Financial Coach
 *
 * Chat interface with quick-question pills, typing indicator,
 * per-user question budgets (free vs Pro), and aiData-driven responses.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp }          from '../../AppContext';
import { ChevronLeft }     from '../shared/Icons';

// ─── Typing-indicator dot animation (CSS keyframes injected once) ──────────
const TYPING_CSS = `
@keyframes wallyBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1;   }
}
`;
function injectTypingCSS() {
  if (document.getElementById('wally-typing-css')) return;
  const tag = document.createElement('style');
  tag.id        = 'wally-typing-css';
  tag.textContent = TYPING_CSS;
  document.head.appendChild(tag);
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CoachPage() {
  injectTypingCSS();

  const {
    isPro,
    aiData,
    aiQuestionsLeft,
    useAiQuestion,
    chatHistory,
    setChatHistory,
    navigate,
  } = useApp();

  const scrollRef = useRef(null);

  // auto-scroll to bottom whenever chatHistory changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // ── quick-question keys in the exact order requested ──────────────────────
  const questionKeys = [
    'how-did-i-do',
    'where-overspending',
    'can-i-afford-goal',
    'credit-card-health',
    'budget-suggestions',
    'savings-rate',
    'compare-months',
  ];

  // ── handle a quick-question tap ───────────────────────────────────────────
  function handleQuestion(key) {
    const entry = aiData[key];
    if (!entry) return;

    // gate: free users with 0 questions left may not ask
    if (!isPro && aiQuestionsLeft <= 0) return;

    const userMsg  = { role: 'user',  text: entry.question };
    const dotMsg   = { role: 'ai',    text: '...' };

    setChatHistory(prev => [...prev, userMsg, dotMsg]);
    useAiQuestion();

    // after 1 200 ms replace the typing dot with the real response
    setTimeout(() => {
      setChatHistory(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: 'ai', text: entry.response };
        return copy;
      });
    }, 1200);
  }

  // ── render helpers ─────────────────────────────────────────────────────────
  const isFirstAiMessage = (idx) => {
    // true when this is the very first message in the history
    return idx === 0 && chatHistory[idx]?.role === 'ai';
  };

  function TypingDots() {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              display      : 'inline-block',
              width        : '8px',
              height       : '8px',
              borderRadius : '50%',
              background   : '#C7C7CC',
              animation    : `wallyBounce 1.4s infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // ─── JSX ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--white)', paddingBottom: '100px' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        background: 'var(--white)',
        borderBottom: '1px solid var(--gray-200)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => navigate('dashboard')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            minWidth: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gray-100)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <ChevronLeft size={24} color="var(--cyan-primary)" strokeWidth={2.2} />
        </button>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'var(--gray-900)',
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          letterSpacing: '-0.02em',
        }}>
          AI Coach
        </span>
        {/* placeholder to keep title centred */}
        <div style={{ width: '40px' }} />
      </div>

      {/* ── Pro / Free banner ─────────────────────────────────────────────── */}
      {isPro ? (
        <div style={{ padding: '12px 24px', flexShrink: 0 }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--green-light)',
            color: 'var(--green-positive)',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
          }}>
            Unlimited Access
          </span>
        </div>
      ) : (
        <div style={{
          margin: '12px 24px',
          padding: '14px 16px',
          background: 'var(--white)',
          border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          flexShrink: 0,
          boxShadow: 'var(--shadow-card)',
        }}>
          {aiQuestionsLeft > 0 ? (
            <span style={{
              fontSize: '13px',
              color: 'var(--cyan-dark)',
              fontWeight: 600,
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}>
              {aiQuestionsLeft} question{aiQuestionsLeft === 1 ? '' : 's'} remaining this month
            </span>
          ) : (
            <span style={{
              fontSize: '13px',
              color: 'var(--cyan-dark)',
              fontWeight: 700,
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}>
              Upgrade to Pro for unlimited questions
            </span>
          )}
        </div>
      )}

      {/* ── Chat area ─────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="scroll-hide"
        style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F9FAFB' }}
      >
        {chatHistory.map((msg, idx) => {
          const isAi       = msg.role === 'ai';
          const isTyping   = isAi && msg.text === '...';
          const isWelcome  = isFirstAiMessage(idx);

          if (isAi) {
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '85%' }}>
                {/* W-logo circle for the welcome message */}
                {isWelcome && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--cyan-primary), var(--cyan-dark))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '6px',
                    marginLeft: '4px',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    <span style={{
                      color: 'var(--white)',
                      fontSize: '14px',
                      fontWeight: 700,
                      fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                    }}>W</span>
                  </div>
                )}

                {/* bubble */}
                <div style={{
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-card)',
                  borderRadius: '0px 16px 16px 16px',
                  padding: '12px 14px',
                  border: '1px solid var(--gray-200)',
                }}>
                  {isTyping ? <TypingDots /> : (
                    <span style={{
                      fontSize: '14px',
                      color: 'var(--gray-900)',
                      lineHeight: 1.5,
                      fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    }}>
                      {msg.text}
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // ── user bubble ──────────────────────────────────────────────────
          return (
            <div key={idx} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '16px 0px 16px 16px',
                padding: '10px 14px',
                maxWidth: '80%',
                boxShadow: 'var(--shadow-md)',
              }}>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--white)',
                  lineHeight: 1.5,
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  {msg.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick-question pills ──────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, paddingBottom: '12px', background: 'var(--white)', borderTop: '1px solid var(--gray-200)' }}>
        <div
          className="scroll-hide"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '12px 24px',
          }}
        >
          {questionKeys.map(key => {
            const entry = aiData[key];
            if (!entry) return null;
            const blocked = !isPro && aiQuestionsLeft <= 0;
            return (
              <button
                key={key}
                onClick={() => handleQuestion(key)}
                disabled={blocked}
                style={{
                  whiteSpace     : 'nowrap',
                  background     : blocked ? 'var(--gray-100)' : 'var(--white)',
                  border         : `2px solid ${blocked ? 'var(--gray-300)' : '#2D9CDB'}`,
                  borderRadius   : 'var(--radius-full)',
                  padding        : '8px 16px',
                  minHeight      : '36px',
                  fontSize       : '13px',
                  fontWeight     : 600,
                  color          : blocked ? 'var(--gray-500)' : '#2D9CDB',
                  cursor         : blocked ? 'default' : 'pointer',
                  fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                  transition     : 'all 0.2s ease',
                  boxShadow      : blocked ? 'none' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  if (!blocked) {
                    e.currentTarget.style.background = '#2D9CDB';
                    e.currentTarget.style.color = 'var(--white)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!blocked) {
                    e.currentTarget.style.background = 'var(--white)';
                    e.currentTarget.style.color = '#2D9CDB';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
              >
                {entry.question}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
