import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Building2, 
  HeartPulse, 
  Shield, 
  ArrowRight,
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('nurse_aoife');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ username, password });
      if (res.error) {
        setError(res.error);
      } else {
        onLoginSuccess(res);
      }
    } catch (err) {
      setError('Unable to connect to Django backend on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login({ role });
      onLoginSuccess(res);
    } catch (err) {
      setError('Failed to login with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-dark flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 text-white shadow-xl shadow-cyan-500/20 mb-4 animate-float">
          <Activity className="w-9 h-9" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Nexgile-MediOracle</h2>
          <span className="text-[10px] uppercase font-black bg-gradient-to-r from-cyan-500 to-indigo-500 text-white px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            PRO
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          Healthcare Workforce & Shift Intelligence Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-800 text-slate-100">
          
          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Quick Demo Logins Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Instant 1-Click Demo Login</span>
              </p>
              <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                Multi-Role
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Role 1: Facility Leader (Cyan/Sky) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('FACILITY_MANAGER')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/80 hover:border-cyan-400 hover:from-cyan-950/60 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 group-hover:scale-105 group-hover:bg-cyan-500/30 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Hospital Ward Leader (Dr. Liam O’Connor)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      St. Vincent's ICU • Staffing ratios & urgent shift dispatch
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Role 2: Professional (Emerald/Teal) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('PROFESSIONAL')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 to-slate-900/80 hover:border-emerald-400 hover:from-emerald-950/60 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 group-hover:scale-105 group-hover:bg-emerald-500/30 transition-transform">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Registered ICU Nurse (Aoife Murphy)
                    </div>
                    <div className="text-[11px] text-slate-400">
                      NMBI #948201 • GPS Clock-in • SEPA Instant Pay Wallet
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Role 3: Agency Admin (Purple/Violet) */}
              <button
                type="button"
                onClick={() => handleQuickLogin('AGENCY_ADMIN')}
                className="flex items-center justify-between p-3.5 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 to-slate-900/80 hover:border-purple-400 hover:from-purple-950/60 text-left transition-all group shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30 group-hover:scale-105 group-hover:bg-purple-500/30 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Agency Operations & Compliance Director
                    </div>
                    <div className="text-[11px] text-slate-400">
                      MediOracle HQ • Gross margins & emergency regional broadcast
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Or sign in with username</span>
            </div>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / NMBI PIN
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="e.g. nurse_aoife"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in to portal...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-cyan-200" />
                  <span>Sign In to MediOracle</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Django 4.2 REST & React</span>
            <span className="flex items-center text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> NMBI & HSE Compliant
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
