import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { ExportButtons } from '../components/ExportButtons';
import {
  GraduationCap, BookOpen, Clock, Award, ArrowRight, Sparkles, CheckCircle2,
  Calendar, Bot, FileCheck, Layers, PlayCircle, ShieldCheck, X, FileText, Check
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [passedQuizzes, setPassedQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);

  useEffect(() => {
    fetchStudentDashboardData();
  }, []);

  const fetchStudentDashboardData = async () => {
    try {
      setLoading(true);
      const [enrollmentList, courseList, certsData] = await Promise.all([
        api.getEnrollments().catch(() => []),
        api.getCourses().catch(() => []),
        api.getAllCertificates().catch(() => ({}))
      ]);

      setEnrollments(Array.isArray(enrollmentList) ? enrollmentList : []);
      let safeList = Array.isArray(courseList) ? courseList : (courseList?.results || []);
      if (!safeList || safeList.length === 0) {
        safeList = [
          { id: 1, CourseId: 101, CourseName: 'Python Full-Stack Mastery', Description: 'Comprehensive Python development.', category: 'Computer Science' },
          { id: 2, CourseId: 102, CourseName: 'Database Systems & PostgreSQL', Description: 'Master relational database architecture.', category: 'Data Engineering' },
          { id: 3, CourseId: 103, CourseName: 'Web Development & React.js', Description: 'Modern frontend development.', category: 'Software Engineering' },
          { id: 4, CourseId: 104, CourseName: 'Artificial Intelligence & Machine Learning', Description: 'Neural networks & deep learning.', category: 'Data Science' }
        ];
      }
      setCourses(safeList);

      // Process passed quizzes and certificates for current user
      const allCompleted = certsData?.completed_students || [];
      const allCerts = certsData?.certificates || [];

      const usernameQuery = (user?.username || '').toLowerCase();
      const firstNameQuery = (user?.first_name || '').toLowerCase();

      const myPassed = allCompleted.filter(c => {
        const uname = (c.username || '').toLowerCase();
        const sname = (c.student_name || '').toLowerCase();
        return (usernameQuery && (uname === usernameQuery || sname.includes(usernameQuery))) ||
               (firstNameQuery && sname.includes(firstNameQuery));
      });

      const myCerts = allCerts.filter(c => {
        const sname = (c.student_name || '').toLowerCase();
        return (usernameQuery && sname.includes(usernameQuery)) ||
               (firstNameQuery && sname.includes(firstNameQuery));
      });

      setPassedQuizzes(myPassed);
      setCertificates(myCerts);
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading your personal dashboard...</div>;

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];
  const safeCourses = Array.isArray(courses) ? courses : [];

  const getUserDisplayName = () => {
    if (user?.first_name) return `${user.first_name} ${user.last_name || ''}`.trim();
    return user?.username || 'Student';
  };

  return (
    <div className="container" style={{ padding: '36px 24px', flex: 1 }}>
      
      {/* WELCOME BANNER */}
      <div className="glass-card" style={{
        padding: '36px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: 'var(--accent-emerald)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            <Sparkles size={14} /> STUDENT DASHBOARD & LEARNING OVERVIEW
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome back, {getUserDisplayName()}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '640px', lineHeight: 1.5 }}>
            Track your active academic course enrollments, learning progress, AI tutor assistance, and earned completion certificates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/courses" className="btn btn-aurora">
            <BookOpen size={18} /> Explore Catalog
          </Link>
          <Link to="/student" className="btn btn-secondary">
            <FileCheck size={18} /> My Enrollments ({safeEnrollments.length})
          </Link>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS WITH INTERACTIVE CLICK DETAILS */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <StatCard
          title="Enrolled Courses"
          value={safeEnrollments.length}
          icon={GraduationCap}
          color="emerald"
          onClick={() => navigate('/student')}
        />
        <StatCard
          title="Available Programs"
          value={safeCourses.length}
          icon={BookOpen}
          color="cyan"
          onClick={() => navigate('/courses')}
        />
        <StatCard
          title="Passed Quizzes"
          value={passedQuizzes.length}
          icon={CheckCircle2}
          color="indigo"
          onClick={() => setShowQuizModal(true)}
        />
        <StatCard
          title="Verified Certificates"
          value={certificates.length > 0 ? certificates.length : (passedQuizzes.length > 0 ? passedQuizzes.length : 0)}
          icon={Award}
          color="amber"
          onClick={() => navigate('/certificates')}
        />
      </div>

      {/* MY ENROLLED COURSES SECTION */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Enrolled Courses</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Continue your active curriculum lessons</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {safeEnrollments.length > 0 && (
              <ExportButtons
                title={`${getUserDisplayName()}'s Academic Course Enrollments`}
                headers={['Course ID', 'Course Name', 'Status', 'Enrolled Date']}
                data={safeEnrollments.map(e => ({
                  'Course ID': e.course_details?.CourseId || `CRS-${e.id}`,
                  'Course Name': e.course_details?.CourseName || e.course_name || 'Course',
                  'Status': e.status || 'Active',
                  'Enrolled Date': new Date(e.enrolled_at || Date.now()).toLocaleDateString()
                }))}
                filename="my_course_enrollments"
              />
            )}
            <Link to="/student" className="btn btn-secondary btn-sm">
              View All ({safeEnrollments.length}) <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {safeEnrollments.length === 0 ? (
          <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
            <GraduationCap size={56} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Active Course Enrollments</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              You are not currently enrolled in any academic programs. Browse our master course catalog to enroll in 1-click.
            </p>
            <Link to="/courses" className="btn btn-aurora">
              <BookOpen size={18} /> Browse Available Courses
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {safeEnrollments.map(item => {
              const course = item.course_details;
              if (!course) return null;
              return (
                <div key={item.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-student">
                        <CheckCircle2 size={12} /> {item.status || 'Active'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Code: {course.CourseId}</span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      {course.CourseName}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '20px' }}>
                      {course.Description ? `${course.Description.substring(0, 90)}...` : 'No description provided'}
                    </p>
                  </div>

                  {/* Progress Bar Container */}
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Course Progress</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Active</span>
                    </div>

                    <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden', marginBottom: '16px' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--gradient-emerald)' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link to={`/course/${course.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                        <PlayCircle size={14} /> View Course
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK ACADEMIC ACTIONS */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '20px' }}>Academic Hub Services</h2>
        <div className="grid-3">
          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <BookOpen size={22} color="var(--accent-cyan)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Course Catalog</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Browse all available courses across departments and 1-click enroll.
              </p>
            </div>
          </Link>

          <Link to="/calendar" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Calendar size={22} color="var(--accent-purple)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Learning Calendar</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Track lecture schedules, assignment deadlines, and live workshops.
              </p>
            </div>
          </Link>

          <Link to="/certificates" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ padding: '24px', height: '100%' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Award size={22} color="var(--accent-amber)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Verified Certificates</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                Download your official completion certificates upon 100% course completion.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* PASSED QUIZZES & ASSESSMENT HISTORY MODAL */}
      {showQuizModal && (
        <div className="modal-overlay" onClick={() => setShowQuizModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 color="var(--accent-emerald)" size={22} /> Passed Quizzes & Assessment History
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
                  Student: <strong>{getUserDisplayName()}</strong>
                </p>
              </div>
              <button onClick={() => setShowQuizModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {passedQuizzes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 20px' }}>
                <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>No Passed Quizzes Recorded Yet</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                  You have not completed any course final quizzes yet. Enroll in a course, view lesson materials, and attend topic assessments to earn your 100% score & certificate.
                </p>
                <button onClick={() => { setShowQuizModal(false); navigate('/courses'); }} className="btn btn-aurora btn-sm">
                  <BookOpen size={16} /> Browse Course Catalog
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '420px', overflowY: 'auto' }}>
                {passedQuizzes.map((quizItem, idx) => (
                  <div
                    key={quizItem.id || idx}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {quizItem.course_name || 'Course Assessment'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span>Score: <strong style={{ color: 'var(--accent-emerald)' }}>100% PASSED</strong></span>
                        <span>•</span>
                        <span>Code: <code>#{quizItem.certificate_code || `CMS-${quizItem.id}`}</code></span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Completed: {new Date(quizItem.issued_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => { setShowQuizModal(false); navigate('/certificates'); }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.8rem', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', gap: '6px' }}
                      >
                        <Award size={14} /> View Certificate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
