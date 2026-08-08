import React, { useState, useEffect } from 'react';
import { FileCheck, Copy, Printer, CheckCircle2, Stethoscope, RefreshCw } from 'lucide-react';
import { aiService } from '../services/api';

export const DoctorSummaryPage = () => {
  const [summaryText, setSummaryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchDoctorSummary = async () => {
    setLoading(true);
    try {
      const res = await aiService.getDoctorSummary();
      if (res.success) {
        setSummaryText(res.summary || '');
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
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FileCheck size={28} color="#10b981" />
            Doctor Summary Generator
          </h1>
          <p className="text-sub">
            1-Click clinical summary compiler formatted specifically for medical consultations and physician review.
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

      <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-glow)', paddingBottom: '1.2rem', marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Stethoscope size={32} color="#38bdf8" />
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>ChroniLens AI Medical Report</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Synthesized Clinical Snapshot for Attending Physician</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Date Generated:</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-dim)' }}>
            Compiling patient summary and lab markers...
          </div>
        ) : (
          <div style={{ background: 'rgba(9, 13, 22, 0.7)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '2rem' }}>
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.92rem',
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6
            }}>
              {summaryText}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
};
