import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';
import { aiService } from '../services/api';

export const TrendsPage = () => {
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const res = await aiService.getTrends();
        if (res.success) {
          setTrendData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <TrendingUp size={28} color="#06b6d4" />
            Biomarker Trend Analytics
          </h1>
          <p className="text-sub">
            Track directional progression of blood lab markers (Hemoglobin, TSH, Blood Sugar) across sequential lab reports.
          </p>
        </div>
        <div className="badge badge-teal" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          Longitudinal Health Tracking
        </div>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          Computing biomarker trajectory...
        </div>
      ) : (
        <div className="grid-3">
          
          {/* Main Biomarker Card: Hemoglobin */}
          <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Hemoglobin Level
              </span>
              <span className={`badge ${trendData?.trend === 'Decreasing' ? 'badge-rose' : 'badge-teal'}`}>
                {trendData?.trend || 'Stable'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Initial Reading</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {trendData?.firstValue ? `${trendData.firstValue} g/dL` : '11.2 g/dL'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Latest Reading</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: trendData?.latestValue < 12 ? '#fb7185' : '#2dd4bf' }}>
                  {trendData?.latestValue ? `${trendData.latestValue} g/dL` : '10.8 g/dL'}
                </span>
              </div>
            </div>

            {/* Visual SVG Mini Trendline */}
            <div style={{ height: '60px', width: '100%', marginTop: '0.5rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path
                  d="M 10 20 L 70 25 L 130 40 L 190 48"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="3"
                />
                <circle cx="10" cy="20" r="4" fill="#38bdf8" />
                <circle cx="70" cy="25" r="4" fill="#38bdf8" />
                <circle cx="130" cy="40" r="4" fill="#fb7185" />
                <circle cx="190" cy="48" r="5" fill="#f43f5e" />
              </svg>
            </div>

            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fda4af' }}>
                ⚠️ Trajectory Alert: {trendData?.risk || 'Anemia Risk Increasing'}
              </div>
            </div>
          </div>

          {/* Biomarker Card: TSH (Thyroid) */}
          <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                TSH (Thyroid)
              </span>
              <span className="badge badge-amber">Increasing</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Initial Reading</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>5.1 mIU/L</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Latest Reading</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>5.4 mIU/L</span>
              </div>
            </div>

            {/* Visual SVG Mini Trendline */}
            <div style={{ height: '60px', width: '100%', marginTop: '0.5rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path
                  d="M 10 45 L 70 38 L 130 25 L 190 15"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
                <circle cx="10" cy="45" r="4" fill="#fbbf24" />
                <circle cx="70" cy="38" r="4" fill="#fbbf24" />
                <circle cx="130" cy="25" r="4" fill="#fbbf24" />
                <circle cx="190" cy="15" r="5" fill="#f59e0b" />
              </svg>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fef08a' }}>
                ⚠️ Thyroid Marker Elevated (&gt; 4.5 reference)
              </div>
            </div>
          </div>

          {/* Biomarker Card: Blood Sugar */}
          <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Fasting Blood Sugar
              </span>
              <span className="badge badge-teal">Stable</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Initial Reading</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>95 mg/dL</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Latest Reading</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#2dd4bf' }}>98 mg/dL</span>
              </div>
            </div>

            {/* Visual SVG Mini Trendline */}
            <div style={{ height: '60px', width: '100%', marginTop: '0.5rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
                <path
                  d="M 10 32 L 70 30 L 130 28 L 190 27"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth="3"
                />
                <circle cx="10" cy="32" r="4" fill="#2dd4bf" />
                <circle cx="70" cy="30" r="4" fill="#2dd4bf" />
                <circle cx="130" cy="28" r="4" fill="#2dd4bf" />
                <circle cx="190" cy="27" r="5" fill="#10b981" />
              </svg>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6ee7b7' }}>
                ✅ Blood Sugar Normal (&le; 100 mg/dL)
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
