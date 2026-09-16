import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, X, HelpCircle, FileText, CheckSquare, MessageSquare } from 'lucide-react';

export const AIChatDrawer = ({ courseName, isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your AI Learning Assistant for **${courseName}**. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText = input, intent = 'explain') => {
    const textToSend = queryText.trim();
    if (!textToSend) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.askAI(textToSend, courseName, intent);
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '560px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--gradient-primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={22} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>AI Learning Tutor</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{courseName} Assistant</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div style={{ padding: '10px 16px', background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid var(--border-glass)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        <button
          onClick={() => handleSend(`Summarize the core topics of ${courseName}`, 'summarize')}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
        >
          <FileText size={12} /> Summarize
        </button>
        <button
          onClick={() => handleSend(`Give me a practice quiz question on ${courseName}`, 'quiz')}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '4px 10px', whiteSpace: 'nowrap' }}
        >
          <CheckSquare size={12} /> Practice Quiz
        </button>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '16px',
              background: msg.sender === 'user' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              border: msg.sender === 'ai' ? '1px solid var(--border-glass)' : 'none'
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} className="spin" /> AI is thinking...
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Ask AI a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          style={{ padding: '10px 14px', fontSize: '0.9rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '10px 14px' }} disabled={loading || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
