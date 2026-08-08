import React from 'react';
import { 
  LayoutDashboard, 
  Thermometer, 
  FileText, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  FileCheck,
  Database
} from 'lucide-react';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'symptoms', label: 'Symptom Log', icon: Thermometer, badge: 'Track' },
  { id: 'reports', label: 'Lab Reports & OCR', icon: FileText, badge: 'OCR' },
  { id: 'detective', label: 'AI Health Detective', icon: Sparkles, badge: 'AI', highlight: true },
  { id: 'timeline', label: 'Health Timeline', icon: Clock, badge: null },
  { id: 'trends', label: 'Biomarker Trends', icon: TrendingUp, badge: null },
  { id: 'doctor-summary', label: 'Doctor Summary', icon: FileCheck, badge: 'Export' },
  { id: 'dataset', label: 'Dataset Manager', icon: Database, badge: 'CRUD' },
];

export const Sidebar = ({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <aside 
      className="glass-card" 
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 65px)',
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
        borderLeft: 0,
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        transition: 'transform 0.3s ease',
        zIndex: 40
      }}
    >
      <div style={{ padding: '0 0.5rem 0.75rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        Navigation Menu
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (setMobileMenuOpen) setMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: isActive ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
              background: isActive 
                ? 'linear-gradient(90deg, rgba(14, 165, 233, 0.15) 0%, rgba(20, 184, 166, 0.05) 100%)' 
                : item.highlight ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
              color: isActive ? '#38bdf8' : item.highlight ? '#a5b4fc' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'var(--transition)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Icon size={18} color={isActive ? '#38bdf8' : item.highlight ? '#818cf8' : 'currentColor'} />
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className={`badge ${item.highlight ? 'badge-purple' : isActive ? 'badge-blue' : 'badge-teal'}`} style={{ fontSize: '0.65rem' }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          💡 AI Health Note
        </div>
        <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
          Upload blood reports to extract Hemoglobin, TSH, and Blood Sugar automatically.
        </p>
      </div>
    </aside>
  );
};
