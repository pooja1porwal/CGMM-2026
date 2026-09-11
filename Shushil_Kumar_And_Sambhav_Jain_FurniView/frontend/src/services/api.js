import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
});

export const getAllFurniture = () => api.get('/furniture');
export const getFurnitureById = (id) => api.get(`/furniture/${id}`);

export default api;