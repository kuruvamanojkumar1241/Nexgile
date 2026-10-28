import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Users, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Calendar,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { api } from '../api';

export default function FacilityDashboard({ onSelectShiftForAI }) {
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Shift form state
  const [newShift, setNewShift] = useState({
    facility_id: 1,
    title: 'ICU Weekend Day Shift - Critical Care Staff Nurse',
    role_required: 'Registered General Nurse (RGN)',
    specialty_required: 'Critical Care & ICU',
    shift_date: new Date().toISOString().split('T')[0],
    start_time: '07:30',
    end_time: '19:30',
    duration_hours: 11.5,
    hourly_rate: 46.00,
    incentive_bonus: 50.00,
    acuity: 'Critical (Ventilator & Inotrope Support)',
    required_credentials: 'NMBI Active, Garda Vetting, ACLS Certified'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptData, shiftData] = await Promise.all([
        api.getDepartments(),
        api.getShifts()
      ]);
      setDepartments(deptData);
      setShifts(shiftData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      await api.createShift(newShift);
      setShowCreateModal(false);
      fetchData();
    } catch (err) {
      alert('Error creating shift: ' + err.message);
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'RED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" /> Critical Shortage
          </span>
        );
      case 'YELLOW':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Deficit Alert
          </span>
        );
      case 'GREEN':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Optimal Staffing
          </span>
        );
    }
  };

  const getShiftStatusBadge = (status) => {
    switch (status) {
      case 'POSTED':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">Open / Seeking</span>;
      case 'CONFIRMED':
        return <span className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5 rounded font-semibold">Confirmed</span>;
      case 'IN_PROGRESS':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-semibold animate-pulse">Active (Clocked In)</span>;
      case 'COMPLETED':
        return <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-semibold">Completed</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl font-black text-slate-900">Hospital Floor & Staffing Command</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ward census, nurse-to-patient ratios, shortage alerts & roster automation
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post Urgent Ward Shift</span>
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Required Ward Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1">40 Nurses</div>
          <div className="text-xs text-slate-500 mt-1">Across 3 Acute Units</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Confirmed on Floor</div>
          <div className="text-2xl font-black text-teal-600 mt-1">35 Active</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">87.5% Roster Coverage</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Shortage Gap</div>
          <div className="text-2xl font-black text-rose-600 mt-1">5 Shifts Open</div>
          <div className="text-xs text-rose-600 font-medium mt-1">ICU Level 2 Critical Deficit</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Monthly Agency Spend</div>
          <div className="text-2xl font-black text-slate-900 mt-1">€166,400</div>
          <div className="text-xs text-slate-500 mt-1">Budget utilization 78.4%</div>
        </div>
      </div>

      {/* Ward Staffing & Shortage Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Ward & Floor Acuity Breakdown</h2>
          <span className="text-xs text-slate-400">Refreshed live from HSE hospital census</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-6 font-bold">Facility & Department</th>
                <th className="py-3 px-6 font-bold">Floor / Location</th>
                <th className="py-3 px-6 font-bold text-center">Required</th>
                <th className="py-3 px-6 font-bold text-center">Confirmed</th>
                <th className="py-3 px-6 font-bold">Roster Fill %</th>
                <th className="py-3 px-6 font-bold">Risk Level</th>
                <th className="py-3 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{dept.name}</div>
                    <div className="text-slate-400 text-[11px]">{dept.facility_name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{dept.floor}</span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-slate-800">{dept.required_staffing}</td>
                  <td className="py-4 px-6 text-center font-bold text-teal-600">{dept.confirmed_staffing}</td>
                  <td className="py-4 px-6">
                    <div className="w-32">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span>{dept.fill_rate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full ${
                            dept.fill_rate >= 90 ? 'bg-emerald-500' : dept.fill_rate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(dept.fill_rate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getRiskBadge(dept.risk_level)}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold border border-teal-200 transition-colors"
                    >
                      Fill Deficit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Shift Postings & Lifecycle */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Shift Postings & Live Execution Lifecycle</h2>
            <p className="text-xs text-slate-400">Postings, offers, GPS clock events and confirmations</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {shifts.map((shift) => (
            <div key={shift.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">{shift.title}</span>
                  {getShiftStatusBadge(shift.status)}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center text-slate-600">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> {shift.facility_name} ({shift.department_name})
                  </span>
                  <span className="flex items-center text-slate-600">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" /> {shift.shift_date} • {shift.start_time} - {shift.end_time}
                  </span>
                  <span className="flex items-center text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                    €{shift.hourly_rate}/hr {shift.incentive_bonus > 0 ? `+ €${shift.incentive_bonus} bonus` : ''}
                  </span>
                  {shift.assigned_professional_name && (
                    <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded">
                      Assigned: {shift.assigned_professional_name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {shift.status === 'POSTED' && (
                  <button
                    onClick={() => onSelectShiftForAI(shift.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Match Candidates</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Create Shift */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-900">Create Urgent Healthcare Shift</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">×</button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Shift Title</label>
                <input
                  type="text"
                  required
                  value={newShift.title}
                  onChange={(e) => setNewShift({...newShift, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Required</label>
                  <select
                    value={newShift.role_required}
                    onChange={(e) => setNewShift({...newShift, role_required: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  >
                    <option>Registered General Nurse (RGN)</option>
                    <option>Health Care Assistant (HCA)</option>
                    <option>Clinical Nurse Specialist (CNS)</option>
                    <option>Midwife</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialty / Acuity</label>
                  <input
                    type="text"
                    value={newShift.specialty_required}
                    onChange={(e) => setNewShift({...newShift, specialty_required: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Shift Date</label>
                  <input
                    type="date"
                    required
                    value={newShift.shift_date}
                    onChange={(e) => setNewShift({...newShift, shift_date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newShift.start_time}
                    onChange={(e) => setNewShift({...newShift, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newShift.end_time}
                    onChange={(e) => setNewShift({...newShift, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Hourly Rate (€)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newShift.hourly_rate}
                    onChange={(e) => setNewShift({...newShift, hourly_rate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Incentive Bonus (€)</label>
                  <input
                    type="number"
                    step="5"
                    value={newShift.incentive_bonus}
                    onChange={(e) => setNewShift({...newShift, incentive_bonus: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-md"
                >
                  Publish to MediOracle Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
