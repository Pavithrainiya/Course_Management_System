import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Plus, Users, ArrowRight, CheckCircle2, Tag, Layers, X, Sparkles } from 'lucide-react';
import { EnrollmentSuccessModal } from '../components/EnrollmentSuccessModal';

export const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [enrollmentSuccessData, setEnrollmentSuccessData] = useState(null);

  const [newCourse, setNewCourse] = useState({
    CourseId: Math.floor(100 + Math.random() * 900),
    CourseName: '',
    Description: '',
    category: 'Computer Science'
  });

  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let courseList = await api.getCourses().catch(() => []);
      let safeList = Array.isArray(courseList) ? courseList : (courseList?.results || []);
      if (!safeList || safeList.length === 0) {
        safeList = [
          {
            id: 1,
            CourseId: 101,
            CourseName: 'Python Full-Stack Mastery',
            Description: 'Comprehensive Python development covering OOP, Django REST framework, PostgreSQL backend, and modern web applications.',
            category: 'Computer Science',
            enrolled_count: 5
          },
          {
            id: 2,
            CourseId: 102,
            CourseName: 'Database Systems & PostgreSQL',
            Description: 'Master relational database architecture, SQL optimization, indexing, B-Trees, transaction isolation, and schema design.',
            category: 'Data Engineering',
            enrolled_count: 4
          },
          {
            id: 3,
            CourseId: 103,
            CourseName: 'Web Development & React.js',
            Description: 'Modern frontend development using React 18, Vite, hooks, glassmorphism design, and REST API integration.',
            category: 'Software Engineering',
            enrolled_count: 6
          },
          {
            id: 7,
            CourseId: 104,
            CourseName: 'Artificial Intelligence & Machine Learning',
            Description: 'Neural networks, deep learning fundamentals, supervised learning models, and automated AI evaluation engines.',
            category: 'Data Science',
            enrolled_count: 8
          }
        ];
      }
      setCourses(safeList);

      if (user) {
        const userEnrollments = await api.getEnrollments().catch(() => []);
        setEnrollments(Array.isArray(userEnrollments) ? userEnrollments : []);
      }
    } catch (err) {
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.course === courseId || e.course_details?.id === courseId || e.course_details?.CourseId === courseId);
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setActionLoading(true);
    setMsg({ text: '', type: '' });
    const courseObj = courses.find(c => c.id === courseId || c.CourseId === courseId) || {};

    try {
      const res = await api.enrollCourse(courseId);
      const fullModalData = {
        id: res.id || Math.floor(1000 + Math.random() * 9000),
        status: res.status || 'Active Registered',
        course_details: res.course_details || courseObj,
        student_email: res.student_email || user.email || `${user.username}@example.com`
      };
      setEnrollmentSuccessData(fullModalData);
      setMsg({ text: `Successfully registered for ${courseObj.CourseName || res.course_name || 'course'}!`, type: 'success' });
      
      const freshList = await api.getEnrollments().catch(() => []);
      setEnrollments(freshList);
    } catch (err) {
      console.error('Enrollment error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('cms_access_token');
        localStorage.removeItem('cms_refresh_token');
        localStorage.removeItem('cms_user');
        navigate('/login');
        return;
      } else {
        const errMsg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Failed to enroll in course. Please try again.';
        setMsg({ text: errMsg, type: 'danger' });
      }
    } finally {

      setActionLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.createCourse(newCourse);
      setShowAddModal(false);
      setNewCourse({ CourseId: Math.floor(100 + Math.random() * 900), CourseName: '', Description: '', category: 'Computer Science' });
      setMsg({ text: 'New course created successfully!', type: 'success' });
      fetchData();
    } catch (err) {
      alert('Error creating course');
    }
  };

  const categories = ['ALL', ...new Set(courses.map(c => c.category || 'General'))];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.CourseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.Description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Explore Courses</h1>
          <p className="page-subtitle">Discover top academic programs and manage your course enrollments</p>
        </div>
        {(role === 'ADMIN' || role === 'INSTRUCTOR') && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={18} /> Add New Course
          </button>
        )}
      </div>

      {msg.text && (
        <div style={{
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          color: msg.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          marginBottom: '24px',
          fontWeight: 600
        }}>
          {msg.text}
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '44px' }}
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '20px', padding: '6px 16px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading course catalog...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3>No courses found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredCourses.map(course => {
            const enrolled = isEnrolled(course.id);
            return (
              <div key={course.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '24px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                      <Tag size={12} /> {course.category || 'General'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Code: {course.CourseId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Users size={16} /> {course.enrolled_count || 0} Enrolled
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/course/${course.id}`} className="btn btn-secondary btn-sm">
                      Details <ArrowRight size={14} />
                    </Link>

                    {enrolled ? (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                        title="Click to view enrollment confirmation and resource attachments"
                      >
                        <CheckCircle2 size={14} /> Enrolled (View Info)
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="btn btn-aurora btn-sm"
                        disabled={actionLoading}
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Add New Course</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="form-group">
                <label className="form-label">Course Code / ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={newCourse.CourseId}
                  onChange={(e) => setNewCourse({ ...newCourse, CourseId: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Advanced Machine Learning"
                  value={newCourse.CourseName}
                  onChange={(e) => setNewCourse({ ...newCourse, CourseName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Computer Science"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Comprehensive description of the course curriculum..."
                  value={newCourse.Description}
                  onChange={(e) => setNewCourse({ ...newCourse, Description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lecture Video Attachment URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://www.youtube.com/embed/rfscVS0vtbw"
                  value={newCourse.video_url || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, video_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Reference PDF Handout URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/handout.pdf"
                  value={newCourse.pdf_url || ''}
                  onChange={(e) => setNewCourse({ ...newCourse, pdf_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-aurora">Create Course with Attachments</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ENROLLMENT SUCCESS POP-UP MODAL WITH EMAIL & PDF/VIDEO ATTACHMENT LINKS */}
      {enrollmentSuccessData && (
        <EnrollmentSuccessModal
          enrollmentData={enrollmentSuccessData}
          onClose={() => setEnrollmentSuccessData(null)}
        />
      )}
    </div>
  );
};
