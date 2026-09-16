import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { AIChatDrawer } from './AIChatDrawer';

export const FloatingRAGButton = ({ courseName = 'General Learning' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button at Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(0, 114, 255, 0.5), 0 0 20px rgba(0, 198, 255, 0.4)',
          zIndex: 999,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
        title="Open AI Tutor RAG Chatbot"
      >
        {isOpen ? <X size={26} /> : <Bot size={28} />}
        
        {/* Glow Dot */}
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: '#10b981',
          border: '2px solid #070b19'
        }}></span>
      </button>

      {/* RAG Drawer Modal */}
      <AIChatDrawer courseName={courseName} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
