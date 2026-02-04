/**
 * Wally – Notifications Panel
 *
 * Full-screen overlay grouped by time period (Today / Yesterday /
 * This Week / Earlier).  Unread items have a cyan left-border accent
 * and a tinted background; tapping marks them read.
 */

import React from 'react';
import { useApp } from '../../AppContext';
import { X }      from '../shared/Icons';

// ─── icon-circle background colours keyed by notification type ────────────
const TYPE_BG = {
  budget_alert : '#FF950033',   // orange 20 %
  goal         : '#2D9CDB33',   // cyan  20 %
  credit_card  : '#FF375F33',   // red   20 %
  transaction  : '#AF52DE33',   // purple 20 %
  ai           : '#34C75933',   // green 20 %
  sync         : '#8E8E9333',   // gray  20 %
  system       : '#64D2FF33',   // sky   20 %
};

// ─── Grouping helper ─────────────────────────────────────────────────────────
function groupNotifications(notifs) {
  const groups = { today: [], yesterday: [], thisWeek: [], earlier: [] };
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  notifs.forEach(n => {
    const t = n.time || '';
    if (t.startsWith('Today'))      { groups.today.push(n);      return; }
    if (t.startsWith('Yesterday'))  { groups.yesterday.push(n);  return; }
    // check for day-name prefix (Mon, Sun, etc.)
    if (dayNames.some(d => t.startsWith(d))) { groups.thisWeek.push(n); return; }
    groups.earlier.push(n);
  });

  return groups;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function NotificationsPanel() {
  const { notifs, markNotificationRead, markAllRead, unreadCount, closeModal } = useApp();

  const groups = groupNotifications(notifs);

  const sections = [
    { key: 'today',     label: 'TODAY',     items: groups.today },
    { key: 'yesterday', label: 'YESTERDAY', items: groups.yesterday },
    { key: 'thisWeek',  label: 'THIS WEEK', items: groups.thisWeek },
    { key: 'earlier',   label: 'EARLIER',   items: groups.earlier },
  ];

  // ─── JSX ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: '#fff', display: 'flex', flexDirection: 'column',
      maxWidth: '864px',
      margin: '0 auto',
      left: '50%',
      transform: 'translateX(-50%)',
    }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px clamp(16px, 2.5vw, 24px) 10px',
        flexShrink: 0,
        borderBottom: '1px solid #F2F2F7',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 2,
      }}>
        {/* left: title + unread badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '17px', fontWeight: 700, color: '#1C1C1E', fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              background: '#FF3B30', color: '#fff', fontSize: '11px', fontWeight: 700,
              borderRadius: '10px', padding: '1px 7px', fontFamily: 'SF Pro Text, -apple-system, sans-serif',
            }}>
              {unreadCount}
            </span>
          )}
        </div>

        {/* right: mark-all + close */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={markAllRead}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2D9CDB', fontFamily: 'SF Pro Text, -apple-system, sans-serif' }}>
              Mark all read
            </span>
          </button>
          <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' }}>
            <X size={20} color="#8E8E93" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Grouped sections ──────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '8px 0', paddingBottom: '100px', overflowY: 'auto' }}>
        {sections.map(section => {
          if (section.items.length === 0) return null;
          return (
            <div key={section.key} style={{ marginBottom: '4px' }}>
              {/* section header */}
              <div style={{ padding: '10px 16px 4px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: '#8E8E93',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                }}>
                  {section.label}
                </span>
              </div>

              {/* notification items */}
              {section.items.map(n => {
                const bg = TYPE_BG[n.type] || TYPE_BG.system;
                const unread = !n.isRead;

                return (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '12px', width: '100%',
                      padding: '12px 16px', border: 'none', cursor: 'pointer',
                      background: unread ? '#F0F8FF' : '#fff',
                      borderLeft: unread ? '3px solid #2D9CDB' : '3px solid transparent',
                      borderBottom: '1px solid #F5F5F7',
                      transition: 'background 0.15s',
                    }}
                  >
                    {/* icon circle */}
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, fontSize: '18px',
                    }}>
                      {n.icon}
                    </div>

                    {/* text block */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        margin: 0, fontSize: '13px', fontWeight: unread ? 700 : 500,
                        color: '#1C1C1E', lineHeight: 1.35,
                        fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                      }}>
                        {n.title}
                      </p>
                      <p style={{
                        margin: '2px 0 0', fontSize: '12px', color: '#8E8E93',
                        lineHeight: 1.35, fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                      }}>
                        {n.message}
                      </p>
                      <p style={{
                        margin: '3px 0 0', fontSize: '11px', color: '#C7C7CC',
                        fontFamily: 'SF Pro Text, -apple-system, sans-serif',
                      }}>
                        {n.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
