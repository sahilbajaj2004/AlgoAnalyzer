import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getAllAlgorithms = () => api.get('/algorithms');
export const getAlgorithmBySlug = (slug) => api.get(`/algorithms/${slug}`);
export const getAlgorithmCode = (slug, lang) => api.get(`/algorithms/${slug}/code?lang=${lang}`);
export const visualizeAlgorithm = (slug, input) => api.post(`/algorithms/${slug}/visualize`, { input });
export const analyzeCode = (data) =>
  api.post('/algorithms/analyze-code', data);
export const analyzeV2Code = (data) => api.post('/analyze-v2', data);

// Admin endpoints
export const updateAlgorithm = (slug, data) => api.put(`/admin/algorithms/${slug}`, data);
export const upsertAlgorithmCode = (slug, data) => api.put(`/admin/algorithms/${slug}/code`, data);

export default api;
