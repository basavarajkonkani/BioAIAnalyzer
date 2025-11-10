import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import History from '../../pages/History';
import { AuthProvider } from '../../context/AuthContext';
import * as api from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  getHistory: vi.fn(),
}));

describe('History Retrieval Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up authenticated user
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
  });

  const renderHistory = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <History />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should fetch and display history', async () => {
    const mockHistory = [
      {
        id: 1,
        input_sequence: 'ATGCATGC',
        results: {
          gc_content: '50.00%',
          nucleotide_counts: { A: 2, T: 2, G: 2, C: 2 },
          sequence_length: 8,
          sequence_type: 'DNA',
        },
        created_at: '2024-01-01T12:00:00Z',
      },
      {
        id: 2,
        input_sequence: 'AUGCAUGC',
        results: {
          gc_content: '50.00%',
          nucleotide_counts: { A: 2, U: 2, G: 2, C: 2 },
          sequence_length: 8,
          sequence_type: 'RNA',
        },
        created_at: '2024-01-02T12:00:00Z',
      },
    ];

    api.getHistory.mockResolvedValue({ data: mockHistory });

    renderHistory();

    // Wait for API call
    await waitFor(() => {
      expect(api.getHistory).toHaveBeenCalled();
    });

    // Verify history items are displayed
    await waitFor(() => {
      expect(screen.getByText(/ATGCATGC/)).toBeInTheDocument();
      expect(screen.getByText(/AUGCAUGC/)).toBeInTheDocument();
    });
  });

  it('should handle empty history', async () => {
    api.getHistory.mockResolvedValue({ data: [] });

    renderHistory();

    // Wait for API call
    await waitFor(() => {
      expect(api.getHistory).toHaveBeenCalled();
    });

    // Verify empty state message
    await waitFor(() => {
      expect(screen.getByText(/No analysis history/i)).toBeInTheDocument();
    });
  });

  it('should handle history fetch error', async () => {
    api.getHistory.mockRejectedValue(new Error('Unable to load analysis history'));

    renderHistory();

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Unable to load analysis history/i)).toBeInTheDocument();
    });
  });
});
