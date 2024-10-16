import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const login = async (username: string, password: string) => {
  try {
    console.log('Sending login request with:', { username, password: '****' });
    const response = await api.post('/login', { username, password });
    console.log('Login response:', response);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return true;
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
  return false;
};

// Add a new function to check if the user is already logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (isTokenExpired(token)) {
      // Token is expired, remove it and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject('Token expired');
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const isTokenExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

export default api;
