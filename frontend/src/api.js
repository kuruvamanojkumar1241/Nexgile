const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  login: async (credentials) => {
    // 1. Try real backend
    try {
      return await safeFetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
    } catch (err) {
      console.info('[MediOracle] Backend unreachable, using seamless Demo Mode login.');
      // 2. Demo fallback
      if (credentials.role) {
        const found = Object.values(INITIAL_USERS).find(u => u.role === credentials.role);
        if (found) return found;
      }
      if (credentials.username && INITIAL_USERS[credentials.username]) {
        return INITIAL_USERS[credentials.username];
      }
      return INITIAL_USERS.facility_manager;
    }
  },

  getFacilities: async () => {
    try {
      return await safeFetch(`${API_BASE}/facilities/`);
    } catch (e) {
      return INITIAL_FACILITIES;
    }
  },

  getDepartments: async () => {
    try {
      return await safeFetch(`${API_BASE}/departments/`);
    } catch (e) {
      return INITIAL_DEPARTMENTS;
    }
  },

  getProfessionals: async () => {
    try {
      return await safeFetch(`${API_BASE}/professionals/`);
    } catch (e) {
      return INITIAL_PROFESSIONALS;
    }
  },

  getShifts: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      return await safeFetch(`${API_BASE}/shifts/${query ? `?${query}` : ''}`);
    } catch (e) {
      const shifts = getStorage('shifts', INITIAL_SHIFTS);
      if (params.status) {
        return shifts.filter(s => s.status === params.status);
      }
      return shifts;
    }
  },

  createShift: async (shiftData) => {
    try {
      return await safeFetch(`${API_BASE}/shifts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftData)
      });
    } catch (e) {
      const shifts = getStorage('shifts', INITIAL_SHIFTS);
      const newShift = {
        id: Date.now(),
        facility_name: "St. Vincent's University Hospital",
        department_name: "Intensive Care Unit (ICU)",
        facility_city: "Dublin",
        status: "POSTED",
        assigned_professional: null,
        assigned_professional_name: null,
        ...shiftData
      };
      const updated = [newShift, ...shifts];
      setStorage('shifts', updated);
      return newShift;
    }
  },

  shiftAction: async (shiftId, action, body = {}) => {
    try {
      return await safeFetch(`${API_BASE}/shifts/${shiftId}/${action}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e) {
      const shifts = getStorage('shifts', INITIAL_SHIFTS);
      const timesheets = getStorage('timesheets', INITIAL_TIMESHEETS);
      const target = shifts.find(s => s.id == shiftId);

      if (action === 'apply') {
        if (target) {
          target.status = 'CONFIRMED';
          target.assigned_professional = body.professional_id || 1;
          target.assigned_professional_name = "Aoife Murphy";
          setStorage('shifts', [...shifts]);
        }
        return { message: "Shift confirmed & booked! Ready for GPS clock-in.", shift: target };
      }

      if (action === 'clock_in') {
        if (target) {
          target.status = 'IN_PROGRESS';
          setStorage('shifts', [...shifts]);

          const newTs = {
            id: Date.now(),
            shift: target.id,
            shift_title: target.title,
            facility_name: target.facility_name,
            department_name: target.department_name,
            professional: 1,
            professional_name: "Aoife Murphy",
            shift_date: new Date().toISOString().split('T')[0],
            clock_in_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            clock_out_time: "--:--",
            regular_hours: target.duration_hours || 11.5,
            hourly_rate: target.hourly_rate || 45.0,
            incentive_amount: target.incentive_bonus || 0,
            total_pay: (target.duration_hours * target.hourly_rate) + (target.incentive_bonus || 0),
            gps_verified: true,
            status: "SUBMITTED"
          };
          setStorage('timesheets', [newTs, ...timesheets]);
        }
        return { message: "Successfully clocked in via GPS geofence!", shift: target };
      }

      if (action === 'clock_out') {
        if (target) {
          target.status = 'COMPLETED';
          setStorage('shifts', [...shifts]);
        }
        return { message: "Shift completed! Timesheet submitted for manager sign-off.", shift: target };
      }

      return { message: "Action processed successfully", shift: target };
    }
  },

  getAIMatch: async (shiftId) => {
    try {
      const url = shiftId ? `${API_BASE}/match/?shift_id=${shiftId}` : `${API_BASE}/match/`;
      return await safeFetch(url);
    } catch (e) {
      const shifts = getStorage('shifts', INITIAL_SHIFTS);
      const shift = (shiftId ? shifts.find(s => s.id == shiftId) : null) || shifts[0];
      return {
        shift: shift,
        candidates_ranked: [
          {
            professional: INITIAL_PROFESSIONALS[0],
            match_score: 96,
            confidence_tier: "EXCEPTIONAL",
            distance_km: 2.1,
            commute_estimate_minutes: 12,
            decisive_factors: [
              "Direct specialty match in Critical Care & ICU",
              "Active NMBI PIN verified & clean Garda vetting clearance",
              "Immediate proximity (2.1 km commute)",
              "Outstanding reliability (99% on-time check-in across 82 shifts)"
            ],
            compliance_check_passed: true,
            rest_period_compliant: true,
            hourly_rate: 45.0
          },
          {
            professional: INITIAL_PROFESSIONALS[1],
            match_score: 87,
            confidence_tier: "HIGH",
            distance_km: 3.8,
            commute_estimate_minutes: 18,
            decisive_factors: [
              "Role match (Registered General Nurse) with transferable clinical skills",
              "Active NMBI PIN verified & clean Garda vetting clearance",
              "Short commute zone (3.8 km)",
              "High reliability rating (96% across 58 shifts)"
            ],
            compliance_check_passed: true,
            rest_period_compliant: true,
            hourly_rate: 44.0
          },
          {
            professional: INITIAL_PROFESSIONALS[3],
            match_score: 72,
            confidence_tier: "MODERATE",
            distance_km: 5.4,
            commute_estimate_minutes: 25,
            decisive_factors: [
              "Allied clinical specialty (Midwifery & Postnatal)",
              "Active NMBI license verified",
              "Reliability score 93%"
            ],
            compliance_check_passed: true,
            rest_period_compliant: true,
            hourly_rate: 48.0
          }
        ],
        total_qualified: 3,
        demand_forecast: {
          predicted_fill_hours: 1.8,
          recommended_incentive: 45.0,
          absence_risk: "Low (Under 3% historical call-off on this ward)",
          market_supply_state: "Sufficient Specialist Coverage Available"
        }
      };
    }
  },

  getCompliance: async () => {
    try {
      return await safeFetch(`${API_BASE}/compliance/`);
    } catch (e) {
      return {
        total_credentials: 5,
        verified_active: 3,
        expiring_soon: 1,
        expired: 1,
        compliance_health_pct: 80.0,
        credentials: [
          {
            id: 1,
            professional: 1,
            professional_name: "Aoife Murphy",
            cred_type: "NMBI",
            title: "NMBI Registered Nurse License (General & Critical Care)",
            reference_number: "NMBI-2026-948201",
            issue_date: "2025-05-10",
            expiry_date: "2026-12-31",
            days_until_expiry: 65,
            status: "VERIFIED",
            verifier_notes: "Validated against NMBI live electronic register"
          },
          {
            id: 2,
            professional: 1,
            professional_name: "Aoife Murphy",
            cred_type: "GARDA",
            title: "National Vetting Bureau Clearance Certificate",
            reference_number: "NVB-REF-2026-883",
            issue_date: "2025-08-15",
            expiry_date: "2027-04-15",
            days_until_expiry: 165,
            status: "VERIFIED",
            verifier_notes: "Clear police vetting issued"
          },
          {
            id: 3,
            professional: 1,
            professional_name: "Aoife Murphy",
            cred_type: "BLS_ACLS",
            title: "Advanced Cardiovascular Life Support (ACLS - AHA/IHF)",
            reference_number: "ACLS-9941-CERT",
            issue_date: "2025-09-01",
            expiry_date: "2026-11-26",
            days_until_expiry: 22,
            status: "EXPIRING_SOON",
            verifier_notes: "Refresher course booked with Irish Heart Foundation"
          },
          {
            id: 4,
            professional: 2,
            professional_name: "Sean O'Connor",
            cred_type: "NMBI",
            title: "NMBI Registered General Nurse (Emergency)",
            reference_number: "NMBI-2026-820194",
            issue_date: "2025-02-12",
            expiry_date: "2027-03-20",
            days_until_expiry: 140,
            status: "VERIFIED",
            verifier_notes: "Good standing confirmed"
          },
          {
            id: 5,
            professional: 2,
            professional_name: "Sean O'Connor",
            cred_type: "GARDA",
            title: "National Vetting Bureau Clearance",
            reference_number: "NVB-REF-2026-112",
            issue_date: "2024-01-10",
            expiry_date: "2026-10-30",
            days_until_expiry: -5,
            status: "EXPIRED",
            verifier_notes: "Renewal application pending processing"
          }
        ]
      };
    }
  },

  getTimesheets: async () => {
    try {
      return await safeFetch(`${API_BASE}/timesheets/`);
    } catch (e) {
      return getStorage('timesheets', INITIAL_TIMESHEETS);
    }
  },

  approveTimesheet: async (timesheetId, signature) => {
    try {
      return await safeFetch(`${API_BASE}/timesheets/${timesheetId}/approve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manager_signature: signature })
      });
    } catch (e) {
      const timesheets = getStorage('timesheets', INITIAL_TIMESHEETS);
      const ts = timesheets.find(t => t.id == timesheetId);
      if (ts) {
        ts.status = 'APPROVED';
        ts.manager_signature = signature || 'Clinical Director Sign-Off';
        setStorage('timesheets', [...timesheets]);
      }
      return { message: "Timesheet approved and locked for payroll!", timesheet: ts };
    }
  },

  getInvoices: async () => {
    try {
      return await safeFetch(`${API_BASE}/invoices/`);
    } catch (e) {
      return [
        {
          id: 1,
          facility: 1,
          facility_name: "St. Vincent's University Hospital",
          invoice_number: "INV-2026-0814",
          period_label: "August 2026 Shift Cycle A",
          total_amount: 28450.0,
          shifts_billed: 48,
          issue_date: "2026-08-15",
          due_date: "2026-09-15",
          status: "PENDING"
        },
        {
          id: 2,
          facility: 2,
          facility_name: "Mater Misericordiae University Hospital",
          invoice_number: "INV-2026-0792",
          period_label: "July 2026 Monthly Consolidated",
          total_amount: 36120.0,
          shifts_billed: 62,
          issue_date: "2026-07-31",
          due_date: "2026-08-30",
          status: "PAID"
        }
      ];
    }
  },

  getAnalytics: async () => {
    try {
      return await safeFetch(`${API_BASE}/analytics/`);
    } catch (e) {
      return {
        metrics: {
          fill_rate_percent: 84.6,
          open_shifts_count: 2,
          confirmed_shifts_count: 2,
          avg_time_to_fill_hours: 2.4,
          gross_margin_percent: 18.5,
          total_monthly_spend: 248600.0,
          active_nurses_and_professionals: 4,
          compliance_rate_percent: 97.8
        },
        recent_alerts: [
          { type: "RED", message: "Critical ICU deficit at St. Vincent's (Weekend Night Shift)" },
          { type: "YELLOW", message: "Garda Vetting renewal due within 14 days for 2 healthcare assistants" },
          { type: "GREEN", message: "Emergency Department morning shift 100% staffed with confirmed bookings" }
        ]
      };
    }
  }
};
