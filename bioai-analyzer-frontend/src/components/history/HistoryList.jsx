import { useState } from 'react';
import PropTypes from 'prop-types';
import useHistory from '../../hooks/useHistory';
import HistoryItem from './HistoryItem';
import LoadingSpinner from '../common/LoadingSpinner';
import ResultsDisplay from '../dashboard/ResultsDisplay';

/**
 * HistoryList component - displays list of analysis history with pagination
 */
const HistoryList = () => {
  const {
    history,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    goToPage
  } = useHistory(20); // 20 items per page

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  /**
   * Handle viewing details of an analysis
   */
  const handleViewDetails = (analysis) => {
    setSelectedAnalysis(analysis);
    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handle closing the details view
   */
  const handleCloseDetails = () => {
    setSelectedAnalysis(null);
  };

  // Show loading spinner while fetching
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading analysis history...</p>
      </div>
    );
  }

  // Show error message if fetch fails
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg
          className="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-800 font-medium text-lg mb-2">Error Loading History</p>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Show empty state if no history
  if (history.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <svg
          className="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 text-lg font-medium mb-2">No Analysis History</p>
        <p className="text-gray-500">
          Your analysis history will appear here once you start analyzing sequences.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Selected Analysis Details */}
      {selectedAnalysis && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Analysis Details</h3>
            <button
              onClick={handleCloseDetails}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close details"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ResultsDisplay results={selectedAnalysis.results} />
        </div>
      )}

      {/* History List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-sm sm:text-base text-gray-600">
          Showing {history.length} of {totalItems} {totalItems === 1 ? 'analysis' : 'analyses'}
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {history.map((analysis) => (
          <HistoryItem
            key={analysis.id}
            analysis={analysis}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
          <button
            onClick={previousPage}
            disabled={!hasPreviousPage}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              hasPreviousPage
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex gap-1 overflow-x-auto max-w-full">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              const showPage =
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                // Show ellipsis for skipped pages
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 sm:px-3 py-2 text-gray-500 text-sm">
                      ...
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    page === currentPage
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              hasNextPage
                ? 'bg-primary-500 hover:bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

HistoryList.propTypes = {};

export default HistoryList;
