import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject JWT Auth Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chronilens_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback Mock Data Store
const mockStore = {
  user: { name: 'Alex Mercer', email: 'alex.mercer@health.ai' },
  token: 'mock-jwt-token-chronilens-demo',
  symptoms: [
    { _id: 's1', symptomName: 'Persistent Fatigue', severity: 7, notes: 'Feeling sluggish after 8hrs sleep', symptomDate: '2026-08-01T10:00:00Z', createdAt: '2026-08-01T10:00:00Z' },
    { _id: 's2', symptomName: 'Mild Brain Fog', severity: 5, notes: 'Difficulty concentrating in afternoon', symptomDate: '2026-08-03T14:30:00Z', createdAt: '2026-08-03T14:30:00Z' },
    { _id: 's3', symptomName: 'Persistent Fatigue', severity: 8, notes: 'Struggling with evening workouts', symptomDate: '2026-08-05T18:00:00Z', createdAt: '2026-08-05T18:00:00Z' },
    { _id: 's4', symptomName: 'Cold Sensitivity', severity: 6, notes: 'Hands and feet cold indoors', symptomDate: '2026-08-07T09:15:00Z', createdAt: '2026-08-07T09:15:00Z' }
  ],
  reports: [
    { _id: 'r1', fileName: 'Comprehensive_Blood_Panel_July.png', filePath: 'uploads/demo1.png', extractedText: 'Hemoglobin: 11.2 g/dL, TSH: 5.1 mIU/L, Blood Sugar: 95 mg/dL', hemoglobin: 11.2, tsh: 5.1, bloodSugar: 95, createdAt: '2026-07-25T11:00:00Z' },
    { _id: 'r2', fileName: 'Thyroid_Followup_August.png', filePath: 'uploads/demo2.png', extractedText: 'Hemoglobin: 10.8 g/dL, TSH: 5.4 mIU/L, Blood Sugar: 98 mg/dL', hemoglobin: 10.8, tsh: 5.4, bloodSugar: 98, createdAt: '2026-08-06T08:30:00Z' }
  ]
};

export const isDemoMode = () => localStorage.getItem('chronilens_demo') === 'true';

export const setDemoMode = (enabled) => {
  localStorage.setItem('chronilens_demo', enabled ? 'true' : 'false');
  if (enabled && !localStorage.getItem('chronilens_token')) {
    localStorage.setItem('chronilens_token', mockStore.token);
  }
};

// Authentication Services
export const authService = {
  register: async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return res.data;
    } catch (err) {
      if (isDemoMode() || !err.response) {
        return { success: true, message: 'User Registered Successfully (Demo Mode)' };
      }
      throw err.response?.data || { message: 'Registration failed' };
    }
  },
  login: async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.token) {
        localStorage.setItem('chronilens_token', res.data.token);
      }
      return res.data;
    } catch (err) {
      if (isDemoMode() || !err.response) {
        localStorage.setItem('chronilens_token', mockStore.token);
        return {
          success: true,
          message: 'Login Successful (Demo Mode)',
          token: mockStore.token
        };
      }
      throw err.response?.data || { message: 'Login failed' };
    }
  },
  logout: () => {
    localStorage.removeItem('chronilens_token');
  }
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    try {
      const res = await api.get('/dashboard');
      return res.data;
    } catch (err) {
      return {
        success: true,
        data: {
          symptoms: mockStore.symptoms.length,
          reports: mockStore.reports.length,
          timeline: mockStore.symptoms.length + mockStore.reports.length,
          aiInsights: 3
        }
      };
    }
  }
};

// Symptom Tracking Services
export const symptomService = {
  getSymptoms: async (search = '', page = 1, limit = 10) => {
    try {
      const res = await api.get(`/symptoms?search=${search}&page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      const filtered = mockStore.symptoms.filter(s => 
        s.symptomName.toLowerCase().includes(search.toLowerCase())
      );
      return {
        success: true,
        page: 1,
        limit: 10,
        total: filtered.length,
        totalPages: 1,
        count: filtered.length,
        data: filtered
      };
    }
  },
  addSymptom: async (symptomData) => {
    try {
      const res = await api.post('/symptoms', symptomData);
      return res.data;
    } catch (err) {
      const newSymptom = {
        _id: 's_' + Date.now(),
        ...symptomData,
        symptomDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      mockStore.symptoms.unshift(newSymptom);
      return { success: true, message: 'Symptom Added', symptom: newSymptom };
    }
  },
  updateSymptom: async (id, symptomData) => {
    try {
      const res = await api.put(`/symptoms/${id}`, symptomData);
      return res.data;
    } catch (err) {
      const index = mockStore.symptoms.findIndex(s => s._id === id);
      if (index !== -1) {
        mockStore.symptoms[index] = { ...mockStore.symptoms[index], ...symptomData };
      }
      return { success: true, message: 'Symptom Updated' };
    }
  },
  deleteSymptom: async (id) => {
    try {
      const res = await api.delete(`/symptoms/${id}`);
      return res.data;
    } catch (err) {
      mockStore.symptoms = mockStore.symptoms.filter(s => s._id !== id);
      return { success: true, message: 'Symptom Deleted' };
    }
  },
  deleteAllSymptoms: async () => {
    try {
      const res = await api.delete('/symptoms/all');
      return res.data;
    } catch (err) {
      mockStore.symptoms = [];
      return { success: true, message: 'All Symptoms Cleared' };
    }
  }
};

// Lab Report & OCR Services
export const reportService = {
  getReports: async (search = '') => {
    try {
      const res = await api.get(`/reports?search=${search}`);
      return res.data;
    } catch (err) {
      const filtered = mockStore.reports.filter(r => 
        r.fileName.toLowerCase().includes(search.toLowerCase())
      );
      return { success: true, count: filtered.length, data: filtered };
    }
  },
  uploadReport: async (file) => {
    try {
      const formData = new FormData();
      formData.append('report', file);
      const res = await api.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch (err) {
      const newReport = {
        _id: 'r_' + Date.now(),
        fileName: file.name || 'Sample_Lab_Report.png',
        filePath: 'uploads/sample.png',
        extractedText: 'Hemoglobin: 11.5 g/dL, TSH: 4.8 mIU/L, Blood Sugar: 102 mg/dL',
        hemoglobin: 11.5,
        tsh: 4.8,
        bloodSugar: 102,
        createdAt: new Date().toISOString()
      };
      mockStore.reports.unshift(newReport);
      return { success: true, message: 'Report Uploaded Successfully', report: newReport };
    }
  },
  updateReport: async (id, reportData) => {
    try {
      const res = await api.put(`/reports/${id}`, reportData);
      return res.data;
    } catch (err) {
      const index = mockStore.reports.findIndex(r => r._id === id);
      if (index !== -1) {
        mockStore.reports[index] = { ...mockStore.reports[index], ...reportData };
      }
      return { success: true, message: 'Report Updated Successfully' };
    }
  },
  deleteReport: async (id) => {
    try {
      const res = await api.delete(`/reports/${id}`);
      return res.data;
    } catch (err) {
      mockStore.reports = mockStore.reports.filter(r => r._id !== id);
      return { success: true, message: 'Report Deleted' };
    }
  },
  deleteAllReports: async () => {
    try {
      const res = await api.delete('/reports/all');
      return res.data;
    } catch (err) {
      mockStore.reports = [];
      return { success: true, message: 'All Reports Cleared' };
    }
  },
  extractText: async (id) => {
    try {
      const res = await api.post(`/reports/${id}/ocr`);
      return res.data;
    } catch (err) {
      const report = mockStore.reports.find(r => r._id === id);
      return {
        success: true,
        extractedText: report?.extractedText || 'Hemoglobin: 11.2 g/dL, TSH: 5.1 mIU/L',
        hemoglobin: report?.hemoglobin || 11.2,
        tsh: report?.tsh || 5.1,
        bloodSugar: report?.bloodSugar || 95
      };
    }
  }
};

// AI Diagnostic & Detective Services
export const aiService = {
  getHealthDetective: async () => {
    try {
      const res = await api.get('/detective');
      return res.data;
    } catch (err) {
      return {
        success: true,
        findings: [
          'Possible Mild Anemia (Hemoglobin 10.8 g/dL < 12.0 g/dL)',
          'Elevated Thyroid Marker (TSH 5.4 mIU/L > 4.5 mIU/L)',
          'Blood Sugar Normal (98 mg/dL)'
        ],
        recommendation: 'Consult an endocrinologist and review iron panel & serum ferritin level.'
      };
    }
  },
  getMissedClues: async () => {
    try {
      const res = await api.get('/clues');
      return res.data;
    } catch (err) {
      return {
        success: true,
        clues: [
          'Persistent Fatigue appears 2 times across the last 14 days',
          'Cold sensitivity correlates with elevated TSH reports'
        ]
      };
    }
  },
  getTimeline: async () => {
    try {
      const res = await api.get('/timeline');
      return res.data;
    } catch (err) {
      return {
        success: true,
        timeline: [
          { date: '2026-07-25T11:00:00Z', event: 'Lab Report Uploaded: Hemoglobin 11.2, TSH 5.1' },
          { date: '2026-07-25T11:05:00Z', event: 'Alert: Possible Anemia Risk Identified' },
          { date: '2026-08-01T10:00:00Z', event: 'Symptom Logged: Persistent Fatigue (Severity 7/10)' },
          { date: '2026-08-06T08:30:00Z', event: 'Lab Report Uploaded: Hemoglobin 10.8, TSH 5.4' },
          { date: '2026-08-07T09:15:00Z', event: 'Symptom Logged: Cold Sensitivity (Severity 6/10)' }
        ]
      };
    }
  },
  getTrends: async () => {
    try {
      const res = await api.get('/trends');
      return res.data;
    } catch (err) {
      return {
        success: true,
        marker: 'Hemoglobin',
        firstValue: 11.2,
        latestValue: 10.8,
        trend: 'Decreasing',
        risk: 'Anemia Risk Increasing'
      };
    }
  },
  getDoctorSummary: async () => {
    try {
      const res = await api.get('/doctor-summary');
      return res.data;
    } catch (err) {
      return {
        success: true,
        summary: `CHRONILENS AI - PATIENT CLINICAL SUMMARY
---------------------------------------------------
Main Symptoms Reported:
• Persistent Fatigue (Severity: 7-8/10)
• Mild Brain Fog (Severity: 5/10)
• Cold Sensitivity (Severity: 6/10)

Latest Lab Biomarkers:
• Hemoglobin: 10.8 g/dL (Below Normal: < 12.0)
• TSH (Thyroid Stimulating Hormone): 5.4 mIU/L (Elevated: > 4.5)
• Blood Sugar: 98 mg/dL (Normal Range)

AI Detective Key Insights:
• Hemoglobin trend is decreasing (11.2 -> 10.8 g/dL) indicating progressive anemia risk.
• Persistent fatigue correlates strongly with thyroid and hemoglobin markers.

Clinical Recommendation:
Full Iron Profile (Ferritin, TIBC) & Thyroid Panel (Free T3/T4) evaluation recommended.`
      };
    }
  }
};

// Dataset Management & Export/Link Service
export const datasetService = {
  getDataset: async () => {
    const [symptomsRes, reportsRes] = await Promise.all([
      symptomService.getSymptoms('', 1, 100),
      reportService.getReports('')
    ]);
    return {
      symptoms: symptomsRes.data || [],
      reports: reportsRes.data || []
    };
  },
  clearEntireDataset: async () => {
    await Promise.all([
      symptomService.deleteAllSymptoms(),
      reportService.deleteAllReports()
    ]);
    return { success: true, message: 'Entire dataset removed successfully' };
  },
  exportDatasetJson: async () => {
    const dataset = await datasetService.getDataset();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset, null, 2));
    return dataStr;
  },
  generateShareableLink: async () => {
    const dataset = await datasetService.getDataset();
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(dataset))));
    const shareUrl = `${window.location.origin}/?dataset=${encoded}`;
    return shareUrl;
  }
};

export default api;
