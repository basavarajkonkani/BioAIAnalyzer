import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast state and control functions
 */
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type of toast: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (0 for persistent)
   */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  /**
   * Show a success toast
   */
  const showSuccess = useCallback((message, duration = 3000) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  /**
   * Show an error toast
   */
  const showError = useCallback((message, duration = 4000) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  /**
   * Show a warning toast
   */
  const showWarning = useCallback((message, duration = 3500) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  /**
   * Show an info toast
   */
  const showInfo = useCallback((message, duration = 3000) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  /**
   * Remove a toast by ID
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAll,
  };
};

export default useToast;
