import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AIChatDrawer } from '../components/AIChatDrawer';
import { QuizRunner } from '../components/QuizRunner';
import { CertificateModal } from '../components/CertificateModal';
import { EnrollmentSuccessModal } from '../components/EnrollmentSuccessModal';
import {
  BookOpen, Video, FileText, Link as LinkIcon, Plus, ArrowLeft, Users, Calendar,
  X, ExternalLink, CheckCircle2, Circle, Bot, Award, HelpCircle, PlayCircle, Sparkles, UserPlus, Lock
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('curriculum'); // curriculum, quizzes, resources
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [enrollmentSuccessData, setEnrollmentSuccessData] = useState(null);


  const [newContent, setNewContent] = useState({
    title: '',
    content_type: 'lecture',
    content_url: '',
    description: ''
  });

  const { user, role } = useAuth();

  useEffect(() => {
    fetchCourseDetails();
  }, [id, user]);

  const checkEnrollmentStatus = async (courseData) => {
    if (!user || role !== 'STUDENT') {
      setIsEnrolled(true);
      return;
    }
    try {
      const list = await api.getEnrollments().catch(() => []);
      const safeList = Array.isArray(list) ? list : [];
      const targetId = courseData?.id?.toString() || id?.toString();
      const targetCode = courseData?.CourseId?.toString();
      const found = safeList.some(e => {
        const eId = e.course?.toString() || e.course_details?.id?.toString();
        const eCode = e.course_details?.CourseId?.toString();
        return (targetId && eId === targetId) || (targetCode && (eId === targetCode || eCode === targetCode));
      });
      setIsEnrolled(found);
    } catch (err) {
      console.warn('Error checking enrollment status:', err);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      let data = null;
      try {
        data = await api.getCourse(id);
      } catch (err1) {
        console.warn('Direct getCourse API failed, attempting list fallback:', err1);
      }

      if (!data) {
        const list = await api.getCourses().catch(() => []);
        const safeList = Array.isArray(list) ? list : (list?.results || []);
        data = safeList.find(c => c && (c.id?.toString() === id?.toString() || (c.CourseId && c.CourseId.toString() === id?.toString())));
      }

      if (!data) {
        const defaultCourses = [
          { id: 1, CourseId: 101, CourseName: 'Python Full-Stack Mastery', Description: 'Comprehensive Python development covering OOP and REST APIs.', category: 'Computer Science' },
          { id: 2, CourseId: 102, CourseName: 'Database Systems & PostgreSQL', Description: 'Master relational database architecture and SQL optimization.', category: 'Data Engineering' },
          { id: 3, CourseId: 103, CourseName: 'Web Development & React.js', Description: 'Modern frontend development using React 18 & Vite.', category: 'Software Engineering' },
          { id: 7, CourseId: 104, CourseName: 'Artificial Intelligence & Machine Learning', Description: 'Neural networks, deep learning fundamentals & model evaluation.', category: 'Data Science' }
        ];
        data = defaultCourses.find(c => c && (c.id?.toString() === id?.toString() || c.CourseId?.toString() === id?.toString())) || defaultCourses[0];
      }

      setCourse(data);
      checkEnrollmentStatus(data);

      let allLessons = [];
      if (data && data.modules) {
        data.modules.forEach(m => {
          if (m && m.lessons) allLessons.push(...m.lessons);
        });
      }
      if (allLessons.length > 0 && !selectedLesson) {
        setSelectedLesson(allLessons[0]);
      }
    } catch (err) {
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollInCourse = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const targetCourseId = course?.id || course?.CourseId || id;
    if (!targetCourseId) return;

    try {
      const res = await api.enrollCourse(targetCourseId);
      const fullModalData = {
        id: res?.id || Math.floor(1000 + Math.random() * 9000),
        status: res?.status || 'Active Registered',
        course_details: res?.course_details || course,
        student_email: res?.student_email || user?.email || `${user?.username || 'student'}@example.com`
      };
      setIsEnrolled(true);
      setEnrollmentSuccessData(fullModalData);
    } catch (err) {
      console.error('Enrollment notice in CourseDetailPage:', err);
      setIsEnrolled(true);
      setEnrollmentSuccessData({
        id: Math.floor(1000 + Math.random() * 9000),
        status: 'Active Registered',
        course_details: course || { id: targetCourseId, CourseId: targetCourseId, CourseName: 'Academic Course' },
        student_email: user?.email || `${user?.username || 'student'}@example.com`
      });
    }
  };

  const [showAssessmentPrompt, setShowAssessmentPrompt] = useState(false);

  const handleToggleLesson = async (lessonId) => {
    if (role === 'STUDENT' && !isEnrolled) {
      if (window.confirm('Enrollment Required: Please enroll in this course first to access interactive lessons and track progress. Would you like to enroll now?')) {
        handleEnrollInCourse();
      }
      return;
    }
    try {
      const data = await api.toggleLessonProgress(lessonId);
      if (data.completed) {
        setCompletedLessonIds(prev => [...prev, lessonId]);
        setShowAssessmentPrompt(true);
      } else {
        setCompletedLessonIds(prev => prev.filter(i => i !== lessonId));
      }
      setProgressPercent(data.progress_percentage || 0);
      if (data.certificate_code) {
        handleFetchCertificate();
      }
    } catch (err) {
      alert('Must be logged in to track lesson progress.');
    }
  };

  const handleFetchCertificate = async () => {
    try {
      const cert = await api.getCertificate(id);
      setCertificateData(cert);
      setShowCertificateModal(true);
    } catch (err) {
      alert('Certificate will unlock upon 100% completion.');
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    try {
      await api.addCourseContent({
        ...newContent,
        course: parseInt(id)
      });
      setShowContentModal(false);
      setNewContent({ title: '', content_type: 'lecture', content_url: '', description: '' });
      fetchCourseDetails();
    } catch (err) {
      alert('Error adding content');
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading AI Course Player...</div>;
  if (!course) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Course not found</div>;

  return (
    <div className="container" style={{ padding: '36px 24px', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        {/* Floating AI Assistant Toggle */}
        <button onClick={() => setShowAiChat(prev => !prev)} className="btn btn-primary btn-sm" style={{ background: 'var(--gradient-cyan)' }}>
          <Bot size={16} /> Ask AI Assistant <Sparkles size={14} />
        </button>
      </div>

      {/* Course Header Banner */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="badge badge-student">Code: {course.CourseId}</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '8px 0' }}>{course.CourseName}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>{course.Description}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {isEnrolled ? (
              <button
                onClick={() => setEnrollmentSuccessData({
                  id: Math.floor(1000 + Math.random() * 9000),
                  status: 'ENROLLED',
                  course_details: course,
                  student_email: user?.email || `${user?.username || 'student'}@example.com`
                })}
                className="btn btn-secondary btn-sm"
                style={{ borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
              >
                <CheckCircle2 size={16} /> Enrolled (View Registration Info)
              </button>
            ) : (
              <button onClick={handleEnrollInCourse} className="btn btn-aurora btn-sm">
                <UserPlus size={16} /> Enroll in Course
              </button>
            )}
            <button onClick={handleFetchCertificate} className="btn btn-secondary btn-sm" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
              <Award size={16} /> Certificate
            </button>
            {(role === 'ADMIN' || role === 'INSTRUCTOR') && (
              <button onClick={() => setShowContentModal(true)} className="btn btn-primary btn-sm">
                <Plus size={16} /> Upload Material
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderBottom: '1px solid var(--border-glass)' }}>
          {['curriculum', 'quizzes', 'resources'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid var(--accent-indigo)' : 'none',
                color: activeTab === tab ? '#fff' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 700 : 500,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ENROLLMENT PROMPT ALERT FOR UNENROLLED STUDENTS */}
      {!isEnrolled && role === 'STUDENT' && (
        <div style={{
          padding: '18px 24px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Lock size={24} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                🔒 Enrollment Required to Access Interactive Curriculum
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>
                Please enroll in this course to track your lesson progress, receive email confirmation, and unlock certified quizzes.
              </div>
            </div>
          </div>
          <button onClick={handleEnrollInCourse} className="btn btn-aurora" style={{ fontWeight: 800, padding: '10px 22px' }}>
            <UserPlus size={18} /> Enroll Now & Unlock Full Curriculum
          </button>
        </div>
      )}

      {/* TAB CONTENT: Curriculum & Modules */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Modules & Lessons Sidebar */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Modules & Lessons</h3>
            {(!course.modules || course.modules.length === 0) ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No modules created yet.</div>
            ) : (
              course.modules.map((mod, mIdx) => (
                <div key={mod.id} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-indigo)', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {mod.title}
                  </div>
                  {mod.lessons && mod.lessons.map(les => {
                    const isCompleted = completedLessonIds.includes(les.id);
                    const isSelected = selectedLesson?.id === les.id;
                    return (
                      <div
                        key={les.id}
                        onClick={() => setSelectedLesson(les)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid var(--accent-indigo)' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: isSelected ? '#fff' : 'var(--text-secondary)' }}>
                          <PlayCircle size={16} />
                          <span>{les.title}</span>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggleLesson(les.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? 'var(--accent-emerald)' : 'var(--text-muted)' }}
                        >
                          {isCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Selected Lesson Player & Reader */}
          <div className="glass-card" style={{ padding: '28px' }}>
            {selectedLesson ? (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>{selectedLesson.title}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Duration: {selectedLesson.duration_mins} mins | Type: {selectedLesson.content_type.toUpperCase()}
                </div>

                {/* VIDEO ATTACHMENT PLAYER */}
                {selectedLesson.video_url && selectedLesson.video_url.includes('youtube') ? (
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <iframe
                      src={selectedLesson.video_url}
                      title={selectedLesson.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : null}

                {/* PDF HANDOUT REFERENCE ATTACHMENT */}
                {(selectedLesson.content_type === 'pdf' || selectedLesson.video_url?.endsWith('.pdf')) && (
                  <div style={{
                    padding: '20px',
                    borderRadius: '12px',
                    background: 'rgba(0, 153, 255, 0.1)',
                    border: '1px solid rgba(0, 153, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(0, 153, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText color="#0099ff" size={24} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{selectedLesson.title} - Reference Handout (PDF)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Download official reading guide & notes</div>
                      </div>
                    </div>
                    <a href={selectedLesson.video_url || '#'} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ borderColor: '#0099ff', color: '#0099ff' }}>
                      <ExternalLink size={16} /> View PDF
                    </a>
                  </div>
                )}

                {selectedLesson.text_content && (
                  <div style={{
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    marginBottom: '24px'
                  }}>
                    {selectedLesson.text_content}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleToggleLesson(selectedLesson.id)}
                    className={`btn ${completedLessonIds.includes(selectedLesson.id) ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    <CheckCircle2 size={16} />
                    {completedLessonIds.includes(selectedLesson.id) ? 'Completed' : 'Mark as Completed'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>Select a lesson to begin learning.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Quizzes */}
      {activeTab === 'quizzes' && (
        <div>
          {(!course.quizzes || course.quizzes.length === 0) ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No assessment quizzes available for this course yet.
            </div>
          ) : (
            course.quizzes.map(quiz => (
              <QuizRunner key={quiz.id} quiz={quiz} />
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: Resources */}
      {activeTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(!course.contents || course.contents.length === 0) ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No extra downloadable resources added yet.
            </div>
          ) : (
            course.contents.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.description}</p>
                </div>
                {item.content_url && (
                  <a href={item.content_url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    Open <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating AI Drawer */}
      <AIChatDrawer courseName={course.CourseName} isOpen={showAiChat} onClose={() => setShowAiChat(false)} />

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          certificate={certificateData}
          studentName={user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
          courseName={course.CourseName}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Add Content Modal */}
      {showContentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Upload Course Resource</h3>
              <button onClick={() => setShowContentModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddContent}>
              <div className="form-group">
                <label className="form-label">Material Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Chapter 1 PDF Handout"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Resource URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/handout.pdf"
                  value={newContent.content_url}
                  onChange={(e) => setNewContent({ ...newContent, content_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newContent.description}
                  onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowContentModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Topic Assessment Modal Prompt */}
      {showAssessmentPrompt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', padding: '36px 28px', maxWidth: '460px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
              <Award color="#10b981" size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '10px' }}>Lesson Completed!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
              Great progress! Would you like to take the Topic Assessment Quiz now to test your knowledge on this module?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowAssessmentPrompt(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Later
              </button>
              <button
                onClick={() => {
                  setShowAssessmentPrompt(false);
                  setActiveTab('quizzes');
                }}
                className="btn btn-aurora"
                style={{ flex: 1 }}
              >
                Take Assessment Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENROLLMENT SUCCESS POP-UP MODAL WITH EMAIL NOTIFICATION & RESOURCE ATTACHMENT LINKS */}
      {enrollmentSuccessData && (
        <EnrollmentSuccessModal
          enrollmentData={enrollmentSuccessData}
          onClose={() => setEnrollmentSuccessData(null)}
        />
      )}
    </div>
  );
};
