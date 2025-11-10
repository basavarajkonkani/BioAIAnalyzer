import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance for auth requests
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Response interceptor for auth error handling
 */
authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      error.message = 'Unable to connect to server. Please try again';
    } else if (error.response.data) {
      // Extract error message from backend response
      error.message = error.response.data.message || 
                     error.response.data.detail || 
                     error.message;
    }
    return Promise.reject(error);
  }
);

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{token: string, user: object}>}
 */
export const login = async (email, password) => {
  const response = await authClient.post('/auth/login', { 
    email, 
    password 
  });
  
  const { access_token, user } = response.data;
  
  // Store token and user in localStorage
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return { 
    token: access_token, 
    user 
  };
};

/**
 * Register a new user
 * @param {string} name - User name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>}
 */
export const register = async (name, email, password) => {
  const response = await authClient.post('/auth/register', { 
    name, 
    email, 
    password 
  });
  
  return response.data;
};

/**
 * Logout user by removing token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get current user from localStorage
 * @returns {object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get authentication token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken
};
