import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Award, 
  TrendingUp, 
  Building2, 
  UserCheck, 
  Send,
  Sliders,
  DollarSign
} from 'lucide-react';
import { api } from '../api';

export default function AIMatchingView({ selectedShiftId }) {
  const [matchData, setMatchData] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [activeShiftId, setActiveShiftId] = useState(selectedShiftId || null);
  const [loading, setLoading] = useState(true);
  const [assignedMessage, setAssignedMessage] = useState('');

  const loadData = async (shiftId) => {
    try {
      setLoading(true);
      const [shiftsList, aiResult] = await Promise.all([
        api.getShifts(),
        api.getAIMatch(shiftId)
      ]);
      setShifts(shiftsList);
      setMatchData(aiResult);
      if (!activeShiftId && aiResult.shift) {
        setActiveShiftId(aiResult.shift.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedShiftId);
  }, [selectedShiftId]);

  const handleShiftChange = (e) => {
    const sId = e.target.value;
    setActiveShiftId(sId);
    loadData(sId);
  };

  const handleAssignCandidate = async (candidate) => {
    if (!matchData?.shift?.id) return;
    try {
      const res = await api.shiftAction(matchData.shift.id, 'apply', { professional_id: candidate.professional_id });
      setAssignedMessage(`AI Match Confirmed: ${candidate.full_name} assigned with ${candidate.match_score}% confidence score!`);
      loadData(matchData.shift.id);
      setTimeout(() => setAssignedMessage(''), 5000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 p-6 rounded-2xl text-white shadow-md border border-indigo-900/50">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-500 text-white rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black">AI Workforce Match & Shift Allocation</h1>
          </div>
          <p className="text-xs text-indigo-200 mt-1">
            Algorithmic ranking by distance, NMBI active credentials, ward acuity fit & WTD rest rules
          </p>
        </div>

        {/* Shift selector dropdown */}
        <div className="flex items-center space-x-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
          <span className="text-xs text-slate-300 font-medium pl-2">Evaluating:</span>
          <select
            value={activeShiftId || ''}
            onChange={handleShiftChange}
            className="bg-slate-800 text-white text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none"
          >
            {shifts.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id}: {s.title} ({s.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {assignedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
          <span>{assignedMessage}</span>
        </div>
      )}

      {/* Evaluated Shift Card + AI Demand Forecast */}
      {matchData?.shift && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Active Requisition Target
              </span>
              <span className="text-xs font-bold text-slate-500">Shift ID #{matchData.shift.id}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">{matchData.shift.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
              <div><span className="text-slate-400">Hospital:</span> {matchData.shift.facility_name}</div>
              <div><span className="text-slate-400">Ward:</span> {matchData.shift.department_name}</div>
              <div><span className="text-slate-400">Date:</span> {matchData.shift.shift_date}</div>
              <div><span className="text-slate-400">Hours:</span> {matchData.shift.start_time} - {matchData.shift.end_time}</div>
              <div><span className="text-slate-400">Rate:</span> €{matchData.shift.hourly_rate}/hr</div>
              <div><span className="text-slate-400">Bonus:</span> €{matchData.shift.incentive_bonus}</div>
            </div>
          </div>

          {/* Demand forecast widget */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-indigo-300">
              <span className="font-bold flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1 text-teal-400" /> AI Demand Forecast
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded">High Probability</span>
            </div>
            <div className="text-2xl font-black text-white">~1.8 Hours</div>
            <div className="text-xs text-indigo-200">Predicted time-to-fill with current incentive</div>
            <div className="pt-2 border-t border-indigo-900 text-[11px] text-slate-300 space-y-1">
              <div>• Supply: 4 verified specialist candidates within 12km</div>
              <div>• Recommended bonus rate: €45 - €50</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Ranked Candidate Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ranked Clinical Candidates</h2>
            <p className="text-xs text-slate-400">
              Confidence scores calculated using multi-criteria weighted intelligence
            </p>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {matchData?.candidates_ranked?.length || 0} Candidates Analyzed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {matchData?.candidates_ranked?.map((candidate, idx) => (
            <div key={candidate.professional_id} className="p-6 hover:bg-slate-50/70 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm ${
                    idx === 0 ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-slate-900">{candidate.full_name}</span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        NMBI: {candidate.nmbi_pin}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {candidate.role_type} • {candidate.specialty}
                    </div>
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-semibold">Confidence Score</div>
                    <div className="flex items-center justify-end space-x-1">
                      <span className={`text-xl font-black ${
                        candidate.match_score >= 90 ? 'text-emerald-600' : candidate.match_score >= 80 ? 'text-indigo-600' : 'text-amber-600'
                      }`}>
                        {candidate.match_score}%
                      </span>
                      <span className="text-xs text-slate-400">Match</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAssignCandidate(candidate)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Direct Offer</span>
                  </button>
                </div>
              </div>

              {/* Decisive Factors Tags */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Decisive Algorithmic Factors
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.decisive_factors?.map((factor, fIdx) => (
                    <span 
                      key={fIdx}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs"
                    >
                      ✓ {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
                <span>📍 Commute: <strong className="text-slate-800">{candidate.distance_km} km</strong></span>
                <span>⭐ Rating: <strong className="text-slate-800">{candidate.rating} / 5.0</strong></span>
                <span>📋 Historical Shifts: <strong className="text-slate-800">{candidate.shifts_completed} completed</strong></span>
                <span>💰 Rate: <strong className="text-slate-800">€{candidate.hourly_rate}/hr</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
