import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ayusethu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data)
};

export const CollectorService = {
  getBatches: () => api.get('/collector/batches'),
  getActiveFarmers: () => api.get('/collector/farmers'),
  getInventory: () => api.get('/collector/inventory'),
  getBatchDetail: (batchId) => api.get(`/collector/batch/${batchId}`),
  initBatch: (formData) => api.post('/collector/batch/init', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateStage: (batchId, stageNumber, formData) => api.put(`/collector/batch/${batchId}/stage/${stageNumber}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  verifyStage5: (batchId, formData) => api.put(`/collector/batch/${batchId}/stage5`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const ManufacturerService = {
  getDashboard:    () => api.get('/manufacturer/dashboard'),
  getAuctions:     () => api.get('/manufacturer/auctions'),
  getMyBatches:    () => api.get('/manufacturer/my-batches'),
  submitBid:       (data) => api.post('/manufacturer/bid', data),
  openAuction:     (batchId) => api.post(`/manufacturer/auction/${batchId}/open`),
  finalizeAuction: (batchId, data) => api.post(`/manufacturer/auction/${batchId}/finalize`, data),
};

export const LabService = {
  getAvailableSamples: () => api.get('/lab/samples/available'),
  getMyBatches:        () => api.get('/lab/samples/mine'),
  acceptBatch:         () => api.post('/lab/accept'),
  saveDraft:   (batchId, data) => api.put(`/lab/batch/${batchId}/save`, data),
  submitResults:(batchId, data) => api.post(`/lab/batch/${batchId}/submit`, data),
};

export const ConsumerService = {
  getTimeline: (batchId) => api.get(`/verify/${batchId}`),
};

export const AdminService = {
  getStats: () => api.get('/admin/stats'),
  getPendingHarvests: () => api.get('/admin/harvests/pending'),
  releaseForLab: (batchId) => api.post(`/admin/batch/${batchId}/release-lab`),
  getAuditLog: () => api.get('/admin/audit-log'),
  getAuctionMonitor: () => api.get('/admin/auction-monitor'),
  triggerAuction: () => api.post('/admin/auction/trigger'),
};

export const NotificationService = {
  fetchHistory: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`)
};

export default api;
