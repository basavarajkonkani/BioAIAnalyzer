import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Create Axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor to add JWT token to headers
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors - redirect to login
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
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
 * Analyze a biological sequence
 * @param {object} sequenceData - Object containing sequence and type
 * @param {string} sequenceData.sequence - The biological sequence to analyze
 * @param {string} sequenceData.type - Sequence type: 'DNA', 'RNA', or 'Protein'
 * @returns {Promise<object>} Analysis results
 */
export const analyzeSequence = async (sequenceData) => {
  try {
    const response = await apiClient.post('/analyze', sequenceData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.response?.data?.detail || 
                   error.message || 
                   'Analysis failed. Please try again.';
    throw new Error(message);
  }
};

/**
 * Upload a file for analysis
 * @param {FormData} formData - FormData object containing the file
 * @returns {Promise<object>} Analysis results
 */
export const uploadFile = async (formData) => {
  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.response?.data?.detail || 
                   error.message || 
                   'File upload failed. Please try again.';
    throw new Error(message);
  }
};

/**
 * Get user's analysis history
 * @returns {Promise<Array>} Array of history records
 */
export const getHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 
                   error.response?.data?.detail || 
                   error.message || 
                   'Unable to load analysis history';
    throw new Error(message);
  }
};

export default {
  analyzeSequence,
  uploadFile,
  getHistory
};
