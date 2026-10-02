import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchInfluencers = (filters: any) => api.post('/influencers/search', filters);
export const getInfluencer = (id: string) => api.get(`/influencers/${id}`);

export default api;
