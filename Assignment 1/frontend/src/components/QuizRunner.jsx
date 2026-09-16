import React, { useState } from 'react';
import { api } from '../services/api';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

export const QuizRunner = ({ quiz, onComplete }) => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return <div style={{ color: 'var(--text-secondary)', padding: '20px' }}>No questions in this quiz yet.</div>;
  }

  const handleSelectOption = (questionId, optionKey) => {
    if (result) return; // Prevent changing after submission
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await api.submitQuiz(quiz.id, answers);
      setResult(data);
      if (onComplete) onComplete(data);
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
          <div className={`badge ${result.passed ? 'badge-student' : 'badge-admin'}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            Score: {result.score}% ({result.passed ? 'PASSED 🎉' : 'TRY AGAIN ❌'})
          </div>
        )}
      </div>

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
                  💡 <strong>Explanation:</strong> {q.explanation || 'Select option is verified.'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Reset Actions */}
      <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        {!result ? (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || Object.keys(answers).length === 0}
          >
            {loading ? 'Evaluating...' : 'Submit Quiz Assessment'}
          </button>
        ) : (
          <button
            onClick={() => { setResult(null); setAnswers({}); }}
            className="btn btn-secondary"
          >
            <RotateCcw size={16} /> Retake Assessment
          </button>
        )}
      </div>
    </div>
  );
};
