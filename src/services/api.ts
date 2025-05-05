import axios from 'axios';

// Base API URL - we'll keep it hardcoded for now, but in production it should be in .env
const API_URL = 'http://localhost:5001/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the auth context handle 401 errors
    if (error.response?.status === 401) {
      console.error('Authentication error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;