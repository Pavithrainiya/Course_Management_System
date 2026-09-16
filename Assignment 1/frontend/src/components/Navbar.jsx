import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, UserCheck, Shield, LogOut, LogIn, UserPlus, GraduationCap, LayoutDashboard } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    if (role === 'ADMIN') return <span className="badge badge-admin"><Shield size={12} /> Admin</span>;
    if (role === 'INSTRUCTOR') return <span className="badge badge-instructor"><UserCheck size={12} /> Instructor</span>;
    return <span className="badge badge-student"><GraduationCap size={12} /> Student</span>;
  };

  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <BookOpen color="#fff" size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>CourseHub</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Management System</div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to={user ? "/courses" : "/login"} className="btn btn-secondary btn-sm">
            <BookOpen size={16} /> Course Catalog
          </Link>

          <NotificationCenter />

          {user && (
            <>
              {role === 'ADMIN' && (
                <Link to="/admin" className="btn btn-secondary btn-sm">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
              )}
              {role === 'STUDENT' && (
                <Link to="/student" className="btn btn-secondary btn-sm">
                  <GraduationCap size={16} /> My Enrollments
                </Link>
              )}
            </>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--border-glass)' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{user.username}</div>
                {getRoleBadge()}
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
