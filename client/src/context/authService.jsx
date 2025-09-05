// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with proper configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true, // CRITICAL: Send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔄 Unauthorized - redirecting to login');
      // Clear any existing auth state and redirect
      try {
        await api.post('/auth/logout');
      } catch (logoutError) {
        console.error('Logout cleanup error:', logoutError);
      }
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login successful');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register new user
  signup: async (userData) => {
    try {
      console.log('📝 Attempting signup for:', userData.email);
      const response = await api.post('/auth/signup', userData);
      console.log('✅ Signup successful');
      return response.data;
    } catch (error) {
      console.error('❌ Signup failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      console.log('👤 Fetching current user');
      const response = await api.get('/auth/me');
      console.log('✅ User fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Get user failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log('🚪 Logging out');
      await api.post('/auth/logout');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error.response?.data || error.message);
      // Don't throw error for logout as we want to logout locally regardless
    }
  },

  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get('/health');
      console.log('✅ API connection test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      throw error;
    }
  }
};

export default authService;