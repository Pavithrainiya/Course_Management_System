import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserProfileDrawer } from '../components/UserProfileDrawer';
import { ExportButtons } from '../components/ExportButtons';
import { GraduationCap, BookOpen, Trash2, ArrowRight, CheckCircle2, Clock, User, RefreshCw, FileText, Video } from 'lucide-react';

export const StudentPortalPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchMyEnrollments();
  }, [user]);

  const fetchMyEnrollments = async () => {
    try {
      setLoading(true);
      const [enrollData, allCourses] = await Promise.all([
        api.getEnrollments().catch(() => []),
        api.getCourses().catch(() => [])
      ]);

      const map = {};
      if (Array.isArray(allCourses)) {
        allCourses.forEach(c => {
          map[c.id] = c;
          if (c.CourseId) map[c.CourseId] = c;
        });
      }
      setCoursesMap(map);

      const safeList = Array.isArray(enrollData) ? enrollData : (enrollData?.results || []);
      setEnrollments(safeList);
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setEnrollments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchMyEnrollments();
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

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem', fontWeight: 600 }}>
          Loading your registered course enrollments...
        </div>
      </div>
    );
  }

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  return (
    <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">My Course Enrollments & Bookings</h1>
          <p className="page-subtitle">Track your registered academic courses, learning resources, and active curriculums</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleManualRefresh}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Refresh enrollments list"
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {safeEnrollments.length > 0 && (
            <ExportButtons
              title={`${user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Student'}'s Academic Course Enrollments`}
              headers={['Course Code', 'Course Name', 'Category', 'Status', 'Enrolled Date']}
              data={safeEnrollments.map(item => {
                const matchedCourse = coursesMap[item.course] || coursesMap[item.course_details?.id] || item.course_details || {};
                return {
                  'Course Code': matchedCourse.CourseId || `#${item.course || '101'}`,
                  'Course Name': matchedCourse.CourseName || item.course_name || 'Enrolled Course',
                  'Category': matchedCourse.category || 'Academic Curriculum',
                  'Status': item.status || 'Active Registered',
                  'Enrolled Date': new Date(item.enrolled_at || Date.now()).toLocaleDateString()
                };
              })}
              filename="my_enrolled_courses"
            />
          )}
        </div>
      </div>

      {safeEnrollments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <GraduationCap size={64} color="var(--accent-emerald)" style={{ marginBottom: '16px', opacity: 0.9 }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>You are not enrolled in any courses yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Explore our comprehensive course catalog to enroll in Python Full-Stack, Database Systems, React.js Frontend, or AI & Machine Learning programs.
          </p>
          <Link to="/courses" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} /> Browse Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {safeEnrollments.map((item) => {
            const course = item.course_details || coursesMap[item.course] || {
              id: item.course,
              CourseId: item.course || 101,
              CourseName: item.course_name || 'Registered Course',
              Description: 'Comprehensive academic course curriculum with video lectures and study guides.',
              category: 'General'
            };

            const targetCourseId = course.id || item.course;
            const displayCode = course.CourseId ? `#${course.CourseId}` : `CRS-${item.id}`;

            return (
              <div key={item.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ padding: '24px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge badge-emerald">
                      <CheckCircle2 size={12} /> {item.status || 'Active Registered'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      Code: {displayCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
                    {course.CourseName || item.course_name}
                  </h3>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Category: <strong style={{ color: 'var(--text-secondary)' }}>{course.category || 'General'}</strong>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px' }}>
                    {course.Description || 'Master key domain skills with interactive video streams, syllabus PDF handouts, and auto-graded assessments.'}
                  </p>
                </div>

                <div style={{
                  padding: '16px 20px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderTop: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                  gap: '8px'
                }}>
                  <Link to={`/course/${targetCourseId}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    Access Curriculum <ArrowRight size={14} />
                  </Link>

                  <button onClick={() => handleUnenroll(item.id)} className="btn btn-danger btn-sm" title="Unenroll from this course" style={{ padding: '6px 12px' }}>
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
