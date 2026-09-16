import React from 'react';
import { CheckCircle2, FileText, Video, Mail, ArrowRight, X, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EnrollmentSuccessModal = ({ enrollmentData, onClose }) => {
  const navigate = useNavigate();
  if (!enrollmentData) return null;

  const course = enrollmentData.course_details || enrollmentData.course || {};
  const courseName = course.CourseName || enrollmentData.course_name || 'Enrolled Course';
  const courseCode = course.CourseId || '101';
  const description = course.Description || 'Full course curriculum with interactive lessons and AI tutoring.';
  const studentEmail = enrollmentData.student_email || 'student@example.com';
  
  // Default PDF & Video link fallbacks
  const pdfUrl = course.pdf_url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  const videoUrl = course.video_url || "https://www.youtube.com/embed/rfscVS0vtbw";

  return (
    <div className="modal-overlay" style={{ zIndex: 2200 }}>
      <div className="modal-content" style={{
        maxWidth: '680px',
        padding: '0',
        background: '#0b0f19',
        border: '2px solid rgba(16, 185, 129, 0.5)',
        boxShadow: '0 0 35px rgba(16, 185, 129, 0.25)'
      }}>
        {/* MODAL HEADER */}
        <div style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 198, 255, 0.1) 100%)',
          borderBottom: '1px solid var(--border-glass)',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              right: '20px',
              top: '20px',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={22} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
            }}>
              <CheckCircle2 size={28} color="#fff" />
            </div>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '4px' }}>
                <Sparkles size={12} /> Registration Verified
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Course Enrollment Successful!
              </h2>
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding: '28px 32px' }}>
          
          {/* EMAIL NOTIFICATION CONFIRMATION BOX */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: 'rgba(0, 198, 255, 0.08)',
            border: '1px solid rgba(0, 198, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <Mail size={22} color="#00c6ff" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00c6ff' }}>
                📧 Confirmation Email Sent
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                An official enrollment confirmation email with full course details has been sent to <strong>{studentEmail}</strong> from <code>pavijeevi56@gmail.com</code>.
              </div>
            </div>
          </div>

          {/* COURSE INFORMATION DETAILS */}
          <div style={{
            padding: '20px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-student">Course Code: #{courseCode}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                Status: Active Registered
              </span>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '6px 0 10px 0' }}>
              {courseName}
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>
              {description}
            </p>
          </div>

          {/* RESOURCE LINKS & PDF ATTACHMENT BUTTONS */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Included Learning Attachments & Resources
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              
              {/* PDF HANDOUT LINK */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="#f59e0b" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Reference PDF Handout</div>
                      <div style={{ fontSize: '0.725rem', color: '#f59e0b' }}>Download Official Syllabus PDF</div>
                    </div>
                  </div>
                  <ExternalLink size={14} color="#f59e0b" />
                </div>
              </a>

              {/* LECTURE VIDEO LINK */}
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 198, 255, 0.1)',
                  border: '1px solid rgba(0, 198, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 198, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 198, 255, 0.1)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video size={20} color="#00c6ff" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Lecture Video Stream</div>
                      <div style={{ fontSize: '0.725rem', color: '#00c6ff' }}>Watch Video Overview</div>
                    </div>
                  </div>
                  <ExternalLink size={14} color="#00c6ff" />
                </div>
              </a>

            </div>
          </div>
        </div>

        {/* MODAL FOOTER ACTIONS */}
        <div style={{
          padding: '16px 28px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
          
          <button
            onClick={() => {
              onClose();
              const targetId = course.id || course.CourseId || (typeof enrollmentData.course === 'number' ? enrollmentData.course : (typeof course === 'number' ? course : 1));
              navigate(`/course/${targetId}`);
            }}
            className="btn btn-aurora btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={16} /> Open Course Curriculum <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
