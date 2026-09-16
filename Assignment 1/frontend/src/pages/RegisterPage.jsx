import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus, Lock, User, Mail, AlertCircle,
  Eye, EyeOff, CheckCircle2, XCircle, Sparkles, ArrowRight, RefreshCw, Wifi
} from 'lucide-react';

// ── Success Popup Modal ──────────────────────────────────────────────────────
const SuccessPopup = ({ username, role, onContinue }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); onContinue(); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #0b1329 100%)',
        border: '1px solid rgba(16,185,129,0.4)',
        borderRadius: '24px',
        padding: '48px 40px',
        maxWidth: '420px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 0 60px rgba(16,185,129,0.2), 0 30px 60px rgba(0,0,0,0.5)',
        animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        {/* Animated check circle */}
        <div style={{
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(16,185,129,0.5)',
          animation: 'pulse 2s infinite'
        }}>
          <CheckCircle2 size={40} color="#fff" />
        </div>

        {/* Sparkles */}
        <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎉 ✨ 🎊</div>

        <h2 style={{
          fontSize: '1.6rem', fontWeight: 800,
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Welcome aboard!
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '4px' }}>
          Account successfully created for
        </p>
        <p style={{
          color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px'
        }}>
          @{username}
        </p>
        <p style={{
          display: 'inline-block',
          background: 'rgba(16,185,129,0.15)',
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '28px'
        }}>
          {role}
        </p>

        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
          Signing you in automatically...
        </p>

        {/* Countdown progress bar */}
        <div style={{
          height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden', marginBottom: '20px'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #10b981, #06b6d4)',
            borderRadius: '2px',
            width: `${(countdown / 3) * 100}%`,
            transition: 'width 1s linear'
          }} />
        </div>

        <button
          onClick={onContinue}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px',
            width: '100%', padding: '12px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none', borderRadius: '12px',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(16,185,129,0.45)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(16,185,129,0.35)'; }}
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7) translateY(40px) }
          to   { opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(16,185,129,0.5) }
          50%       { box-shadow: 0 0 50px rgba(16,185,129,0.8) }
        }
      `}</style>
    </div>
  );
};

// ── Main RegisterPage ────────────────────────────────────────────────────────
export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'STUDENT',
    phone: '',
    department: 'Computer Science'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]   = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retryIn, setRetryIn] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const retryTimerRef = useRef(null);
  const lastFormData = useRef(null);

  const { register, login, loading } = useAuth();
  const navigate = useNavigate();

  // Countdown timer for retry
  useEffect(() => {
    if (retryIn <= 0) return;
    const t = setInterval(() => setRetryIn(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [retryIn]);

  // Auto-retry when countdown hits 0 (if network error)
  useEffect(() => {
    if (isNetworkError && retryIn === 0 && lastFormData.current) {
      doRegister(lastFormData.current);
    }
  }, [retryIn, isNetworkError]);

  // Password rules
  const pwd = formData.password;
  const hasMinLength = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasNumber    = /[0-9]/.test(pwd);
  const hasSpecial   = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecial;

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const doRegister = async (data) => {
    setError('');
    setIsNetworkError(false);
    try {
      await register(data);
      setIsNetworkError(false);
      setRetryCount(0);
      lastFormData.current = null;
      setRegisteredUser({ username: data.username, role: data.role });
      setShowPopup(true);
    } catch (err) {
      console.error('Registration error:', err);
      // Network Error = Render backend sleeping
      if (!err.response) {
        setIsNetworkError(true);
        setRetryCount(p => p + 1);
        lastFormData.current = data;
        setRetryIn(8); // retry in 8 seconds
        return;
      }
      const respData = err.response?.data;
      let msg = 'Registration failed. Please check your inputs.';
      if (typeof respData === 'object' && respData !== null) {
        const firstKey = Object.keys(respData)[0];
        const val = respData[firstKey];
        msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : (val || msg);
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsNetworkError(false);
    setError('');
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character.');
      return;
    }
    await doRegister(formData);
  };

  const handleManualRetry = () => {
    setRetryIn(0);
    if (lastFormData.current) doRegister(lastFormData.current);
  };

  const handleContinue = async () => {
    setShowPopup(false);
    try {
      await login(formData.username, formData.password);
      navigate(formData.role === 'ADMIN' ? '/admin' : '/courses');
    } catch {
      navigate('/');
    }
  };

  return (
    <>
      {/* ── Success Popup ── */}
      {showPopup && registeredUser && (
        <SuccessPopup
          username={registeredUser.username}
          role={registeredUser.role}
          onContinue={handleContinue}
        />
      )}

      {/* ── Register Form ── */}
      <div className="container" style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '60px 24px'
      }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '36px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'var(--gradient-aurora)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: 'var(--shadow-neon)'
            }}>
              <UserPlus color="#fff" size={28} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Join the CourseHub management platform
            </p>
          </div>

          {/* Network Error Banner */}
          {isNetworkError && (
            <div style={{
              padding: '14px 16px',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, marginBottom: '6px' }}>
                <Wifi size={18} /> Server is waking up...
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 10px' }}>
                The backend server is starting up (this takes ~30 sec on free hosting).
                {retryCount > 0 && ` Attempt ${retryCount}...`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                    borderRadius: '2px',
                    width: `${((8 - retryIn) / 8) * 100}%`,
                    transition: 'width 1s linear'
                  }} />
                </div>
                <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, minWidth: '60px' }}>
                  {retryIn > 0 ? `Retry in ${retryIn}s` : 'Retrying...'}
                </span>
                <button onClick={handleManualRetry}
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', color: '#f59e0b', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={12} /> Retry Now
                </button>
              </div>
            </div>
          )}

          {/* Regular Error */}
          {error && !isNetworkError && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(244,63,94,0.15)',
              border: '1px solid rgba(244,63,94,0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-rose)',
              fontSize: '0.875rem', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" name="first_name" className="form-control"
                  placeholder="John" value={formData.first_name}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" name="last_name" className="form-control"
                  placeholder="Doe" value={formData.last_name}
                  onChange={handleChange} required />
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input type="text" name="username" className="form-control"
                  style={{ paddingLeft: '44px' }} placeholder="johndoe"
                  value={formData.username} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input type="email" name="email" className="form-control"
                  style={{ paddingLeft: '44px' }} placeholder="john@example.com"
                  value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" className="form-control"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  placeholder="Choose a strong password"
                  value={formData.password} onChange={handleChange} required
                />
                <button type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent', border: 'none',
                    color: showPassword ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer', padding: '8px',
                    display: 'flex', alignItems: 'center', zIndex: 100
                  }}>
                  {showPassword ? <EyeOff size={18} color="var(--accent-cyan)" /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password checklist */}
              <div style={{
                marginTop: '12px', padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                fontSize: '0.8rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px'
              }}>
                {[
                  [hasMinLength, 'At least 8 characters'],
                  [hasUppercase, '1 Uppercase Letter'],
                  [hasNumber,    '1 Number (0-9)'],
                  [hasSpecial,   '1 Special Symbol (!@#$)'],
                ].map(([ok, label]) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    color: ok ? 'var(--accent-emerald)' : 'var(--text-muted)'
                  }}>
                    {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />} {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Role & Department */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Account Role</label>
                <select name="role" className="form-control"
                  value={formData.role} onChange={handleChange}>
                  <option value="STUDENT"    style={{ background: '#0b1329' }}>Student</option>
                  <option value="INSTRUCTOR" style={{ background: '#0b1329' }}>Instructor</option>
                  <option value="ADMIN"      style={{ background: '#0b1329' }}>Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input type="text" name="department" className="form-control"
                  placeholder="Computer Science"
                  value={formData.department} onChange={handleChange} />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-aurora"
              style={{ width: '100%', padding: '12px', marginTop: '8px' }}
              disabled={loading || !isPasswordValid}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite', display: 'inline-block'
                    }} />
                    Creating Account...
                  </span>
                : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Sparkles size={16} /> Create Account
                  </span>
              }
            </button>
          </form>

          <div style={{
            marginTop: '24px', paddingTop: '20px',
            borderTop: '1px solid var(--border-glass)',
            textAlign: 'center', fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-emerald)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </>
  );
};
