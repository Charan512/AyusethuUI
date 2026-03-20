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
};

export const CollectorService = {
  getBatches: () => api.get('/collector/batches'),
  verifyStage5: (batchId, formData) => api.put(`/collector/batch/${batchId}/stage5`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const ConsumerService = {
  getTimeline: (batchId) => api.get(`/verify/${batchId}`),
};

export default api;
