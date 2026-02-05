/**
 * Wally – AI Financial Coach
 *
 * Chat interface with quick-question pills, custom text input,
 * Gemini API integration, typing indicator,
 * per-user question budgets (free vs Pro), and aiData-driven responses.
 * Pro users also get a personalised investment-options analysis.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp }                              from '../../AppContext';
import { ChevronLeft, ArrowUp }                from '../shared/Icons';
import { GoogleGenerativeAI }                  from '@google/generative-ai';
import { formatBangla }                        from '../../utils/formatters';
import { getTotalBalance }                     from '../../utils/calculations';

// ─── Gemini setup ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
  tag.id          = 'wally-typing-css';
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
    accounts,
    goals,
    transactions,
    pendingCoachPrompt,
    setPendingCoachPrompt,
  } = useApp();

  const scrollRef  = useRef(null);
  const inputRef   = useRef(null);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending]       = useState(false);
  const [showRec, setShowRec]           = useState(true);

  // credit-card dues for the recommendation card
  const creditDues = accounts
    .filter(a => a.type === 'credit_card')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  // auto-scroll to bottom whenever chatHistory changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // auto-send a pending prompt when coach opens from an insight card
  useEffect(() => {
    if (pendingCoachPrompt) {
      setPendingCoachPrompt(null);
      handleSendQuestion(pendingCoachPrompt);
    }
  }, [pendingCoachPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── quick-question keys ──────────────────────────────────────────────────
  const questionKeys = [
    ...(isPro ? ['investment-options'] : []),
    'how-did-i-do',
    'where-overspending',
    'can-i-afford-goal',
    'credit-card-health',
    'budget-suggestions',
    'savings-rate',
    'compare-months',
  ];

  // ── financial context builder (injected into every Gemini prompt) ────────
  function buildFinancialContext() {
    const totalBalance    = getTotalBalance(accounts);
    const monthlyIncome   = transactions
      .filter(t => t.type === 'income' && t.date.startsWith('2026-02'))
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.startsWith('2026-02'))
      .reduce((sum, t) => sum + t.amount, 0);

    // top spending category this month
    const catTotals = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith('2026-02'))
      .forEach(t => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const savingsRate = monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)
      : '0';

    return `You are a helpful financial advisor for a Bangladeshi fintech app called Wally.
The user's financial snapshot:
- Total balance: ৳${formatBangla(totalBalance)}
- Monthly income (Feb 2026): ৳${formatBangla(monthlyIncome)}
- Monthly expenses (Feb 2026): ৳${formatBangla(monthlyExpenses)}
- Savings rate: ${savingsRate}%
- Top spending category: ${topCategory}
- Active goals: ${goals.filter(g => g.isActive).length}
Keep responses brief (2-3 sentences), actionable, and use Bangladeshi Taka (৳) format.`;
  }

  // ── send a question: preset → Gemini ────────────────────────────────────
  async function handleSendQuestion(questionText) {
    if (!isPro && aiQuestionsLeft <= 0) return;

    setChatHistory(prev => [...prev,
      { role: 'user', text: questionText },
      { role: 'ai',   text: '...' },          // typing indicator
    ]);
    useAiQuestion();

    // ── easter egg: founder code ──
    if (/can\s+i\s+buy\s+ismail\s+ali/i.test(questionText)) {
      setTimeout(() => {
        setChatHistory(prev => {
          const c = [...prev];
          c[c.length - 1] = { role: 'ai', text: "😄 Ismail Ali, our founder? Well, you can **buy** him for ৳1,000 or **rent** him per night for ৳100. Quite the bargain, don't you think? (Just kidding — he's priceless and not for sale!)" };
          return c;
        });
      }, 1200);
      return;
    }

    // ── preset-question match ──
    const presetKey = Object.keys(aiData).find(k =>
      aiData[k].question.toLowerCase() === questionText.toLowerCase()
    );
    if (presetKey) {
      setTimeout(() => {
        setChatHistory(prev => {
          const c = [...prev];
          c[c.length - 1] = { role: 'ai', text: aiData[presetKey].response };
          return c;
        });
      }, 1200);
      return;
    }

    // ── custom question → Gemini API ──
    try {
      const prompt  = `${buildFinancialContext()}\n\nUser question: ${questionText}\n\nProvide a concise, helpful response in 2-3 sentences.`;
      const result  = await model.generateContent(prompt);
      const aiText  = (await result.response).text();
      setChatHistory(prev => {
        const c = [...prev];
        c[c.length - 1] = { role: 'ai', text: aiText };
        return c;
      });
    } catch (err) {
      console.error('Gemini API error:', err);
      setChatHistory(prev => {
        const c = [...prev];
        c[c.length - 1] = { role: 'ai', text: "I'm having trouble connecting right now. Try one of the preset questions above, or ask me later!" };
        return c;
      });
    }
  }

  // ── quick-question pill tap ──────────────────────────────────────────────
  function handleQuestion(key) {
    if (key === 'investment-options') {
      handleSendQuestion('Show me investment options');
      return;
    }
    const entry = aiData[key];
    if (!entry || (!isPro && aiQuestionsLeft <= 0)) return;
    handleSendQuestion(entry.question);
  }

  // ── text-input submit ────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!messageInput.trim() || isSending) return;
    setIsSending(true);
    const text = messageInput.trim();
    setMessageInput('');
    await handleSendQuestion(text);
    setIsSending(false);
  }

  // ── render helpers ───────────────────────────────────────────────────────
  const isFirstAiMessage = (idx) => idx === 0 && chatHistory[idx]?.role === 'ai';

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

  // Renders AI text with **bold** and clickable URLs ("Visit →")
  function renderMessageText(text) {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // ── URLs ──
      const urlPattern = /(https?:\/\/[^\s]+)/;
      if (urlPattern.test(line)) {
        const parts = line.split(urlPattern);
        return (
          <div key={i} style={{ marginBottom: '4px' }}>
            {parts.map((part, j) =>
              /^https?:\/\//.test(part) ? (
                <a
                  key={j}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#2D9CDB', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '13px' }}
                >
                  Visit →
                </a>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </div>
        );
      }
      // ── **bold** text ──
      if (line.includes('**')) {
        const parts = line.split(/\*\*([^*]+)\*\*/);
        return (
          <div key={i} style={{ marginBottom: '4px' }}>
            {parts.map((part, j) =>
              j % 2 === 1
                ? <strong key={j} style={{ color: '#1F2937' }}>{part}</strong>
                : <span key={j}>{part}</span>
            )}
          </div>
        );
      }
      // ── plain line (empty → extra gap) ──
      return <div key={i} style={{ marginBottom: line ? '4px' : '8px' }}>{line}</div>;
    });
  }

  // ─── JSX ─────────────────────────────────────────────────────────────────
  const inputBlocked = !isPro && aiQuestionsLeft <= 0;
  const sendDisabled = !messageInput.trim() || isSending || inputBlocked;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--white)' }}>

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

      {/* ── AI recommendation nudge (Pro only) ───────────────────────────── */}
      {isPro && showRec && creditDues > 0 && (
        <div style={{
          margin     : '0 16px 4px',
          padding    : '13px 14px',
          background : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border     : '1px solid #a7f3d0',
          borderRadius: '14px',
          flexShrink : 0,
          position   : 'relative',
        }}>
          {/* dismiss */}
          <button
            onClick={() => setShowRec(false)}
            style={{
              position: 'absolute', top: '6px', right: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '18px', color: '#6B7280', padding: '2px 4px', lineHeight: 1,
            }}
          >×</button>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ fontSize: '15px' }}>💡</span>
            <span style={{
              fontSize: '11px', fontWeight: 700, color: '#065f46',
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              Wally suggests
            </span>
          </div>

          {/* body */}
          <p style={{
            fontSize: '13px', color: '#047857', lineHeight: 1.45, margin: '0 0 10px',
            fontFamily: 'SF Pro Text, -apple-system, sans-serif', paddingRight: '18px',
          }}>
            You cut spending 15% from last month — but card dues are still sitting at <strong>৳ {formatBangla(creditDues)}</strong>. Interest is quietly eating your surplus. Pay it off first, then point that same cash at MBA Fund — that single reorder puts you 2 months ahead on your biggest goal.
          </p>

          {/* opt-in CTA */}
          <button
            onClick={() => { setShowRec(false); handleSendQuestion('Show me investment options'); }}
            style={{
              background  : 'linear-gradient(135deg, #10B981, #34D399)',
              border      : 'none',
              borderRadius: '8px',
              padding     : '7px 14px',
              color       : '#fff',
              fontSize    : '13px',
              fontWeight  : 600,
              cursor      : 'pointer',
              fontFamily  : 'SF Pro Text, -apple-system, sans-serif',
            }}
          >
            Tell me more →
          </button>
        </div>
      )}

      {/* ── Chat area ─────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="scroll-hide"
        style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F9FAFB' }}
      >
        {chatHistory.map((msg, idx) => {
          const isAi      = msg.role === 'ai';
          const isTyping  = isAi && msg.text === '...';
          const isWelcome = isFirstAiMessage(idx);

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
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--gray-900)',
                      lineHeight: 1.5,
                      fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                    }}>
                      {renderMessageText(msg.text)}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── user bubble ────────────────────────────────────────────────
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

      {/* ── Text input bar ────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: '12px 24px', background: 'var(--white)', borderTop: '1px solid var(--gray-200)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask me anything about your finances…"
            disabled={inputBlocked || isSending}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--gray-200)',
              background: inputBlocked ? 'var(--gray-100)' : '#F9FAFB',
              fontSize: '14px',
              color: 'var(--gray-900)',
              fontFamily: 'SF Pro Text, -apple-system, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e)  => { if (!inputBlocked) e.target.style.borderColor = 'var(--cyan-primary)'; }}
            onBlur={(e)   => { e.target.style.borderColor = 'var(--gray-200)'; }}
          />
          <button
            onClick={handleSubmit}
            disabled={sendDisabled}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: sendDisabled
                ? 'var(--gray-200)'
                : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: sendDisabled ? 'default' : 'pointer',
              boxShadow: sendDisabled ? 'none' : '0 4px 14px rgba(74,173,224,0.35)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            <ArrowUp size={20} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* ── Quick-question pills ──────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, paddingBottom: '12px', background: 'var(--white)' }}>
        <div
          className="scroll-hide"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '8px 24px',
          }}
        >
          {questionKeys.map(key => {
            const isInvest = key === 'investment-options';
            const entry    = isInvest ? { question: 'Show me investment options' } : aiData[key];
            if (!entry) return null;
            const blocked  = !isPro && aiQuestionsLeft <= 0;
            const accentColor = isInvest ? '#10B981' : '#2D9CDB';

            return (
              <button
                key={key}
                onClick={() => handleQuestion(key)}
                disabled={blocked}
                style={{
                  whiteSpace     : 'nowrap',
                  background     : blocked ? 'var(--gray-100)' : 'var(--white)',
                  border         : `2px solid ${blocked ? 'var(--gray-300)' : accentColor}`,
                  borderRadius   : 'var(--radius-full)',
                  padding        : '8px 16px',
                  minHeight      : '36px',
                  fontSize       : '13px',
                  fontWeight     : 600,
                  color          : blocked ? 'var(--gray-500)' : accentColor,
                  cursor         : blocked ? 'default' : 'pointer',
                  fontFamily     : 'SF Pro Text, -apple-system, sans-serif',
                  transition     : 'all 0.2s ease',
                  boxShadow      : blocked ? 'none' : 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  if (!blocked) {
                    e.currentTarget.style.background  = accentColor;
                    e.currentTarget.style.color       = 'var(--white)';
                    e.currentTarget.style.transform   = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow   = 'var(--shadow-md)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!blocked) {
                    e.currentTarget.style.background  = 'var(--white)';
                    e.currentTarget.style.color       = accentColor;
                    e.currentTarget.style.transform   = 'translateY(0)';
                    e.currentTarget.style.boxShadow   = 'var(--shadow-sm)';
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
