import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Cpu, 
  ShieldAlert, 
  Clock, 
  BarChart3, 
  LogOut, 
  Activity,
  User,
  HeartPulse
} from 'lucide-react';

export default function Navbar({ currentUser, activeTab, setActiveTab, onLogout, onSwitchRole }) {
  const navItems = [
    { id: 'facility', label: 'Ward Staffing', icon: Building2, roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN'] },
    { id: 'professional', label: 'Pro Shift Portal', icon: HeartPulse, roles: ['PROFESSIONAL', 'AGENCY_ADMIN', 'FACILITY_MANAGER'] },
    { id: 'ai-matching', label: 'AI Match & Schedule', icon: Cpu, roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN'] },
    { id: 'compliance', label: 'Compliance & NMBI', icon: ShieldAlert, roles: ['AGENCY_ADMIN', 'FACILITY_MANAGER', 'PROFESSIONAL'] },
    { id: 'timesheets', label: 'Timesheets & Billing', icon: Clock, roles: ['FACILITY_MANAGER', 'AGENCY_ADMIN', 'PROFESSIONAL'] },
    { id: 'analytics', label: 'Agency Analytics', icon: BarChart3, roles: ['AGENCY_ADMIN'] },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'FACILITY_MANAGER':
        return <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-sky-200">🏥 Facility Leader</span>;
      case 'PROFESSIONAL':
        return <span className="bg-teal-100 text-teal-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-teal-200">🩺 Registered Nurse</span>;
      case 'AGENCY_ADMIN':
        return <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-200">🌐 Agency Admin</span>;
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('facility')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">Nexgile-MediOracle</span>
                <span className="text-[10px] uppercase font-bold bg-teal-600 text-white px-1.5 py-0.5 rounded tracking-wider">PORTAL</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Healthcare Workforce & Shift Intelligence</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User profile & controls */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800">{currentUser?.full_name || 'Aoife Murphy'}</span>
                {getRoleBadge(currentUser?.role)}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{currentUser?.organization || 'MediOracle Health'}</span>
            </div>

            {/* Quick Role Switcher Button */}
            <button
              onClick={onSwitchRole}
              title="Switch demo user role"
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
