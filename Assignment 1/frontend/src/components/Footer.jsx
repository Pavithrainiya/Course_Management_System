import React from 'react';
import { Database, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      borderTop: '1px solid var(--border-glass)',
      background: 'rgba(11, 15, 25, 0.9)',
      padding: '24px 0',
      color: 'var(--text-secondary)',
      fontSize: '0.875rem'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ color: '#fff', fontWeight: 700 }}>CourseHub CMS</span> &copy; 2026. Powered by React, Django REST Framework & PostgreSQL.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)' }}>
            <Database size={15} /> PostgreSQL Online (CMS)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-indigo)' }}>
            <ShieldCheck size={15} /> JWT Security
          </span>
        </div>
      </div>
    </footer>
  );
};
