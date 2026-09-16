import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, BookOpen, Video, FileText, CheckCircle2, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';

export const LearningCalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  const [selectedCourse, setSelectedCourse] = useState('All');

  const events = [
    {
      id: 1,
      date: 16,
      day: 'Wed',
      time: '10:00 AM - 11:30 AM',
      title: 'Python Syntax, OOP & Classes - Live Q&A',
      course: 'Python Full-Stack Mastery',
      type: 'lecture',
      color: '#00c6ff'
    },
    {
      id: 2,
      date: 18,
      day: 'Fri',
      time: '02:00 PM - 03:00 PM',
      title: 'PostgreSQL Indexing & B-Trees Workshop',
      course: 'Database Systems & PostgreSQL',
      type: 'workshop',
      color: '#10b981'
    },
    {
      id: 3,
      date: 21,
      day: 'Mon',
      time: '11:59 PM Deadline',
      title: 'React.js State Management Assessment',
      course: 'Web Development & React.js',
      type: 'assessment',
      color: '#f59e0b'
    },
    {
      id: 4,
      date: 24,
      day: 'Thu',
      time: '04:00 PM - 05:30 PM',
      title: 'Neural Networks & Deep Learning Review',
      course: 'Artificial Intelligence & Machine Learning',
      type: 'lecture',
      color: '#a855f7'
    }
  ];

  const filteredEvents = selectedCourse === 'All'
    ? events
    : events.filter(e => e.course === selectedCourse);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ padding: '40px 24px', flex: 1 }}>
        {/* HEADER TITLE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge badge-aurora" style={{ marginBottom: '10px' }}>
              <CalendarIcon size={14} /> Interactive Schedule
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.2rem', margin: 0 }}>
              Learning <span className="text-gradient">Calendar</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
              Track live lectures, assignment deadlines, and topic assessments across all registered courses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              className="form-control"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              style={{ width: '240px', background: 'var(--bg-card)' }}
            >
              <option value="All">All Courses</option>
              <option value="Python Full-Stack Mastery">Python Full-Stack Mastery</option>
              <option value="Database Systems & PostgreSQL">Database Systems & PostgreSQL</option>
              <option value="Web Development & React.js">Web Development & React.js</option>
              <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
            </select>
          </div>
        </div>

        {/* MAIN CALENDAR GRID & EVENT LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          {/* CALENDAR MONTH CONTAINER */}
          <div className="card-glass" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {currentMonth}
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                  <ChevronLeft size={16} />
                </button>
                <button className="btn btn-secondary btn-sm" style={{ padding: '6px 12px' }}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* WEEKDAY HEADERS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={idx} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* DAYS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
              {/* Blank offset for starting day */}
              <div />
              <div />
              {daysInMonth.map((day) => {
                const dayEvent = events.find(e => e.date === day);
                const isToday = day === 16;

                return (
                  <div
                    key={day}
                    style={{
                      height: '56px',
                      borderRadius: '10px',
                      background: isToday ? 'rgba(0, 198, 255, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: isToday ? '1px solid var(--accent-aurora)' : '1px solid var(--border-glass)',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: isToday ? 800 : 600, color: isToday ? '#00c6ff' : '#cbd5e1' }}>
                        {day}
                      </span>
                      {isToday && (
                        <span style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '4px', background: '#00c6ff', color: '#000', fontWeight: 800 }}>
                          TODAY
                        </span>
                      )}
                    </div>

                    {dayEvent && (
                      <div style={{
                        height: '6px',
                        borderRadius: '3px',
                        background: dayEvent.color,
                        boxShadow: `0 0 8px ${dayEvent.color}`
                      }} title={dayEvent.title} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* UPCOMING SCHEDULED LECTURES & DEADLINES */}
          <div className="card-glass" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles color="#00c6ff" size={20} /> Scheduled Events & Deadlines
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `4px solid ${event.color}`,
                    border: '1px solid var(--border-glass)',
                    borderLeftWidth: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <span className="badge" style={{ background: `${event.color}22`, color: event.color, border: `1px solid ${event.color}44`, fontSize: '0.7rem' }}>
                      {event.course}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {event.day}, Sep {event.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', margin: '6px 0 4px 0' }}>
                    {event.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {event.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
