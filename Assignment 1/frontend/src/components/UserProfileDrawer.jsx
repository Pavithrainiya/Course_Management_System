import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Shield, Phone, Building, Calendar, KeyRound, Lock, Send, Sparkles, CheckCircle2, AlertCircle, X, Edit2, Save, RefreshCw
} from 'lucide-react';

export const UserProfileDrawer = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'change-password', 'forgot-password'

  // User Profile Data
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department: ''
  });

  // Change Password form state
  const [changePassForm, setChangePassForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Forgot Password form state
  const [forgotForm, setForgotForm] = useState({
    email_or_username: '',
    code: '',
    new_password: ''
  });
  const [resetStep, setResetStep] = useState(1); // 1: request code, 2: verify & reset

  // Feedback status
  const [statusMessage, setStatusMessage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await api.getCurrentUser().catch(() => null);
      if (data) {
        setProfileData(data);
        setEditForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || ''
        });
        if (!forgotForm.email_or_username) {
          setForgotForm(prev => ({ ...prev, email_or_username: data.email || data.username || '' }));
        }
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.updateProfile(editForm);
      setProfileData(res.user);
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile details.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (changePassForm.new_password !== changePassForm.confirm_password) {
      setStatusMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.changePassword({
        old_password: changePassForm.old_password,
        new_password: changePassForm.new_password
      });
      setStatusMessage({ type: 'success', text: res.message || 'Password changed successfully! A notification email has been dispatched.' });
      setChangePassForm({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to change password. Please verify current password.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.forgotPassword({ email_or_username: forgotForm.email_or_username });
      setStatusMessage({ type: 'success', text: res.message || 'Password reset OTP code dispatched to your email.' });
      setResetStep(2);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to send reset code.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPasswordWithCode = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatusMessage(null);
    try {
      const res = await api.resetPasswordWithCode({
        email_or_username: forgotForm.email_or_username,
        code: forgotForm.code,
        new_password: forgotForm.new_password
      });
      setStatusMessage({ type: 'success', text: res.message || 'Password reset successfully! You can now log in with your new password.' });
      setResetStep(1);
      setForgotForm({ email_or_username: profileData?.email || user?.username || '', code: '', new_password: '' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.error || 'Failed to reset password. Please check your verification code.' });
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';
  const displayUser = profileData || user;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1100 }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '260px',
          bottom: 0,
          width: 'calc(100% - 260px)',
          maxWidth: '480px',
          background: '#070b19',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.8)',
          animation: 'slideInLeft 0.3s ease-out'
        }}
      >
        {/* HEADER SECTION */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0088cc 0%, #00c6ff 100%)',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 16px rgba(0, 136, 204, 0.4)'
            }}>
              {initial}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {displayUser?.first_name ? `${displayUser.first_name} ${displayUser.last_name || ''}` : displayUser?.username}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>
                @{displayUser?.username} • <span className="badge badge-student" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>{role}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}>
            <X size={22} />
          </button>
        </div>

        {/* TAB HEADERS */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.2)' }}>
          <button
            onClick={() => { setActiveTab('details'); setStatusMessage(null); }}
            style={{
              flex: 1,
              padding: '14px 10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'details' ? '3px solid var(--accent-cyan)' : '3px solid transparent',
              color: activeTab === 'details' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'details' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={15} /> Registration Info
          </button>

          <button
            onClick={() => { setActiveTab('change-password'); setStatusMessage(null); }}
            style={{
              flex: 1,
              padding: '14px 10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'change-password' ? '3px solid var(--accent-indigo)' : '3px solid transparent',
              color: activeTab === 'change-password' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'change-password' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Lock size={15} /> Change Password
          </button>

          <button
            onClick={() => { setActiveTab('forgot-password'); setStatusMessage(null); }}
            style={{
              flex: 1,
              padding: '14px 10px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'forgot-password' ? '3px solid var(--accent-amber)' : '3px solid transparent',
              color: activeTab === 'forgot-password' ? '#fff' : 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'forgot-password' ? 700 : 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <KeyRound size={15} /> Forgot / Reset
          </button>
        </div>

        {/* FEEDBACK NOTIFICATION BANNER */}
        {statusMessage && (
          <div style={{
            margin: '16px 20px 0 20px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: statusMessage.type === 'error' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${statusMessage.type === 'error' ? '#f43f5e' : '#10b981'}`,
            color: '#fff',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {statusMessage.type === 'error' ? <AlertCircle size={18} color="#f43f5e" /> : <CheckCircle2 size={18} color="#10b981" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* TAB BODY CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* TAB 1: USER REGISTRATION DETAILS */}
          {activeTab === 'details' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} color="var(--accent-cyan)" /> User Profile & Registration Details
                </h4>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  {isEditing ? 'Cancel Edit' : <><Edit2 size={14} /> Edit Details</>}
                </button>
              </div>

              {loadingProfile ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading account details...</div>
              ) : !isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Username</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>@{displayUser?.username}</div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Full Name</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                      {displayUser?.first_name ? `${displayUser.first_name} ${displayUser.last_name || ''}` : 'Not provided'}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Registered Email</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-cyan)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} /> {displayUser?.email || `${displayUser?.username}@example.com`}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Department</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                        {displayUser?.department || 'General'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Phone / Contact</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                        {displayUser?.phone || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Account Registered On</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} /> {displayUser?.date_joined || 'Recent Registration'}
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT PROFILE FORM */
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.first_name}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.last_name}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.department}
                      onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-aurora" disabled={actionLoading} style={{ flex: 1 }}>
                      {actionLoading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CHANGE PASSWORD FORM */}
          {activeTab === 'change-password' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--accent-indigo)" /> Update Security Password
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                Change your account password securely. An automated security confirmation email will be sent to your registered address upon update.
              </p>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                    Current Password <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter your existing password"
                    value={changePassForm.old_password}
                    onChange={(e) => setChangePassForm({ ...changePassForm, old_password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                    New Password <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special symbol"
                    value={changePassForm.new_password}
                    onChange={(e) => setChangePassForm({ ...changePassForm, new_password: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                    Confirm New Password <span style={{ color: '#f43f5e' }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter new password"
                    value={changePassForm.confirm_password}
                    onChange={(e) => setChangePassForm({ ...changePassForm, confirm_password: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={actionLoading} style={{ marginTop: '10px', padding: '12px' }}>
                  {actionLoading ? 'Updating Password...' : <><Lock size={16} /> Update Account Password</>}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: FORGOT PASSWORD / RESET CODE FLOW */}
          {activeTab === 'forgot-password' && (
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={18} color="var(--accent-amber)" /> Forgot Password & Reset Code
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                Recover or reset your password using a 6-digit OTP verification code dispatched directly to your registered email address.
              </p>

              {resetStep === 1 ? (
                /* STEP 1: REQUEST RESET CODE */
                <form onSubmit={handleRequestResetCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                      Registered Username or Email Address <span style={{ color: '#f59e0b' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter registered username or email"
                      value={forgotForm.email_or_username}
                      onChange={(e) => setForgotForm({ ...forgotForm, email_or_username: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-aurora" disabled={actionLoading} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff' }}>
                    {actionLoading ? 'Dispatching OTP...' : <><Send size={16} /> Send 6-Digit Reset Code to Email</>}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setResetStep(2)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Already have a 6-digit code? Reset password here →
                    </button>
                  </div>
                </form>
              ) : (
                /* STEP 2: VERIFY CODE & ENTER NEW PASSWORD */
                <form onSubmit={handleResetPasswordWithCode} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                      Username / Email <span style={{ color: '#f59e0b' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={forgotForm.email_or_username}
                      onChange={(e) => setForgotForm({ ...forgotForm, email_or_username: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                      6-Digit Reset OTP Code <span style={{ color: '#f59e0b' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 849201"
                      value={forgotForm.code}
                      onChange={(e) => setForgotForm({ ...forgotForm, code: e.target.value })}
                      style={{ fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 800 }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '6px' }}>
                      New Password <span style={{ color: '#f59e0b' }}>*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password (min 8 chars)"
                      value={forgotForm.new_password}
                      onChange={(e) => setForgotForm({ ...forgotForm, new_password: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setResetStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>
                      Back
                    </button>
                    <button type="submit" className="btn btn-aurora" disabled={actionLoading} style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
                      {actionLoading ? 'Resetting Password...' : <><KeyRound size={16} /> Complete Reset</>}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* FOOTER ACTION */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(0, 0, 0, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CourseHub User Security Console</span>
          <button onClick={onClose} className="btn btn-secondary btn-sm">Close Sidenav</button>
        </div>
      </div>
    </div>
  );
};
