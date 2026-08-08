import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, FileText, Thermometer, CheckCircle2, GitCommit } from 'lucide-react';
import { aiService } from '../services/api';

export const TimelinePage = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      setLoading(true);
      try {
        const res = await aiService.getTimeline();
        if (res.success) {
          setTimeline(res.timeline || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Clock size={28} color="#818cf8" />
            Chronological Health Timeline
          </h1>
          <p className="text-sub">
            Track how symptoms evolve alongside lab test results over time.
          </p>
        </div>
        <div className="badge badge-purple" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {timeline.length} Timeline Milestones
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            Building your health timeline...
          </div>
        ) : timeline.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            No timeline events recorded yet. Upload lab reports or log symptoms to start building your chronological health history.
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
            
            {/* Vertical Line */}
            <div style={{
              position: 'absolute',
              left: '1.1rem',
              top: '0.5rem',
              bottom: '0.5rem',
              width: '2px',
              background: 'linear-gradient(180deg, #38bdf8 0%, #818cf8 50%, #14b8a6 100%)'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              {timeline.map((item, idx) => {
                const isRisk = item.event.toLowerCase().includes('risk') || item.event.toLowerCase().includes('elevated');
                const isReport = item.event.toLowerCase().includes('lab') || item.event.toLowerCase().includes('hemoglobin') || item.event.toLowerCase().includes('tsh');
                
                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    
                    {/* Timeline Node Icon */}
                    <div style={{
                      position: 'absolute',
                      left: '-2.4rem',
                      top: '0.2rem',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isRisk ? '#f43f5e' : isReport ? '#0ea5e9' : '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isRisk ? '0 0 10px rgba(244, 63, 94, 0.5)' : '0 0 10px rgba(14, 165, 233, 0.4)',
                      zIndex: 2
                    }}>
                      {isRisk ? (
                        <AlertTriangle size={14} color="#fff" />
                      ) : isReport ? (
                        <FileText size={14} color="#fff" />
                      ) : (
                        <Thermometer size={14} color="#fff" />
                      )}
                    </div>

                    {/* Timeline Card */}
                    <div 
                      style={{
                        background: 'rgba(9, 13, 22, 0.6)',
                        border: isRisk ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.2rem',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span className={`badge ${isRisk ? 'badge-rose' : isReport ? 'badge-blue' : 'badge-teal'}`}>
                          {isRisk ? 'Risk Alert' : isReport ? 'Lab Biomarker' : 'Symptom Entry'}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} />
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>

                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: isRisk ? '#fda4af' : 'var(--text-main)' }}>
                        {item.event}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
