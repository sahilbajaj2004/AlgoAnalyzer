import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_URL || '').trim();

const normalizedBaseUrl = (() => {
  if (!rawBaseUrl) {
    return import.meta.env.DEV
      ? 'http://localhost:5000/api'
      : 'https://algoanalyzer.onrender.com/api';
  }

  const withoutTrailingSlash = rawBaseUrl.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api`;
})();

const api = axios.create({
  baseURL: normalizedBaseUrl
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
