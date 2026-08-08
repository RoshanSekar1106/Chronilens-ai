import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  Thermometer, 
  FileText, 
  Clock, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileCheck,
  Stethoscope,
  RefreshCw
} from 'lucide-react';
import { dashboardService, symptomService, aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ symptoms: 0, reports: 0, timeline: 0, aiInsights: 0 });
  const [recentSymptoms, setRecentSymptoms] = useState([]);
  const [detectiveSummary, setDetectiveSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick symptom form state
  const [quickSymptom, setQuickSymptom] = useState({ name: '', severity: 5, notes: '' });
  const [addingSymptom, setAddingSymptom] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, symptomsRes, detectiveRes] = await Promise.all([
        dashboardService.getStats(),
        symptomService.getSymptoms('', 1, 5),
        aiService.getHealthDetective()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (symptomsRes.success) setRecentSymptoms(symptomsRes.data || []);
      if (detectiveRes.success) setDetectiveSummary(detectiveRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAddSymptom = async (e) => {
    e.preventDefault();
    if (!quickSymptom.name.trim()) return;
    
    setAddingSymptom(true);
    try {
      await symptomService.addSymptom({
        symptomName: quickSymptom.name,
        severity: Number(quickSymptom.severity),
        notes: quickSymptom.notes
      });
      setSuccessMsg('Symptom logged successfully!');
      setQuickSymptom({ name: '', severity: 5, notes: '' });
      loadDashboardData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingSymptom(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.9) 0%, rgba(14, 165, 233, 0.15) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-teal">AI Health Monitoring</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                • Updated Real-time
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Welcome back, <span className="title-gradient">{user?.name || 'Health Explorer'}</span> 👋
            </h1>
            <p className="text-sub">
              ChroniLens AI is constantly analyzing your lab reports and symptom logs to discover hidden health correlations and track medical trends.
            </p>
          </div>

          {/* Primary Action Button: Generate Doctor Summary */}
          <button
            onClick={() => setActiveTab('doctor-summary')}
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              gap: '0.75rem'
            }}
          >
            <FileCheck size={22} />
            <span>Generate Doctor Summary</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Metric Overview Cards */}
      <div className="grid-4">
        
        {/* Card 1: Logged Symptoms */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Logged Symptoms
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Thermometer size={20} color="#38bdf8" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats.symptoms}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>entries recorded</span>
          </div>
          <button 
            onClick={() => setActiveTab('symptoms')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', marginTop: 'auto' }}
          >
            <span>Log Symptom</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 2: Lab Reports & OCR */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Lab Reports (OCR)
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#2dd4bf" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>{stats.reports}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>documents parsed</span>
          </div>
          <button 
            onClick={() => setActiveTab('reports')}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', marginTop: 'auto' }}
          >
            <span>Upload & Scan</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 3: Doctor Summary Banner Tile */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase' }}>
              Doctor Consultation
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={20} color="#6ee7b7" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6ee7b7' }}>Summary Ready</span>
          </div>
          <button 
            onClick={() => setActiveTab('doctor-summary')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', marginTop: 'auto', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            <span>Generate Summary</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card 4: AI Detective Status */}
        <div className="glass-card glass-card-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase' }}>
              AI Detective
            </span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#a5b4fc" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>Active Scan</span>
          </div>
          <button 
            onClick={() => setActiveTab('detective')}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between', marginTop: 'auto', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
          >
            <span>Analyze Clues</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* Content Section: Quick Add & AI Detective Summary */}
      <div className="grid-2">
        
        {/* Quick Log Symptom Widget */}
        <div className="glass-card" style={{ padding: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Quick Log Symptom</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Instantly record how you feel right now</p>
            </div>
            <Thermometer size={22} color="#38bdf8" />
          </div>

          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '1rem' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleQuickAddSymptom}>
            <div className="form-group">
              <label className="form-label">Symptom Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Fatigue, Headache, Dizziness"
                value={quickSymptom.name}
                onChange={(e) => setQuickSymptom({ ...quickSymptom, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Severity Level</label>
                <span className={`badge ${quickSymptom.severity > 7 ? 'badge-rose' : quickSymptom.severity > 4 ? 'badge-amber' : 'badge-teal'}`}>
                  {quickSymptom.severity} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                className="severity-slider"
                style={{ marginTop: '0.5rem' }}
                value={quickSymptom.severity}
                onChange={(e) => setQuickSymptom({ ...quickSymptom, severity: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Worse after meals, evening time..."
                value={quickSymptom.notes}
                onChange={(e) => setQuickSymptom({ ...quickSymptom, notes: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={addingSymptom}>
              <Plus size={16} />
              {addingSymptom ? 'Saving Entry...' : 'Save Symptom Entry'}
            </button>
          </form>
        </div>

        {/* AI Diagnostic Highlights & Doctor Summary Banner */}
        <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#c084fc" />
                Latest AI Findings
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Correlated insights from lab reports and logs</p>
            </div>
            <span className="badge badge-purple">AI Detective</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {detectiveSummary?.findings?.length > 0 ? (
              detectiveSummary.findings.map((finding, idx) => (
                <div 
                  key={idx} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    padding: '0.9rem 1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <AlertTriangle size={18} color={finding.includes('Anemia') || finding.includes('Thyroid') ? '#fb7185' : '#38bdf8'} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{finding}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                Upload lab reports or log symptoms to generate AI Detective findings.
              </div>
            )}

            {/* Prominent Doctor Summary Action Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1.2rem', borderRadius: 'var(--radius-md)', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Stethoscope size={16} color="#6ee7b7" />
                  Preparing for a doctor visit?
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Generate a complete clinical report of symptoms and lab findings for your physician.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('doctor-summary')}
                className="btn btn-primary btn-sm"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', whiteSpace: 'nowrap' }}
              >
                <FileCheck size={16} />
                Generate Summary
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
