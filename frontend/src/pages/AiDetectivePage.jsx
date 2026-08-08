import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Search, Compass, RefreshCw, Lightbulb, FileText, ArrowRight } from 'lucide-react';
import { aiService } from '../services/api';

export const AiDetectivePage = () => {
  const [findings, setFindings] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [clues, setClues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const loadAiDetectiveData = async () => {
    setLoading(true);
    try {
      const [detectiveRes, cluesRes] = await Promise.all([
        aiService.getHealthDetective(),
        aiService.getMissedClues()
      ]);

      if (detectiveRes.success) {
        setFindings(detectiveRes.findings || []);
        setRecommendation(detectiveRes.recommendation || '');
      }

      if (cluesRes.success) {
        setClues(cluesRes.clues || []);
      }
    } catch (err) {
      console.error('AI Detective load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAiDetectiveData();
  }, []);

  const handleReScan = async () => {
    setScanning(true);
    await loadAiDetectiveData();
    setScanning(false);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={28} color="#c084fc" />
            AI Health Detective & Root Cause Engine
          </h1>
          <p className="text-sub">
            Correlates multi-source medical lab OCR results with symptom frequencies to spot hidden health root causes.
          </p>
        </div>
        <button 
          onClick={handleReScan} 
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
          disabled={scanning}
        >
          <RefreshCw size={16} className={scanning ? 'pulse-glow' : ''} />
          {scanning ? 'Running AI Scan...' : 'Re-Run Diagnostic Scan'}
        </button>
      </div>

      <div className="grid-2">
        
        {/* Left Column: Key Diagnostic Findings */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '1px solid rgba(147, 51, 234, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Diagnostic Findings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Parsed anomalies & normal biomarker status</p>
            </div>
            <span className="badge badge-purple">Lab & Symptom Scan</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                Analyzing medical data...
              </div>
            ) : findings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                No findings generated yet. Upload lab reports to trigger AI analysis.
              </div>
            ) : (
              findings.map((finding, idx) => {
                const isRisk = finding.toLowerCase().includes('anemia') || finding.toLowerCase().includes('hypothyroid') || finding.toLowerCase().includes('high');
                
                return (
                  <div
                    key={idx}
                    style={{
                      background: isRisk ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                      border: isRisk ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem'
                    }}
                  >
                    {isRisk ? (
                      <AlertTriangle size={22} color="#fb7185" style={{ flexShrink: 0 }} />
                    ) : (
                      <CheckCircle2 size={22} color="#6ee7b7" style={{ flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isRisk ? '#fda4af' : '#6ee7b7' }}>
                        {finding}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                        {isRisk ? 'Requires medical attention / clinical review' : 'Biomarker within target reference range'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {recommendation && (
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <Lightbulb size={18} color="#a5b4fc" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                  AI Clinical Guidance
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {recommendation}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Missed Clues & Pattern Recognition */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Missed Clues & Pattern Detection</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Recurring symptom spikes & hidden correlations</p>
            </div>
            <span className="badge badge-amber">Pattern Engine</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                Scanning symptom patterns...
              </div>
            ) : clues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                No recurring symptom patterns detected yet. Log more symptoms to unlock root-cause insights.
              </div>
            ) : (
              clues.map((clue, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.9rem'
                  }}
                >
                  <Compass size={22} color="#fbbf24" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fef08a' }}>
                      Symptom Recurrence Signal
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {clue}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              🔍 How AI Health Detective Works
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
              The detective correlates your lab test readings (Hemoglobin, TSH, Blood Sugar) with symptom frequency logs to pinpoint root causes like Anemia or Thyroid Imbalance.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
