import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles, BookOpen, Bot, Shield, Award, Users, CheckCircle2,
  ArrowRight, Zap, PlayCircle, BarChart3, HelpCircle, Send, Star, Layers,
  Terminal, Cpu, FileCheck, ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total_courses: 0, total_students: 0, total_enrollments: 0 });
  const [activeFeatureTab, setActiveFeatureTab] = useState('ai'); // ai, modules, assessments, certs
  const [demoPrompt, setDemoPrompt] = useState('');
  const [demoAnswer, setDemoAnswer] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [courseData, statsData] = await Promise.all([
        api.getCourses(),
        api.getDashboardStats()
      ]);
      setCourses(courseData.slice(0, 3));
      setStats(statsData);
    } catch (err) {
      console.error('Error loading landing page data:', err);
    }
  };

  const handleTestAI = async (e) => {
    e?.preventDefault();
    if (!demoPrompt.trim()) return;
    setDemoLoading(true);
    setDemoAnswer('');
    try {
      const data = await api.askAI(demoPrompt, 'General Computer Science', 'explain');
      setDemoAnswer(data.response);
    } catch (err) {
      setDemoAnswer('AI Tutor: I can answer any course query! Sign up or log in to experience full 24/7 interactive AI tutoring.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

      {/* TOP ANNOUNCEMENT TICKER */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--accent-emerald)'
      }}>
        🚀 <strong>NEXT-GEN CMS UPDATE</strong>: AI Learning Tutor, Automated Quiz Evaluation & PostgreSQL 17 Integrated!
      </div>
      
      {/* 1. SPLIT HERO SECTION */}
      <section style={{ padding: '70px 24px 50px', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Hero Left Column */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <Cpu size={16} /> AI-Powered Learning Operating System
            </div>

            <h1 style={{
              fontSize: '3.25rem',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#fff',
              marginBottom: '20px'
            }}>
              Next-Gen Learning Platform Powered by <span style={{
                background: 'var(--gradient-aurora)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>AI & PostgreSQL</span>
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '32px'
            }}>
              Transform course management with interactive lesson modules, 24/7 AI tutoring, automated quiz evaluation, progress analytics, and verifiable completion certificates.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link to={user ? "/courses" : "/register"} className="btn btn-aurora" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                {user ? "Go to Courses" : "Start Free Account"} <ArrowRight size={18} />
              </Link>
              <Link to={user ? "/courses" : "/login"} className="btn btn-secondary" style={{ padding: '14px 24px', fontSize: '1.05rem' }}>
                <BookOpen size={18} /> {user ? "Course Catalog" : "Sign In to Access Courses"}
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>{stats.total_courses || 50}+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Courses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{stats.total_students || 1200}+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Active Students</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated Certificates</div>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Live Cyber Workspace Preview */}
          <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(16, 185, 129, 0.35)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px', fontFamily: 'monospace' }}>
                  CourseHub_AI_Workspace.exe
                </span>
              </div>
              <span className="badge badge-student"><Sparkles size={12} /> AI Active</span>
            </div>

            {/* AI Interaction Simulation */}
            <div style={{ background: 'rgba(3, 7, 18, 0.9)', padding: '20px', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: '20px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                &gt; Student: "How does PostgreSQL manage relational data in Django?"
              </div>
              <div style={{ color: 'var(--accent-emerald)', lineHeight: 1.5 }}>
                🤖 AI Tutor: Django ORM translates Python models into native PostgreSQL SQL schema with foreign key integrity, indexes, and transactional concurrency.
              </div>
            </div>

            {/* Interactive Progress Bar Card */}
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>Python Full-Stack Mastery</span>
                <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>100% Completed</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--gradient-aurora)' }}></div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Certificate Code: #CMS-88392</span>
                <span className="badge badge-student"><Award size={12} /> Verified</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. INTERACTIVE FEATURE SHOWCASE TAB BAR */}
      <section style={{ padding: '60px 24px', background: 'rgba(0, 0, 0, 0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Platform Capabilities</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>Select a core module below to inspect interactive features</p>
          </div>

          {/* Tab Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {[
              { id: 'ai', label: '🤖 AI Learning Assistant', icon: Bot },
              { id: 'modules', label: '📚 Interactive Curriculum', icon: Layers },
              { id: 'assessments', label: '📝 MCQ Assessments', icon: Zap },
              { id: 'certs', label: '🏆 Verified Certificates', icon: Award }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`btn ${activeFeatureTab === tab.id ? 'btn-aurora' : 'btn-secondary'}`}
                style={{ borderRadius: '30px', padding: '10px 22px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Tab Content Box */}
          <div className="glass-card" style={{ padding: '36px', maxWidth: '960px', margin: '0 auto', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            {activeFeatureTab === 'ai' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-student" style={{ marginBottom: '12px' }}>AI Tutor Module</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>24/7 Intelligent Course Assistant</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    Students can ask questions about course content, generate instant lesson summaries, and receive custom practice quiz questions tailored to their learning speed.
                  </p>
                  <ul style={{ listStyle: 'none', color: 'var(--text-primary)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Instant concept explanations & code breakdowns</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> AI-generated practice quiz questions</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-emerald)" /> Course context-aware answers</li>
                  </ul>
                </div>
                <div style={{ padding: '24px', background: 'rgba(3, 7, 18, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '8px' }}>🤖 AI Sample Prompt</div>
                  <div style={{ color: '#fff', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '14px' }}>"Summarize Module 1: Python OOP"</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    "Object-Oriented Programming structures code into reusable Classes & Objects using Encapsulation, Inheritance, and Polymorphism..."
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'modules' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-instructor" style={{ marginBottom: '12px' }}>Structured Content</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Modules, Lessons & Video Lectures</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    Instructors can organize curriculum into structured modules with video lectures, downloadable PDF handouts, and interactive reading notes.
                  </p>
                  <ul style={{ listStyle: 'none', color: 'var(--text-primary)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Accordion module navigation</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Real-time lesson progress checkmarks</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-cyan)" /> Support for videos, PDFs & articles</li>
                  </ul>
                </div>
                <div style={{ padding: '24px', background: 'rgba(3, 7, 18, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>Module 1: Database Design</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                      ✔ Lesson 1: Entity Relationships (15 mins)
                    </div>
                    <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem' }}>
                      ▶ Lesson 2: SQL Joins & Indexes (20 mins)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'assessments' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-admin" style={{ marginBottom: '12px' }}>Evaluation System</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>MCQ Quizzes & Auto-Grading</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    Evaluate student knowledge with timed multiple-choice assessments, automated score calculation, passing thresholds, and instant feedback.
                  </p>
                  <ul style={{ listStyle: 'none', color: 'var(--text-primary)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-rose)" /> Automatic percentage grading</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-rose)" /> Explanation feedback per question</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-rose)" /> Configurable passing criteria</li>
                  </ul>
                </div>
                <div style={{ padding: '24px', background: 'rgba(3, 7, 18, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Knowledge Assessment</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700, marginBottom: '12px' }}>Score: 100% (PASSED 🎉)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q1. What is a Primary Key in PostgreSQL?</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '4px' }}>✔ Correct: Unique row identifier</div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'certs' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'center' }}>
                <div>
                  <span className="badge badge-student" style={{ marginBottom: '12px' }}>Credential Verification</span>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '12px' }}>Automated Verified Certificates</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                    Upon achieving 100% course completion, students automatically receive an official Certificate of Completion with a unique verification UUID code.
                  </p>
                  <ul style={{ listStyle: 'none', color: 'var(--text-primary)', fontSize: '0.925rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-amber)" /> Instant PDF/Print export</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-amber)" /> Unique UUID verification code</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="var(--accent-amber)" /> Verifiable student credentials</li>
                  </ul>
                </div>
                <div style={{ padding: '24px', background: 'rgba(3, 7, 18, 0.8)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.4)', textAlign: 'center' }}>
                  <Award size={40} color="var(--accent-amber)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>CERTIFICATE OF COMPLETION</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '4px' }}>Issued to: John Doe</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Code: #CMS-UUID-7749</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP LEARNING ROADMAP */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>How the Platform Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>4 simple steps from enrollment to certified mastery</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', title: 'Enroll in Courses', desc: 'Browse available courses across departments and 1-click enroll.' },
              { step: '02', title: 'Learn with AI Tutor', desc: 'Watch lessons and ask the 24/7 AI Assistant any question.' },
              { step: '03', title: 'Pass Assessments', desc: 'Take MCQ quizzes with instant auto-grading and explanation feedback.' },
              { step: '04', title: 'Earn Certificate', desc: 'Download your official verified certificate upon 100% completion.' }
            ].map((item, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '28px', position: 'relative' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', opacity: 0.8, marginBottom: '12px' }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE AI PLAYGROUND PROMPT BOX */}
      <section style={{ padding: '60px 24px', background: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div className="glass-card" style={{ padding: '36px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gradient-aurora)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Try the AI Tutor Playground</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Ask an academic question below to receive instant AI tutoring</p>
              </div>
            </div>

            <form onSubmit={handleTestAI} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Explain SQL Join types in simple terms..."
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
              />
              <button type="submit" className="btn btn-aurora" disabled={demoLoading || !demoPrompt.trim()}>
                {demoLoading ? 'Asking...' : 'Ask AI'} <Send size={16} />
              </button>
            </form>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['Explain Python OOP concepts', 'What is a Relational DB?', 'Give me a practice quiz question'].map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDemoPrompt(s)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '4px 12px' }}
                >
                  💡 {s}
                </button>
              ))}
            </div>

            {demoAnswer && (
              <div style={{
                padding: '20px',
                background: 'rgba(3, 7, 18, 0.95)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)',
                whiteSpace: 'pre-wrap',
                fontSize: '0.925rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)'
              }}>
                {demoAnswer}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. FEATURED COURSES SHOWCASE */}
      <section style={{ padding: '80px 24px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Courses</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Active courses available in the PostgreSQL database</p>
            </div>
            <Link to="/courses" className="btn btn-secondary">
              View All Courses <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {courses.map(course => (
              <div key={course.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-student" style={{ marginBottom: '12px' }}>Code: {course.CourseId}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>{course.CourseName}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>{course.Description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{course.enrolled_count || 0} Enrolled</span>
                  <Link to={`/course/${course.id}`} className="btn btn-primary btn-sm">
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section style={{ padding: '80px 24px 100px', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div className="glass-card" style={{
            padding: '48px 36px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)'
          }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
              Elevate Your Learning Experience Today
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
              Join students and instructors leveraging our AI-Powered Course Management System.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-aurora" style={{ padding: '14px 32px' }}>
                Create Account Free
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '14px 28px' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
