import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserProfileDrawer } from '../components/UserProfileDrawer';
import { GraduationCap, BookOpen, Trash2, ArrowRight, CheckCircle2, Clock, User, Settings, ShieldCheck, KeyRound, Lock } from 'lucide-react';

export const StudentPortalPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const { user, role } = useAuth();

  useEffect(() => {
    fetchMyEnrollments();
  }, []);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      const data = await api.getEnrollments().catch(() => []);
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (id) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await api.unenrollCourse(id);
        fetchMyEnrollments();
      } catch (err) {
        alert('Error unenrolling from course');
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading your student portal...</div>;

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  return (
    <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
      
      {/* USER PROFILE SUMMARY & SECURITY HEADER BANNER */}
      <div className="glass-card" style={{ padding: '24px 28px', marginBottom: '32px', border: '1px solid rgba(0, 198, 255, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0088cc 0%, #00c6ff 100%)',
              border: '2px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#fff',
              boxShadow: '0 0 16px rgba(0, 198, 255, 0.4)'
            }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Welcome back, {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}!
                </h2>
                <span className="badge badge-student">{role}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                Manage registration details, change password, or request password reset via your Profile Sidenav.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowProfileDrawer(true)}
            className="btn btn-aurora"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontWeight: 700 }}
          >
            <User size={18} /> View User Profile & Security Sidenav <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="page-header">
        <h1 className="page-title">My Course Enrollments</h1>
        <p className="page-subtitle">Track your registered academic courses and learning materials</p>
      </div>

      {safeEnrollments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
          <GraduationCap size={56} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3>You are not enrolled in any courses yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '24px' }}>
            Browse the course catalog to discover and enroll in available academic programs.
          </p>
          <Link to="/courses" className="btn btn-primary">
            <BookOpen size={18} /> Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {safeEnrollments.map((item) => {
            const course = item.course_details;
            if (!course) return null;
            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '24px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-student">
                      <CheckCircle2 size={12} /> {item.status || 'Active'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Code: {course.CourseId}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {course.CourseName}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
                    {course.Description}
                  </p>
                </div>

                <div style={{
                  padding: '16px 24px',
                  background: 'var(--bg-glass)',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                }}>
                  <Link to={`/course/${course.id}`} className="btn btn-primary btn-sm">
                    Access Curriculum <ArrowRight size={14} />
                  </Link>

                  <button onClick={() => handleUnenroll(item.id)} className="btn btn-danger btn-sm" title="Unenroll">
                    <Trash2 size={14} /> Unenroll
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Sidenav Drawer */}
      <UserProfileDrawer isOpen={showProfileDrawer} onClose={() => setShowProfileDrawer(false)} />
    </div>
  );
};
