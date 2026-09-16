import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { Shield, UserCheck, GraduationCap, LogOut, Search, Sparkles } from 'lucide-react';

export const TopToolbar = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    if (path === '/') return 'Home Overview & Project Showcase';
    if (path === '/courses') return 'Course Catalog & Learning Resources';
    if (path.startsWith('/course/')) return 'AI Interactive Course Player';
    if (path === '/student') return 'My Student Portal & Enrollments';
    if (path === '/calendar') return 'Interactive Learning Calendar';
    if (path === '/admin') {
      if (tab === 'users') return 'User & Student Directory';
      if (tab === 'courses') return 'Available Course Details';
      if (tab === 'enrollments') return 'Student Course Enrollments';
      return 'Admin System Console & Analytics';
    }
    return 'Course Management System';
  };

  const getRoleBadge = () => {
    if (role === 'ADMIN') return <span className="badge badge-admin"><Shield size={12} /> Admin</span>;
    if (role === 'INSTRUCTOR') return <span className="badge badge-instructor"><UserCheck size={12} /> Instructor</span>;
    return <span className="badge badge-student"><GraduationCap size={12} /> Student</span>;
  };

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header style={{
      height: '64px',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* LEFT: PAGE BREADCRUMB INDICATOR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
          {getPageTitle()}
        </div>
      </div>

      {/* RIGHT: TOOLBAR CONTROLS & USER PROFILE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <NotificationCenter />

        {/* User Profile Badge */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '14px', borderLeft: '1px solid var(--border-glass)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 6px',
              borderRadius: '30px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0088cc 0%, #00c6ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#fff'
              }}>
                {getInitial()}
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{user.username}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase' }}>{role}</div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ padding: '6px 10px', borderRadius: '8px' }} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
