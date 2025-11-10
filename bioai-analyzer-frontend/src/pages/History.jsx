import React from 'react';
import HistoryList from '../components/history/HistoryList';

/**
 * History page - displays user's analysis history
 */
function History() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Analysis History</h1>
        <p className="text-sm sm:text-base text-gray-600">
          View and revisit your previous sequence analyses. Click on any analysis to see the full results.
        </p>
      </div>

      {/* History List */}
      <HistoryList />
    </div>
  );
}

export default History;
