import React from 'react';
import { Award, ShieldCheck, Printer, X } from 'lucide-react';

export const CertificateModal = ({ certificate, studentName, courseName, onClose }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const certCode = certificate.certificate_code || 'CMS-883921';
  const resolvedStudentName = studentName || certificate.student_name || 'Student';
  const resolvedCourseName = courseName || certificate.course_name || 'Course Management';
  const issueDateStr = new Date(certificate.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const qrText = `🎓 COURSEHUB VERIFIED CERTIFICATE\nCode: #${certCode}\nStudent: ${resolvedStudentName}\nCourse: ${resolvedCourseName}\nIssued: ${issueDateStr}\nStatus: Authentic (100% Completed)`;
  const qrData = encodeURIComponent(qrText);
  // High-contrast black-on-white matrix for instant Google Lens text card rendering
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${qrData}&color=000000&bgcolor=ffffff&margin=2`;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal-content" style={{ maxWidth: '760px', padding: '0', background: '#0b0f19', border: '2px solid rgba(245, 158, 11, 0.4)' }}>
        
        {/* Printable Certificate Box */}
        <div id="printable-certificate" style={{
          padding: '48px 40px',
          background: 'linear-gradient(135deg, #0b0f19 0%, #171e2e 100%)',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          border: '12px solid rgba(245, 158, 11, 0.2)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <button onClick={onClose} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--gradient-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.4)'
          }}>
            <Award size={36} color="#fff" />
          </div>

          <h2 style={{ fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--accent-amber)', fontWeight: 800 }}>
            CERTIFICATE OF COMPLETION
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
            This is to certify that
          </p>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', margin: '16px 0', background: 'linear-gradient(135deg, #fff 0%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {resolvedStudentName}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
            has successfully mastered all curriculum requirements, assessments, and learning modules for
          </p>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: '16px 0' }}>
            {resolvedCourseName}
          </h3>

          {/* QR CODE & VERIFICATION ROW */}
          <div style={{
            margin: '24px auto 0',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            maxWidth: '540px',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '8px',
                background: '#ffffff',
                borderRadius: '12px',
                border: '2px solid #00c6ff',
                display: 'inline-block',
                boxShadow: '0 0 20px rgba(0, 198, 255, 0.35)'
              }}>
                <img
                  src={qrCodeUrl}
                  alt="Certificate Verification QR Code"
                  style={{ width: '110px', height: '110px', borderRadius: '4px', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '0.65rem', color: '#00c6ff', marginTop: '6px', fontWeight: 700, letterSpacing: '0.5px' }}>
                SCAN QR TO VERIFY
              </div>
            </div>

            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                <ShieldCheck size={18} /> Official Verified Record
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verification Code</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                {certCode}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Issue Date</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                {new Date(certificate.issued_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ padding: '16px 24px', background: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print / Save PDF Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
