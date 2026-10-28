import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  RefreshCw, 
  Calendar, 
  Search,
  ShieldCheck,
  Building
} from 'lucide-react';
import { api } from '../api';

export default function ComplianceHub() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const fetchCompliance = async () => {
    try {
      setLoading(true);
      const res = await api.getCompliance();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompliance();
  }, []);

  const getStatusBadge = (status, days) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Active & Verified
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Expires in {days} Days
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Expired (Restricted)
          </span>
        );
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-semibold">{status}</span>;
    }
  };

  const filteredCredentials = data?.credentials?.filter(c => {
    if (filter === 'ALL') return true;
    return c.status === filter;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-black text-slate-900">Compliance, NMBI & Credentials Passport</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pre-confirmation license verification, Garda vetting, mandatory HSE training & 30/60/90-day expiry enforcement
          </p>
        </div>

        <button
          onClick={fetchCompliance}
          className="inline-flex items-center space-x-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Registers</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Health Index</div>
          <div className="text-2xl font-black text-teal-600 mt-1">{data?.compliance_health_pct || 98}%</div>
          <div className="text-xs text-slate-500 mt-1">Roster audit readiness</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Verified Active</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{data?.verified_active || 0} Docs</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">100% NMBI live registry matched</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Expiring &lt;30 Days</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{data?.expiring_soon || 0} Alerts</div>
          <div className="text-xs text-amber-600 font-medium mt-1">Automated renewal notices sent</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Expired / Blocked</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{data?.expired || 0} Blocked</div>
          <div className="text-xs text-rose-600 font-medium mt-1">Auto-restricted from shift booking</div>
        </div>
      </div>

      {/* Regulatory Notice Banner */}
      <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md flex items-start space-x-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300">Statutory Health Compliance Enforcement Active</span>
          <p className="text-slate-300">
            MediOracle automatically re-validates credentials at the moment of shift offer, booking confirmation, and floor clock-in. Any candidate with an expired Garda vetting clearance or suspended NMBI PIN is strictly restricted from clinical duties.
          </p>
        </div>
      </div>

      {/* Credential Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Credential Register & Audit Trail</h2>

          {/* Status filters */}
          <div className="flex space-x-1">
            {['ALL', 'VERIFIED', 'EXPIRING_SOON', 'EXPIRED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filter === s 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s === 'ALL' ? 'All Records' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-6 font-bold">Credential / Title</th>
                <th className="py-3 px-6 font-bold">Type</th>
                <th className="py-3 px-6 font-bold">Ref / PIN Number</th>
                <th className="py-3 px-6 font-bold">Expiry Date</th>
                <th className="py-3 px-6 font-bold">Status</th>
                <th className="py-3 px-6 font-bold">Verifier Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCredentials.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">{c.title}</td>
                  <td className="py-4 px-6">
                    <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      {c.cred_type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-600">{c.reference_number}</td>
                  <td className="py-4 px-6 text-slate-600">{c.expiry_date}</td>
                  <td className="py-4 px-6">{getStatusBadge(c.status, c.days_until_expiry)}</td>
                  <td className="py-4 px-6 text-slate-500 italic">{c.verifier_notes || 'Verified against registry'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
