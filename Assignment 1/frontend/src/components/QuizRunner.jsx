import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

export const QuizRunner = ({ quiz, onComplete }) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div style={{ color: 'var(--text-secondary)', padding: '20px' }}>No questions in this quiz yet.</div>;
  }

  const handleSelectOption = (questionId, optionKey) => {
    if (result) return; // Prevent changing after submission
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const goToCertificate = () => {
    navigate('/certificates', {
      state: {
        autoOpen: true,
        courseId: quiz.course,
        quizTitle: quiz.title,
        score: result?.score,
        passed: result?.passed,
        certCode: result?.cert_code
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await api.submitQuiz(quiz.id, answers);
      setResult(data);
      if (onComplete) onComplete(data);

      if (data.passed && data.score > 0) {
        setRedirecting(true);
        setTimeout(() => {
          navigate('/certificates', {
            state: {
              autoOpen: true,
              courseId: quiz.course,
              quizTitle: quiz.title,
              score: data.score,
              passed: data.passed,
              certCode: data.cert_code
            }
          });
        }, 1800);
      } else {
        setRedirecting(false);
      }
    } catch (err) {
      alert('Failed to submit quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{quiz.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Passing Score: {quiz.passing_score}%</p>
        </div>
        {result && (
          <div className={`badge ${result.passed && result.score > 0 ? 'badge-student' : 'badge-admin'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            Score: {result.score}% ({result.passed && result.score > 0 ? 'PASSED 🎉' : 'FAILED / NO CERTIFICATE ❌'})
          </div>
        )}
      </div>

      {result && result.passed && result.score > 0 && redirecting && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#10b981" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              Quiz Passed with {result.score}%! Redirecting to Verified Certificate page...
            </span>
          </div>
          <button onClick={goToCertificate} className="btn btn-aurora btn-sm">
            <Award size={14} /> Go to Certificate Page
          </button>
        </div>
      )}

      {result && (result.score === 0 || !result.passed) && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          marginBottom: '24px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid #f43f5e',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <XCircle size={22} color="#f43f5e" />
          <span style={{ fontWeight: 700, fontSize: '0.925rem' }}>
            {result.score === 0 
              ? 'Assessment Score is 0%. Certificate generation is blocked for 0% scores. Please review the course materials and retake the assessment.'
              : `Score is ${result.score}% (Passing required: ${quiz.passing_score}%). Please retake the assessment to earn a passing score and generate your certificate.`}
          </span>
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {quiz.questions.map((q, qIdx) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '14px', color: '#fff' }}>
                {qIdx + 1}. {q.question_text}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {['A', 'B', 'C', 'D'].map(optKey => {
                  const optionField = `option_${optKey.toLowerCase()}`;
                  const optionText = q[optionField];
                  const isSelected = selected === optKey;

                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(q.id, optKey)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'left',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '2px solid var(--accent-indigo)' : '1px solid var(--border-glass)',
                        color: '#fff',
                        cursor: result ? 'default' : 'pointer',
                        fontWeight: isSelected ? 700 : 400,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <strong style={{ color: 'var(--accent-indigo)', marginRight: '8px' }}>{optKey}.</strong> {optionText}
                    </button>
                  );
                })}
              </div>

              {/* Result explanation breakdown if submitted */}
              {result && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed var(--border-glass)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  💡 <strong>Explanation:</strong> {q.explanation || 'Selected option is verified.'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Reset Actions */}
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        {!result ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || Object.keys(answers).length === 0}
          >
            {loading ? 'Evaluating & Generating Certificate...' : 'Submit Quiz Assessment'}
          </button>
        ) : (
          <>
            <button
              onClick={() => { setResult(null); setAnswers({}); setRedirecting(false); }}
              className="btn btn-secondary"
            >
              <RotateCcw size={16} /> Retake Assessment
            </button>
            {result.passed && result.score > 0 && (
              <button
                onClick={goToCertificate}
                className="btn btn-aurora"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', fontWeight: 700 }}
              >
                <Award size={16} /> View Generated Certificate Page <ArrowRight size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

