const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  getFacilities: async () => {
    const res = await fetch(`${API_BASE}/facilities/`);
    return res.json();
  },

  getDepartments: async () => {
    const res = await fetch(`${API_BASE}/departments/`);
    return res.json();
  },

  getProfessionals: async () => {
    const res = await fetch(`${API_BASE}/professionals/`);
    return res.json();
  },

  getShifts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/shifts/${query ? `?${query}` : ''}`);
    return res.json();
  },

  createShift: async (shiftData) => {
    const res = await fetch(`${API_BASE}/shifts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shiftData)
    });
    return res.json();
  },

  shiftAction: async (shiftId, action, body = {}) => {
    const res = await fetch(`${API_BASE}/shifts/${shiftId}/${action}/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return res.json();
  },

  getAIMatch: async (shiftId) => {
    const url = shiftId ? `${API_BASE}/match/?shift_id=${shiftId}` : `${API_BASE}/match/`;
    const res = await fetch(url);
    return res.json();
  },

  getCompliance: async () => {
    const res = await fetch(`${API_BASE}/compliance/`);
    return res.json();
  },

  getTimesheets: async () => {
    const res = await fetch(`${API_BASE}/timesheets/`);
    return res.json();
  },

  approveTimesheet: async (timesheetId, signature) => {
    const res = await fetch(`${API_BASE}/timesheets/${timesheetId}/approve/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manager_signature: signature })
    });
    return res.json();
  },

  getInvoices: async () => {
    const res = await fetch(`${API_BASE}/invoices/`);
    return res.json();
  },

  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics/`);
    return res.json();
  }
};
