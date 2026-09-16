import React, { useState, useEffect } from 'react';
import { Bell, Sun, Moon, CheckCircle2, Award, BookOpen, Mail, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotificationCenter = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cms_theme') || 'dark';
    document.body.setAttribute('data-theme', saved);
    return saved;
  });

  const defaultNotifications = [
    {
      id: 1,
      title: '📧 Automated Email Dispatched',
      text: 'Registration confirmation & welcome notification sent to pavijeevi56@gmail.com',
      time: 'Just now',
      icon: Mail,
      color: '#10b981',
      read: false
    },
    {
      id: 2,
      title: '🎓 Course Enrollment Verified',
      text: 'You are actively enrolled in Python Full-Stack & Database Systems.',
      time: '10 mins ago',
      icon: BookOpen,
      color: '#06b6d4',
      read: false
    },
    {
      id: 3,
      title: '🏆 Certificate Approval Request',
      text: 'Quiz score (100%) submitted. Approval notification sent to Administrator.',
      time: '1 hour ago',
      icon: Award,
      color: '#f59e0b',
      read: false
    },
    {
      id: 4,
      title: '🤖 AI Assistant Active',
      text: 'RAG Knowledgebase initialized and ready for course Q&A.',
      time: '2 hours ago',
      icon: Sparkles,
      color: '#8b5cf6',
      read: true
    }
  ];

  const [notificationsList, setNotificationsList] = useState(defaultNotifications);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('cms_theme', nextTheme);
    document.body.setAttribute('data-theme', nextTheme);
  };

  const handleToggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      // Mark all as read on open
      setNotificationsList(prev => prev.map(item => ({ ...item, read: true })));
    }
  };

  const handleClearAll = () => {
    setNotificationsList([]);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
      
      {/* Theme Switcher Button */}
      <button
        onClick={toggleTheme}
        className="btn btn-secondary btn-sm"
        style={{ padding: '8px 12px', borderRadius: '10px', gap: '6px' }}
        title="Toggle Theme Mode (Dark / Slate Grey)"
      >
        {theme === 'dark' ? (
          <>
            <Sun size={17} color="#f59e0b" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Light</span>
          </>
        ) : (
          <>
            <Moon size={17} color="#0099ff" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Dark</span>
          </>
        )}
      </button>

      {/* Notification Bell Button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleToggleOpen}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px', borderRadius: '10px', position: 'relative' }}
          title="Notifications Center"
        >
          <Bell size={18} color="var(--text-secondary)" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: '#f43f5e',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 8px rgba(244, 63, 94, 0.5)'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Popup */}
        {isOpen && (
          <div className="glass-card" style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '360px',
            padding: '16px',
            zIndex: 1000,
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-glass)',
            background: 'var(--bg-card)'
          }}>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              borderBottom: '1px solid var(--border-glass)',
              paddingBottom: '10px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={16} color="var(--accent-emerald)" /> System Notifications
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {notificationsList.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {notificationsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No new notifications.
                </div>
              ) : (
                notificationsList.map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-glass)'
                      }}
                    >
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={16} color={item.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>{item.text}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.time}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
