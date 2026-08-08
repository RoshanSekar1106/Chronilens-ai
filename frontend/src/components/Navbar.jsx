import React from 'react';
import { Activity, Shield, LogOut, User, Sparkles, Menu, FileCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) => {
  const { isAuthenticated, user, logout, demoActive, toggleDemoMode } = useAuth();

  return (
    <header className="glass-card" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, sticky: 'top', zIndex: 50, padding: '0.85rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            style={{ display: 'none', '@media (maxWidth: 768px)': { display: 'flex' } }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)'
            }}>
              <Activity size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }} className="title-gradient">
                  ChroniLens AI
                </span>
                <span className="badge badge-teal" style={{ fontSize: '0.65rem' }}>
                  v1.0
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                Intelligent Health Detective & Biomarker Tracker
              </p>
            </div>
          </div>
        </div>

        {/* Status Indicators & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Quick Doctor Summary Button */}
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('doctor-summary')}
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.78rem',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <FileCheck size={15} />
              Doctor Summary
            </button>
          )}

          {/* Connection Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: demoActive ? '#f59e0b' : '#10b981',
              boxShadow: demoActive ? '0 0 8px #f59e0b' : '0 0 8px #10b981'
            }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {demoActive ? 'Demo Mode Active' : 'Connected to API'}
            </span>
          </div>

          {/* Toggle Demo Mode Button */}
          <button
            onClick={() => toggleDemoMode(!demoActive)}
            className={`btn btn-sm ${demoActive ? 'btn-primary' : 'btn-secondary'}`}
            title="Toggle Demo Mode with pre-populated health data"
            style={{ fontSize: '0.78rem' }}
          >
            <Sparkles size={14} />
            {demoActive ? 'Demo Mode ON' : 'Try Demo Mode'}
          </button>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14, 165, 233, 0.1)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                <User size={16} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.name || 'User'}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-danger btn-sm"
                title="Logout from ChroniLens"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary btn-sm">
              <Shield size={15} />
              Sign In / Register
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
