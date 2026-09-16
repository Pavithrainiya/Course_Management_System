import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', onClick }) => {
  const getColorStyle = () => {
    switch(color) {
      case 'cyan': return { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)', text: 'var(--accent-cyan)' };
      case 'emerald': return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: 'var(--accent-emerald)' };
      case 'amber': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: 'var(--accent-amber)' };
      default: return { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: 'var(--accent-indigo)' };
    }
  };

  const style = getColorStyle();

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s ease'
      }}
    >
      <div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{value}</div>
      </div>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: style.text
      }}>
        <Icon size={28} />
      </div>
    </div>
  );
};
