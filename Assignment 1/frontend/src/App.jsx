import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { PublicNavbar } from './components/PublicNavbar';
import { TopToolbar } from './components/TopToolbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentPortalPage } from './pages/StudentPortalPage';
import { LearningCalendarPage } from './pages/LearningCalendarPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { FloatingRAGButton } from './components/FloatingRAGButton';

const ProtectedRoute = ({ children, roleReq }) => {
  const { user, role } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roleReq && role !== roleReq) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '36px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#f43f5e', fontSize: '1.5rem', fontWeight: 800 }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
            Admin Console Restricted
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.5, marginBottom: '24px' }}>
            You are logged in as <strong>{user.username}</strong> (<span className="badge badge-student">{role}</span>). Administrator privileges are required to access this view.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student" className="btn btn-aurora btn-sm">
              My Student Portal
            </Link>
            <Link to="/login" className="btn btn-secondary btn-sm">
              Sign In as Admin (admin)
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

const AppLayout = () => {
  const { user, role } = useAuth();
  const location = useLocation();

  const isAuthFormPage = location.pathname === '/login' || location.pathname === '/register';

  // 1. Unauthenticated (Guest / Before Login Initial Stage):
  // Renders professional full-width Landing Page + Public Header with Sign In & Register buttons. NO Sidebar clutter.
  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
        {!isAuthFormPage && <PublicNavbar />}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <FloatingRAGButton />
      </div>
    );
  }

  // 2. Authenticated (Logged In State):
  // Renders Left Sidebar + Top Toolbar + Main Routes (Landing Page, Courses, Admin, Student Portal, Calendar).
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopToolbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {role === 'ADMIN' || role === 'INSTRUCTOR' ? <AdminDashboard /> : <StudentDashboard />}
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <CourseCatalogPage />
              </ProtectedRoute>
            } />
            <Route path="/course/:id" element={
              <ProtectedRoute>
                <CourseDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute roleReq="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student" element={
              <ProtectedRoute>
                <StudentPortalPage />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <LearningCalendarPage />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <FloatingRAGButton />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 24px', textAlign: 'center', background: '#030712', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ maxWidth: '540px', padding: '36px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.5rem' }}>
              🚀
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Console Session Restored
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '24px' }}>
              The application state has been refreshed. Click below to return to the active workspace.
            </p>
            <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }} className="btn btn-aurora">
              Return to CourseHub Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
