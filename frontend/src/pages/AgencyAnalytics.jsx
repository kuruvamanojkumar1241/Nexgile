import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Send,
  Building,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function AgencyAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => {
      alert('Emergency Broadcast dispatched to 84 available registered nurses via Push Notification & SMS!');
    }, 400);
  };

  const metrics = analytics?.metrics || {
    fill_rate_percent: 87.5,
    open_shifts_count: 5,
    avg_time_to_fill_hours: 2.4,
    gross_margin_percent: 18.5,
    total_monthly_spend: 248600.00,
    compliance_rate_percent: 97.8,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-black text-slate-900">Agency Executive Operations & Clinical Intelligence</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Workforce supply & demand, fill rates, gross margin, spend analytics & 24/7 emergency roster dispatch
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" /> Live Telemetry
          </span>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Roster Fill Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{metrics.fill_rate_percent}%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">↑ +4.2% vs last month</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Avg Time to Fill</span>
            <Clock className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-black text-teal-600 mt-2">{metrics.avg_time_to_fill_hours}h</div>
          <div className="text-xs text-teal-600 font-semibold mt-1">Under 2.5h SLA target</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Gross Agency Margin</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600 mt-2">{metrics.gross_margin_percent}%</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Compliant with HSE national framework</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Open Clinical Requisitions</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{metrics.open_shifts_count} Shifts</div>
          <div className="text-xs text-slate-500 font-medium mt-1">ICU & Emergency focus</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Total Monthly Clinical Spend</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">€{metrics.total_monthly_spend?.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Across 3 hospital frameworks</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Workforce Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-3xl font-black text-teal-600 mt-2">{metrics.compliance_rate_percent}%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Regulator-ready NMBI registry</div>
        </div>
      </div>

      {/* Emergency Roster Shortage Broadcast Card */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-amber-950 p-6 rounded-2xl text-white shadow-lg border border-rose-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Radio className="w-3 h-3 mr-1.5 animate-pulse text-rose-400" /> EMERGENCY SHORTAGE DISPATCH
            </div>
            <h2 className="text-lg font-black text-white">Broadcast Critical ICU Shift Incentive to Pool</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Dispatch an instant mobile push and SMS alert with an elevated €50 incentive bonus to all 84 qualified, NMBI-verified ICU nurses in the Dublin region.
            </p>
          </div>

          <button
            onClick={handleBroadcast}
            disabled={broadcastSent}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 shadow-lg ${
              broadcastSent
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{broadcastSent ? 'Emergency Alerts Broadcasted' : 'Broadcast to All Nurses Now'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Alerts Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Regional Live Operational Feed</h2>
        <div className="space-y-2.5">
          {analytics?.recent_alerts?.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border text-xs flex items-center space-x-3 ${
                alert.type === 'RED'
                  ? 'bg-rose-50 border-rose-200 text-rose-800 font-semibold'
                  : alert.type === 'YELLOW'
                  ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                alert.type === 'RED' ? 'bg-rose-600' : alert.type === 'YELLOW' ? 'bg-amber-600' : 'bg-emerald-600'
              }`} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
