import axios from 'axios';
import { getEnvironmentVariables } from '../config/environment';

const env = getEnvironmentVariables();

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  get: <T>(url: string) => api.get<T>(url).then(response => response.data),
  post: <T>(url: string, data: any) => api.post<T>(url, data).then(response => response.data),
  put: <T>(url: string, data: any) => api.put<T>(url, data).then(response => response.data),
  delete: <T>(url: string) => api.delete<T>(url).then(response => response.data)
};