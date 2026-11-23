import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ac_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[]; statusCode?: number }>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ac_token');
      localStorage.removeItem('ac_user');
      window.location.href = '/login';
    }

    // Normalise NestJS validation error arrays to a single string
    const raw = error.response?.data?.message;
    if (Array.isArray(raw)) {
      (error.response!.data as any).message = raw[0];
    }

    return Promise.reject(error);
  },
);

export default api;
