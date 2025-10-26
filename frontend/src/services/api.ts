import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api'; // Update this when backend URL changes

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token is expired and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Login user
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // Register new user
  async signup(userData: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) {
    const response = await api.post('/auth/signup/', userData);
    return response.data;
  },

  // Logout user
  async logout() {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });

    return response.data;
  },
};

// Profile API functions
export const profileAPI = {
  // Get current user profile
  async getProfile() {
    const response = await api.get('/profile/');
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
  }) {
    const response = await api.put('/profile/edit/', profileData);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Set auth tokens in localStorage
  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  // Clear auth tokens
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get stored user data
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user data in localStorage
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  // Update base URL (useful for different environments)
  setBaseURL(url: string) {
    api.defaults.baseURL = url;
  },
};

export default api;
