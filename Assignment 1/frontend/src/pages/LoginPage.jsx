import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { LogIn, Lock, User, AlertCircle, Eye, EyeOff, KeyRound, Mail, Send, CheckCircle2, X } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: request code, 2: verify & reset
  const [resetEmailOrUser, setResetEmailOrUser] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMsg, setResetMsg] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await api.forgotPassword({ email_or_username: resetEmailOrUser.trim() });
      setResetMsg({ type: 'success', text: res.message || 'OTP verification code sent to your email.' });
      setResetStep(2);
    } catch (err) {
      setResetMsg({ type: 'error', text: err.response?.data?.error || 'Failed to send reset code. Please check email address.' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await api.resetPasswordWithCode({
        email_or_username: resetEmailOrUser.trim(),
        code: resetCode.trim(),
        new_password: newPassword
      });
      setResetMsg({ type: 'success', text: res.message || 'Password reset successfully! You can now sign in.' });
      setTimeout(() => {
        setShowResetModal(false);
        setResetStep(1);
        setResetMsg(null);
      }, 2000);
    } catch (err) {
      setResetMsg({ type: 'error', text: err.response?.data?.error || 'Failed to reset password. Please check verification code.' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'var(--gradient-aurora)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <LogIn color="#fff" size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Sign in to access your CourseHub account</p>
        </div>

        {error && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--accent-rose)',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '44px' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => { setShowResetModal(true); setResetStep(1); setResetMsg(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot / Reset Password?
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword(prev => !prev);
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: showPassword ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  pointerEvents: 'auto'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} color="var(--accent-cyan)" /> : <Eye size={18} />}
              </button>


            </div>
          </div>

          <button type="submit" className="btn btn-aurora" style={{ width: '100%', padding: '12px', marginTop: '8px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-glass)',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-emerald)', fontWeight: 700, textDecoration: 'none' }}>
            Register Now
          </Link>
        </div>
      </div>

      {/* RESET PASSWORD MODAL */}
      {showResetModal && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="modal-content" style={{ maxWidth: '440px', padding: '28px', background: '#0b0f19', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <KeyRound size={22} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Reset Account Password</h3>
              </div>
              <button onClick={() => setShowResetModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {resetMsg && (
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.875rem',
                background: resetMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                border: `1px solid ${resetMsg.type === 'success' ? '#10b981' : '#f43f5e'}`,
                color: resetMsg.type === 'success' ? '#10b981' : '#f43f5e'
              }}>
                {resetMsg.text}
              </div>
            )}

            {resetStep === 1 ? (
              <form onSubmit={handleRequestCode}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Enter your registered email address or username. A 6-digit OTP verification code will be sent to your email from <code>pavijeevi56@gmail.com</code>.
                </p>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">Email Address or Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. student@gmail.com or username"
                    value={resetEmailOrUser}
                    onChange={(e) => setResetEmailOrUser(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={resetLoading}>
                  <Send size={16} /> {resetLoading ? 'Sending OTP Code...' : 'Send Reset Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Enter the 6-digit OTP verification code sent to <strong>{resetEmailOrUser}</strong> and set your new password.
                </p>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">6-Digit Verification Code</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter 6-digit OTP"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setResetStep(1)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-aurora btn-sm" style={{ flex: 2 }} disabled={resetLoading}>
                    {resetLoading ? 'Resetting Password...' : 'Confirm New Password'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
