import React from 'react';
import { 
  Building2, 
  HeartPulse, 
  Cpu, 
  ShieldAlert, 
  Clock, 
  BarChart3, 
  LogOut, 
  Activity,
  User,
  Radio,
  MapPin,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onSwitchRole,
  isMobileOpen,
  setIsMobileOpen
}) {
  const navItems = [
    { 
      id: 'facility', 
      label: 'Ward Staffing', 
      desc: 'Roster ratios & shift alerts',
      icon: Building2, 
      roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN'],
      color: 'cyan',
      gradient: 'from-cyan-500 to-blue-600',
      activeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      iconColor: 'text-cyan-400',
      badge: 'ICU Live',
      badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-800/60'
    },
    { 
      id: 'professional', 
      label: 'Pro Shift Portal', 
      desc: 'GPS clock-in & instant pay',
      icon: HeartPulse, 
      roles: ['PROFESSIONAL', 'AGENCY_ADMIN', 'FACILITY_MANAGER'],
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      activeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      badge: 'Instant Pay',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800/60'
    },
    { 
      id: 'ai-matching', 
      label: 'AI Match & Schedule', 
      desc: 'Algorithmic 99% ranking',
      icon: Cpu, 
      roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN'],
      color: 'purple',
      gradient: 'from-violet-500 to-purple-600',
      activeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      iconColor: 'text-purple-400',
      badge: 'AI Engine',
      badgeBg: 'bg-purple-950 text-purple-300 border-purple-800/60'
    },
    { 
      id: 'compliance', 
      label: 'Compliance & NMBI', 
      desc: 'PIN, Garda vetting & HSE',
      icon: ShieldAlert, 
      roles: ['AGENCY_ADMIN', 'FACILITY_MANAGER', 'PROFESSIONAL'],
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      activeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      iconColor: 'text-amber-400',
      badge: 'Audit Ready',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-800/60'
    },
    { 
      id: 'timesheets', 
      label: 'Timesheets & Billing', 
      desc: 'Clinical sign-off & Net 30',
      icon: Clock, 
      roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN', 'PROFESSIONAL'],
      color: 'indigo',
      gradient: 'from-blue-500 to-indigo-600',
      activeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      iconColor: 'text-indigo-400',
      badge: 'Sign-Off',
      badgeBg: 'bg-indigo-950 text-indigo-300 border-indigo-800/60'
    },
    { 
      id: 'analytics', 
      label: 'Agency Analytics', 
      desc: 'KPI margins & dispatch',
      icon: BarChart3, 
      roles: ['AGENCY_ADMIN'],
      color: 'rose',
      gradient: 'from-rose-500 to-pink-600',
      activeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      iconColor: 'text-rose-400',
      badge: 'Live KPIs',
      badgeBg: 'bg-rose-950 text-rose-300 border-rose-800/60'
    },
  ];

  const getRoleConfig = (role) => {
    switch (role) {
      case 'FACILITY_MANAGER':
        return {
          title: 'Hospital Ward Leader',
          badge: '🏥 Ward Leader',
          gradient: 'from-cyan-500 to-blue-600',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          bg: 'bg-cyan-500/10'
        };
      case 'PROFESSIONAL':
        return {
          title: 'Registered ICU Nurse',
          badge: '🩺 Registered Nurse',
          gradient: 'from-emerald-500 to-teal-600',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10'
        };
      case 'AGENCY_ADMIN':
        return {
          title: 'Agency Operations Director',
          badge: '🌐 Agency Admin',
          gradient: 'from-violet-500 to-purple-600',
          border: 'border-violet-500/30',
          text: 'text-violet-400',
          bg: 'bg-violet-500/10'
        };
      default:
        return {
          title: 'Clinical User',
          badge: 'Clinical User',
          gradient: 'from-slate-500 to-slate-700',
          border: 'border-slate-700',
          text: 'text-slate-400',
          bg: 'bg-slate-800'
        };
    }
  };

  const roleConfig = getRoleConfig(currentUser?.role);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 flex-shrink-0 flex flex-col justify-between bg-slate-950/95 border-r border-slate-800/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Brand & User Identity */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent">
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center space-x-3 cursor-pointer group" 
                onClick={() => { setActiveTab('facility'); if (setIsMobileOpen) setIsMobileOpen(false); }}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                      MediOracle
                    </span>
                    <span className="text-[10px] uppercase font-black bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-1.5 py-0.5 rounded tracking-wider shadow-sm">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium tracking-tight">Healthcare Workforce</p>
                </div>
              </div>

              {/* Close button for mobile */}
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Live System Indicator Badge */}
            <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300 font-semibold">Core System Active</span>
              </div>
              <span className="text-cyan-400 font-mono text-[10px] font-bold">PORT 8000</span>
            </div>
          </div>

          {/* User Persona Profile Card */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/40 to-slate-950 border border-slate-800/80 shadow-md">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${roleConfig.gradient} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white truncate">
                    {currentUser?.full_name || 'Aoife Murphy'}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser?.organization || 'St. Vincent\'s Hospital'}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleConfig.bg} ${roleConfig.text} ${roleConfig.border}`}>
                {roleConfig.badge}
              </span>
              
              <button
                onClick={onSwitchRole}
                className="text-[11px] font-medium text-slate-400 hover:text-cyan-300 flex items-center space-x-1 transition-colors group"
                title="Switch demo user perspective"
              >
                <span>Switch</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-500 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation Links */}
          <div className="px-3 py-2">
            <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">
              Clinical Navigation
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (setIsMobileOpen) setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 group ${
                      isActive 
                        ? `${item.activeBg} shadow-lg shadow-black/40` 
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 text-left">
                      <div className={`p-2 rounded-lg transition-colors ${
                        isActive 
                          ? `bg-gradient-to-tr ${item.gradient} text-white shadow-md` 
                          : 'bg-slate-900 text-slate-400 group-hover:text-white group-hover:bg-slate-800'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`block text-xs font-bold leading-none ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                          {item.label}
                        </span>
                        <span className="block text-[10px] font-normal text-slate-500 mt-0.5 group-hover:text-slate-400">
                          {item.desc}
                        </span>
                      </div>
                    </div>

                    {/* Badge Pill */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-colors ${
                      isActive 
                        ? item.badgeBg 
                        : 'bg-slate-900/80 text-slate-500 border-slate-800 group-hover:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
          
          {/* GPS Geofence Armed Banner */}
          <div className="mb-3 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] flex items-center justify-between text-slate-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-semibold text-slate-300">GPS Geofence: 200m</span>
            </div>
            <span className="inline-flex items-center text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
              Active
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-bold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>

          <p className="mt-3 text-[10px] text-center text-slate-600">
            Nexgile-MediOracle v1.0 • Django + React
          </p>
        </div>

      </aside>
    </>
  );
}
