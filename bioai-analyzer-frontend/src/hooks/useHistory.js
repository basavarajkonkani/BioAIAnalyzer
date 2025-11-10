import { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

/**
 * Custom hook to fetch and manage analysis history
 * @param {number} itemsPerPage - Number of items to display per page (default: 20)
 * @returns {object} History state and pagination controls
 */
export const useHistory = (itemsPerPage = 20) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = history.slice(startIndex, endIndex);

  /**
   * Fetch history data from API
   */
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getHistory();
      // Sort by created_at descending (most recent first)
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        : [];
      setHistory(sortedData);
    } catch (err) {
      setError(err.message || 'Unable to load analysis history');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to next page
   */
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  /**
   * Navigate to previous page
   */
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  /**
   * Go to specific page
   */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Refresh history data
   */
  const refresh = () => {
    fetchHistory();
  };

  // Fetch history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history: currentItems,
    allHistory: history,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    nextPage,
    previousPage,
    goToPage,
    refresh
  };
};

export default useHistory;
