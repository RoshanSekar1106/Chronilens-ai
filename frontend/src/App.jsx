import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './pages/AuthPage';

import { DashboardPage } from './pages/DashboardPage';
import { SymptomsPage } from './pages/SymptomsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AiDetectivePage } from './pages/AiDetectivePage';
import { TimelinePage } from './pages/TimelinePage';
import { TrendsPage } from './pages/TrendsPage';
import { DoctorSummaryPage } from './pages/DoctorSummaryPage';
import { DatasetPage } from './pages/DatasetPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'symptoms':
        return <SymptomsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'detective':
        return <AiDetectivePage />;
      case 'timeline':
        return <TimelinePage />;
      case 'trends':
        return <TrendsPage />;
      case 'doctor-summary':
        return <DoctorSummaryPage />;
      case 'dataset':
        return <DatasetPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-layout">
      {/* Top Header Navbar */}
      <Navbar 
        onOpenAuth={() => setAuthModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="main-body">
        {/* Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Dynamic Page Container */}
        <main className="content-container">
          {renderActivePage()}
        </main>
      </div>

      {/* Auth Modal overlay */}
      {authModalOpen && (
        <AuthPage onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
