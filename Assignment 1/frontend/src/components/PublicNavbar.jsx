import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const PublicNavbar = () => {
  return (
    <nav style={{
      background: 'rgba(7, 11, 25, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', padding: '0 24px' }}>
        
        {/* BRAND LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-aurora)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <BookOpen color="#fff" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
              Course<span style={{ color: '#00c6ff' }}>Hub</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Management System
            </div>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s ease' }}>
            Features
          </a>
          <a href="#courses" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s ease' }}>
            Available Courses
          </a>
          <a href="#ai-tutor" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 600, transition: 'color 0.2s ease' }}>
            AI Tutor Playground
          </a>
        </div>

        {/* ACTION BUTTONS & THEME */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <NotificationCenter />
          <Link to="/login" className="btn btn-secondary btn-sm" style={{ padding: '8px 18px', borderRadius: '10px' }}>
            <LogIn size={16} /> Sign In
          </Link>
          <Link to="/register" className="btn btn-aurora btn-sm" style={{ padding: '8px 20px', borderRadius: '10px' }}>
            <UserPlus size={16} /> Register Free
          </Link>
        </div>

      </div>
    </nav>
  );
};
