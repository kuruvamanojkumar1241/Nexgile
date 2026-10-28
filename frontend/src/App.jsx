import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import FacilityDashboard from './pages/FacilityDashboard';
import ProfessionalPortal from './pages/ProfessionalPortal';
import AIMatchingView from './pages/AIMatchingView';
import ComplianceHub from './pages/ComplianceHub';
import TimesheetsBilling from './pages/TimesheetsBilling';
import AgencyAnalytics from './pages/AgencyAnalytics';
import { api } from './api';
import { 
  Menu, 
  Sparkles, 
  Bell, 
  Calendar, 
  Clock, 
  RefreshCw,
  User,
  Activity,
  HeartPulse,
  Building2,
  Cpu,
  ShieldAlert,
  BarChart3
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('facility');
  const [selectedShiftForAI, setSelectedShiftForAI] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'PROFESSIONAL') {
      setActiveTab('professional');
    } else if (user.role === 'AGENCY_ADMIN') {
      setActiveTab('analytics');
    } else {
      setActiveTab('facility');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchToShiftAI = (shiftId) => {
    setSelectedShiftForAI(shiftId);
    setActiveTab('ai-matching');
  };

  const handleQuickSwitchRole = async (role) => {
    try {
      const user = await api.login({ role });
      handleLoginSuccess(user);
      setShowRoleModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Get active tab metadata for top bar
  const getTabInfo = () => {
    switch (activeTab) {
      case 'facility':
        return {
          title: 'Ward Staffing Command',
          subtitle: 'Live floor census, acuity staffing ratios & urgent shift postings',
          icon: Building2,
          color: 'text-cyan-400',
          badge: 'Ward Roster 100% Synced',
          badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/60'
        };
      case 'professional':
        return {
          title: 'Healthcare Professional Portal',
          subtitle: 'Pro proximity feed, 1-click apply, GPS geofence clock-in & instant wallet',
          icon: HeartPulse,
          color: 'text-emerald-400',
          badge: 'GPS Armed • 200m Range',
          badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/60'
        };
      case 'ai-matching':
        return {
          title: 'AI Candidate Match & Dispatch',
          subtitle: 'Algorithmic 0-99% candidate ranking & automated offer dispatch engine',
          icon: Cpu,
          color: 'text-purple-400',
          badge: 'Model v4.2 Running',
          badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/60'
        };
      case 'compliance':
        return {
          title: 'Compliance & NMBI Credentials Passport',
          subtitle: 'Real-time Irish NMBI register lookup, Garda vetting & HSE training passports',
          icon: ShieldAlert,
          color: 'text-amber-400',
          badge: '100% NMBI Audited',
          badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/60'
        };
      case 'timesheets':
        return {
          title: 'Digital Timesheets & Billing',
          subtitle: 'Director digital sign-offs, hours breakdown & consolidated facility invoices',
          icon: Clock,
          color: 'text-indigo-400',
          badge: 'SEPA Direct Ready',
          badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/60'
        };
      case 'analytics':
        return {
          title: 'Agency Executive Analytics',
          subtitle: 'Live fill-rate metrics, gross agency margins & emergency broadcast dispatch',
          icon: BarChart3,
          color: 'text-rose-400',
          badge: 'Live KPI Feeds',
          badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/60'
        };
      default:
        return {
          title: 'Healthcare Portal',
          subtitle: 'MediOracle Healthcare Intelligence Platform',
          icon: Activity,
          color: 'text-cyan-400',
          badge: 'Online',
          badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/60'
        };
    }
  };

  const tabInfo = getTabInfo();
  const TabIcon = tabInfo.icon;

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 flex">
      {/* Multi-Color Left Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSwitchRole={() => setShowRoleModal(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Header Navigation Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-md">
          <div className="flex items-center justify-between">
            
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner ${tabInfo.color}`}>
                  <TabIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {tabInfo.title}
                    </h1>
                    <span className={`hidden sm:inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${tabInfo.badgeColor}`}>
                      {tabInfo.badge}
                    </span>
                  </div>
                  <p className="hidden md:block text-xs text-slate-400 font-medium truncate max-w-xl">
                    {tabInfo.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Quick Persona Switcher Button */}
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/20 via-indigo-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Role:</span>
                <span className="text-cyan-300 font-black">
                  {currentUser?.role === 'FACILITY_MANAGER' ? 'Ward Leader' : currentUser?.role === 'PROFESSIONAL' ? 'ICU Nurse' : 'Admin'}
                </span>
              </button>

              {/* Live Status indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-300">DUBLIN ICU</span>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'facility' && (
            <FacilityDashboard onSelectShiftForAI={handleSwitchToShiftAI} />
          )}

          {activeTab === 'professional' && (
            <ProfessionalPortal />
          )}

          {activeTab === 'ai-matching' && (
            <AIMatchingView selectedShiftId={selectedShiftForAI} />
          )}

          {activeTab === 'compliance' && (
            <ComplianceHub />
          )}

          {activeTab === 'timesheets' && (
            <TimesheetsBilling />
          )}

          {activeTab === 'analytics' && (
            <AgencyAnalytics />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Nexgile-MediOracle Healthcare Intelligence Platform</span>
          <span className="text-[11px] text-slate-600 font-mono">Django 4.2 REST • React 18 • SQLite</span>
        </footer>

      </div>

      {/* Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-700 text-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Switch Demo Perspective</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Explore the portal from each persona's viewpoint</p>
              </div>
              <button 
                onClick={() => setShowRoleModal(false)} 
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <button
                onClick={() => handleQuickSwitchRole('FACILITY_MANAGER')}
                className="w-full p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/50 to-blue-950/30 hover:border-cyan-400 text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      🏥 Hospital Ward Leader (Dr. Liam O’Connor)
                    </div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                      Manage ward rosters, acuity deficit alerts & post urgent shifts
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickSwitchRole('PROFESSIONAL')}
                className="w-full p-3.5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/50 to-teal-950/30 hover:border-emerald-400 text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      🩺 ICU Specialist Nurse (Aoife Murphy)
                    </div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                      1-click confirm shifts, live GPS clock-in & SEPA instant pay
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleQuickSwitchRole('AGENCY_ADMIN')}
                className="w-full p-3.5 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/50 to-indigo-950/30 hover:border-purple-400 text-left transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      🌐 Agency Admin (Sarah Brennan)
                    </div>
                    <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                      Regional operations, gross margins & emergency broadcast dispatch
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
