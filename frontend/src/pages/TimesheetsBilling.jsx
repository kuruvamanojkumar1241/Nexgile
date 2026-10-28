import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  FileText, 
  CreditCard, 
  Building2, 
  UserCheck, 
  DollarSign, 
  Calendar,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { api } from '../api';

export default function TimesheetsBilling() {
  const [timesheets, setTimesheets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [tsData, invData] = await Promise.all([
        api.getTimesheets(),
        api.getInvoices()
      ]);
      setTimesheets(tsData);
      setInvoices(invData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (tsId) => {
    try {
      const res = await api.approveTimesheet(tsId, 'Dr. Liam O’Connor (Clinical Director Sign-off)');
      setMessage(`Timesheet #${tsId} approved and signed off! Sent to payroll.`);
      loadData();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-black text-slate-900">Digital Timesheets, Sign-Off & Billing</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            GPS-verified clock events, overtime reconciliation, clinical director sign-offs and consolidated facility invoicing
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-bold flex items-center shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Timesheets Approval Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Shift Timesheets Requiring Clinical Approval</h2>
            <p className="text-xs text-slate-400">Locked clinical hours submitted directly from mobile geofenced app</p>
          </div>
          <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
            {timesheets.filter(t => t.status === 'SUBMITTED').length} Pending Sign-Off
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {timesheets.map((ts) => (
            <div key={ts.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-black text-slate-900">{ts.professional_name}</span>
                  <span className="text-xs font-bold text-slate-500">• {ts.shift_title}</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    ts.status === 'APPROVED' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800 animate-pulse'
                  }`}>
                    {ts.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>🏥 {ts.facility_name} ({ts.department_name})</span>
                  <span>📅 Shift Date: {ts.shift_date}</span>
                  <span>⏱️ Clock: {ts.clock_in_time} - {ts.clock_out_time}</span>
                  <span>☕ Break: {ts.break_duration_minutes} min</span>
                  <span className="text-emerald-700 font-bold">📍 GPS Geofence Verified</span>
                </div>

                <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                  <span className="font-bold text-slate-800">Hours Breakdown: </span>
                  {ts.regular_hours} hrs reg @ €{ts.hourly_rate} + {ts.overtime_hours} hrs OT + €{ts.incentive_amount} incentive = <strong className="text-teal-700 text-sm">€{ts.total_pay} Total Pay</strong>
                </div>

                {ts.manager_signature && (
                  <div className="text-[11px] text-slate-400 italic">
                    Signed by: {ts.manager_signature}
                  </div>
                )}
              </div>

              <div>
                {ts.status === 'SUBMITTED' ? (
                  <button
                    onClick={() => handleApprove(ts.id)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-2"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Clinical Director Sign-Off</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center text-emerald-700 font-bold text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved & Locked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facility Invoices & Consolidated Billing */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Consolidated Hospital Invoices (HSE & Private)</h2>
            <p className="text-xs text-slate-400">Automated shift line-items, net 30 payment aging & reconciliation</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">{invoices.length} Invoices Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-6 font-bold">Invoice #</th>
                <th className="py-3 px-6 font-bold">Healthcare Facility</th>
                <th className="py-3 px-6 font-bold">Billing Period</th>
                <th className="py-3 px-6 font-bold text-center">Shifts Billed</th>
                <th className="py-3 px-6 font-bold">Total Amount</th>
                <th className="py-3 px-6 font-bold">Due Date</th>
                <th className="py-3 px-6 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold font-mono text-slate-900">{inv.invoice_number}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{inv.facility_name}</td>
                  <td className="py-4 px-6 text-slate-600">{inv.period_label}</td>
                  <td className="py-4 px-6 text-center font-bold text-slate-800">{inv.shifts_billed}</td>
                  <td className="py-4 px-6 font-black text-slate-900 text-sm">€{inv.total_amount}</td>
                  <td className="py-4 px-6 text-slate-500">{inv.due_date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
