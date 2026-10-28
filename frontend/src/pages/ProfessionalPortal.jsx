import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  Navigation, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Award,
  Calendar
} from 'lucide-react';
import { api } from '../api';

export default function ProfessionalPortal() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [instantPayClaimed, setInstantPayClaimed] = useState(false);
  const [message, setMessage] = useState('');

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const data = await api.getShifts();
      setShifts(data);
      // Check if any shift is currently in progress or confirmed
      const inProg = data.find(s => s.status === 'IN_PROGRESS');
      const conf = data.find(s => s.status === 'CONFIRMED');
      if (inProg) {
        setActiveShift(inProg);
        setClockedIn(true);
      } else if (conf) {
        setActiveShift(conf);
        setClockedIn(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleApply = async (shiftId) => {
    try {
      const res = await api.shiftAction(shiftId, 'apply', { professional_id: 1 });
      setMessage(res.message);
      fetchShifts();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClockIn = async () => {
    if (!activeShift) return;
    try {
      const res = await api.shiftAction(activeShift.id, 'clock_in');
      setClockedIn(true);
      setClockTime(new Date().toLocaleTimeString());
      setMessage(res.message);
      fetchShifts();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClockOut = async () => {
    if (!activeShift) return;
    try {
      const res = await api.shiftAction(activeShift.id, 'clock_out');
      setClockedIn(false);
      setMessage(res.message);
      fetchShifts();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleInstantPay = () => {
    setInstantPayClaimed(true);
    setTimeout(() => {
      alert('Instant Pay Request approved! €590.00 routed to Bank of Ireland via SEPA Instant.');
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Alert toast */}
      {message && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-xl text-xs font-semibold flex items-center shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Professional Profile & Verified Passport */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-sky-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              AM
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900">Aoife Murphy, RGN</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center">
                  <ShieldCheck className="w-3 h-3 mr-1" /> NMBI Verified (#948201)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical Nurse Specialist • Critical Care & Intensive Care (ICU)
              </p>
              <div className="flex items-center space-x-3 mt-2 text-xs text-slate-600">
                <span className="flex items-center font-semibold text-amber-500">
                  ★ 4.95 (82 shifts)
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-600">99% Reliability Score</span>
                <span>•</span>
                <span className="text-slate-500">Dublin 4 • Dublin Area Commute Zone</span>
              </div>
            </div>
          </div>

          {/* Instant Pay Wallet Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-xl shadow-md min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Earned Balance</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.5 rounded flex items-center">
                <Zap className="w-3 h-3 mr-1 text-teal-400" /> Instant Pay Eligible
              </span>
            </div>
            <div className="text-2xl font-black text-white mt-1">€590.00</div>
            <div className="text-[11px] text-slate-400 mb-2">From shift completed yesterday</div>
            <button
              onClick={handleInstantPay}
              disabled={instantPayClaimed}
              className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                instantPayClaimed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{instantPayClaimed ? 'Funds Dispatched' : 'Cash Out to Bank Instant'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Geofence Shift Execution Card */}
      {activeShift && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-2xl p-6 shadow-xl border border-teal-800/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Navigation className="w-3 h-3 mr-1 animate-pulse text-teal-400" /> 
                {clockedIn ? 'SHIFT ACTIVE • GEOFENCE VERIFIED' : 'UPCOMING BOOKED SHIFT'}
              </div>
              <h2 className="text-lg font-black text-white">{activeShift.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-teal-400" /> {activeShift.facility_name} ({activeShift.department_name})
                </span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-teal-400" /> {activeShift.shift_date} • {activeShift.start_time} - {activeShift.end_time}
                </span>
                <span className="text-teal-300 font-bold">
                  €{activeShift.hourly_rate}/hr + €{activeShift.incentive_bonus} Bonus
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!clockedIn ? (
                <button
                  onClick={handleClockIn}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GPS Geofence Clock-In</span>
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Clock-Out & Submit Timesheet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Available Shifts Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recommended Shifts Matching Your Credentials</h2>
            <p className="text-xs text-slate-400">Sorted by distance, NMBI specialty fit & premium bonus rates</p>
          </div>
          <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-lg">
            3 High-Priority Shifts
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {shifts.map((shift) => (
            <div key={shift.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900">{shift.title}</span>
                  <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {shift.acuity}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center text-slate-700 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {shift.facility_name} • {shift.facility_city} (3.4 km commute)
                  </span>
                  <span className="flex items-center text-slate-600">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {shift.shift_date} ({shift.start_time} - {shift.end_time})
                  </span>
                  <span className="text-teal-700 font-extrabold bg-teal-50 px-2.5 py-0.5 rounded">
                    €{shift.hourly_rate}/hr {shift.incentive_bonus > 0 ? `+ €${shift.incentive_bonus} bonus` : ''}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Required: {shift.required_credentials}
                </div>
              </div>

              <div>
                {shift.status === 'POSTED' ? (
                  <button
                    onClick={() => handleApply(shift.id)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    1-Click Confirm & Book
                  </button>
                ) : shift.status === 'CONFIRMED' ? (
                  <span className="text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-200">
                    Booked to You
                  </span>
                ) : shift.status === 'IN_PROGRESS' ? (
                  <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 animate-pulse">
                    Currently Clocked In
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs font-medium">
                    {shift.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
