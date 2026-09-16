import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

export const AnalyticsCharts = ({ stats }) => {
  // Sample data for Bar Chart (Enrollments by Department)
  const barData = [
    { label: 'Comp Sci', value: 45, color: '#10b981' },
    { label: 'Info Tech', value: 32, color: '#0099ff' },
    { label: 'Data Science', value: 28, color: '#8b5cf6' },
    { label: 'Database Systems', value: 38, color: '#f59e0b' }
  ];

  // Sample data for Pie / Donut Chart (User Role Distribution)
  const pieData = [
    { role: 'Students', percent: 75, color: '#10b981' },
    { role: 'Instructors', percent: 18, color: '#0099ff' },
    { role: 'Admins', percent: 7, color: '#f43f5e' }
  ];

  const maxBarValue = Math.max(...barData.map(d => d.value));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', marginBottom: '32px' }}>
      
      {/* 1. BAR CHART: ENROLLMENTS BY DEPARTMENT */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>Enrollments by Department</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Active student course distribution</p>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={20} color="#10b981" />
          </div>
        </div>

        {/* SVG/CSS Bar Chart Container */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '1px solid var(--border-glass)', gap: '16px' }}>
          {barData.map((item, idx) => {
            const barHeight = (item.value / maxBarValue) * 140;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{item.value}</div>
                <div style={{
                  width: '100%',
                  maxWidth: '44px',
                  height: `${barHeight}px`,
                  background: `linear-gradient(180deg, ${item.color} 0%, rgba(0,0,0,0.4) 100%)`,
                  borderRadius: '8px 8px 0 0',
                  boxShadow: `0 0 12px ${item.color}40`,
                  transition: 'height 0.5s ease'
                }}></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 600, textAlign: 'center' }}>{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PIE / DONUT CHART: USER ROLE DISTRIBUTION */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>User Distribution & Completion</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Role breakdowns in PostgreSQL CMS</p>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 153, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PieChart size={20} color="#0099ff" />
          </div>
        </div>

        {/* SVG Donut Graphic */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              {/* Segment 1: Students 75% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="75 25" strokeDashoffset="0" />
              {/* Segment 2: Instructors 18% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0099ff" strokeWidth="3.8" strokeDasharray="18 82" strokeDashoffset="-75" />
              {/* Segment 3: Admins 7% */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="3.8" strokeDasharray="7 93" strokeDashoffset="-93" />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>99.8%</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Satisfaction</div>
            </div>
          </div>

          {/* Legend Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {pieData.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                  <span>{item.role}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#fff' }}>{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
