import React, { useState, useEffect } from 'react';
import { FileCheck, Copy, Printer, CheckCircle2, Stethoscope, RefreshCw, AlertTriangle } from 'lucide-react';
import { aiService } from '../services/api';

export const DoctorSummaryPage = () => {
  const [summaryText, setSummaryText] = useState('');
  const [problems, setProblems] = useState([]);
  const [problemsCount, setProblemsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchDoctorSummary = async () => {
    setLoading(true);
    try {
      const res = await aiService.getDoctorSummary();
      if (res.success) {
        setSummaryText(res.summary || '');
        setProblems(res.problems || []);
        setProblemsCount(res.problemsCount || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorSummary();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Title & Control Bar (Hidden on Print) */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={28} color="#10b981" />
            Doctor Summary Generator
          </h1>
          <p className="text-sub">
            Aggregates multiple hospital records & symptom logs into a sharp, easy-to-read clinical report for doctors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button 
            onClick={fetchDoctorSummary} 
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'pulse-glow' : ''} />
            {loading ? 'Compiling...' : 'Re-Generate Summary'}
          </button>

          <button onClick={handleCopy} className="btn btn-secondary">
            {copied ? <CheckCircle2 size={16} color="#6ee7b7" /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
          </button>
          
          <button onClick={handlePrint} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <Printer size={16} />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Doctor Summary Printable Document Container */}
      <div className="glass-card doctor-summary-print-container" style={{ padding: '2.5rem', maxWidth: '950px', margin: '0 auto', width: '100%' }}>
        
        {/* Report Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-glow)', paddingBottom: '1.2rem', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Stethoscope size={32} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>ChroniLens AI Medical Report</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Multi-Hospital Records Aggregation & Clinical Synthesis</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span className={`badge ${problemsCount > 0 ? 'badge-rose' : 'badge-teal'}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              {problemsCount > 0 ? `${problemsCount} Clinical Problem(s) Found` : '0 Problems Found'}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
            Compiling patient summary across all uploaded hospital records...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Visual Problem Cards Header */}
            {problems.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚠️ Primary Health Problems Identified ({problems.length}):
                </div>
                <div className="grid-2" style={{ gap: '0.8rem' }}>
                  {problems.map((p, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        background: 'rgba(244, 63, 94, 0.08)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.9rem 1.1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.8rem'
                      }}
                    >
                      <AlertTriangle size={20} color="#fb7185" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fda4af' }}>
                          {idx + 1}. {p.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          {p.detail}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                          Source: {p.source}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High Contrast Doctor Summary Text Box */}
            <div className="doctor-summary-text-box" style={{ background: 'rgba(9, 13, 22, 0.85)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
              <pre style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.92rem',
                color: '#ffffff',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.6
              }}>
                {summaryText}
              </pre>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
