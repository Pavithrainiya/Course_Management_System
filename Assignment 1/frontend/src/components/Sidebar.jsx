import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserProfileDrawer } from './UserProfileDrawer';
import {
  LayoutGrid, BookOpen, FileCheck, Calendar, Award, Users, BarChart3, LogOut, Activity, Crown, User, Settings
} from 'lucide-react';

export const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');

  const dashboardPath = (role === 'ADMIN' || role === 'INSTRUCTOR') ? '/admin' : '/dashboard';

  const isActive = (item) => {
    if (item.tab) {
      return currentPath === item.path && currentTab === item.tab;
    }
    if (item.path === '/admin') {
      return currentPath === '/admin' && (!currentTab || currentTab === 'analytics');
    }
    return currentPath === item.path && !currentTab;
  };

  // Distinct menu items with precise tab targets
  const navItems = [
    { path: dashboardPath, label: 'Dashboard', icon: LayoutGrid },
    { path: '/courses', label: 'Courses / Resources', icon: BookOpen },
    { path: '/student', label: 'Enrollments & Bookings', icon: FileCheck },
    { path: '/calendar', label: 'Learning Calendar', icon: Calendar },
    { path: '/certificates', label: 'Certificates & QR', icon: Award },
    { isProfile: true, label: 'My Profile & Security', icon: User },
    { path: '/admin', tab: 'users', label: 'Users', icon: Users, roleReq: 'ADMIN' },
    { path: '/admin', tab: 'analytics', label: 'Analytics', icon: BarChart3, roleReq: 'ADMIN' },
  ];

  // Show items matching role
  const filteredItems = navItems.filter(item => !item.roleReq || (user && role === item.roleReq));

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      background: '#070b19',
      borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 200,
      flexShrink: 0
    }}>
      {/* TOP SECTION: BRAND HEADER & NAV LIST */}
      <div>
        {/* BRAND HEADER */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 114, 255, 0.4)'
            }}>
              <Activity color="#fff" size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                Course<span style={{ color: '#0099ff' }}>Hub</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px', fontWeight: 600 }}>
                Course Management System
              </div>
            </div>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredItems.map((item, idx) => {
            const Icon = item.icon;
            const active = item.isProfile ? showProfileDrawer : isActive(item);

            if (item.isProfile) {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setShowProfileDrawer(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.95rem',
                    fontWeight: showProfileDrawer ? 700 : 600,
                    color: showProfileDrawer ? '#ffffff' : '#94a3b8',
                    background: showProfileDrawer ? '#0088cc' : 'transparent',
                    boxShadow: showProfileDrawer ? '0 4px 18px rgba(0, 136, 204, 0.45)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!showProfileDrawer) {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showProfileDrawer) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <Icon size={20} color={showProfileDrawer ? '#ffffff' : '#94a3b8'} />
                  <span>{item.label}</span>
                </button>
              );
            }

            const targetUrl = item.tab ? `${item.path}?tab=${item.tab}` : item.path;

            return (
              <Link
                key={idx}
                to={targetUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: active ? 700 : 600,
                  color: active ? '#ffffff' : '#94a3b8',
                  background: active ? '#0088cc' : 'transparent',
                  boxShadow: active ? '0 4px 18px rgba(0, 136, 204, 0.45)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <Icon size={20} color={active ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* FOOTER SECTION: USER PROFILE BADGE & SIGN OUT */}
      <div style={{ padding: '24px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0, 0, 0, 0.2)' }}>
        {user ? (
          <div>
            <div
              onClick={() => setShowProfileDrawer(true)}
              title="Click to open User Profile Details & Password Sidenav"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '16px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0088cc 0%, #00c6ff 100%)',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#fff'
                }}>
                  {getInitial()}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  background: '#070b19',
                  borderRadius: '50%',
                  padding: '2px'
                }}>
                  <Crown size={12} color="#f59e0b" fill="#f59e0b" />
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.username}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span className="badge badge-student" style={{ padding: '1px 6px', fontSize: '0.625rem' }}>{role}</span>
                  <Settings size={12} color="var(--text-muted)" />
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f43f5e'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/login" className="btn btn-aurora" style={{ width: '100%', fontSize: '0.9rem' }}>
              Sign In
            </Link>
          </div>
        )}
      </div>

      <UserProfileDrawer isOpen={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} />
    </aside>
  );
};
