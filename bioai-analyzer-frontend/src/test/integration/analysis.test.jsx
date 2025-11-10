import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../../pages/Dashboard';
import { AuthProvider } from '../../context/AuthContext';
import * as api from '../../services/api';

// Mock the API service
vi.mock('../../services/api', () => ({
  analyzeSequence: vi.fn(),
  uploadFile: vi.fn(),
}));

describe('Sequence Analysis Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up authenticated user
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should submit DNA sequence for analysis', async () => {
    const mockResults = {
      gc_content: '52.34%',
      nucleotide_counts: { A: 10, T: 10, G: 5, C: 5 },
      sequence_length: 30,
      sequence_type: 'DNA',
    };

    api.analyzeSequence.mockResolvedValue({ data: mockResults });

    renderDashboard();

    // Enter sequence
    const textarea = screen.getByPlaceholderText(/Enter DNA sequence here/i);
    fireEvent.change(textarea, { target: { value: 'ATGCATGCATGC' } });

    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(analyzeButton);

    // Wait for API call
    await waitFor(() => {
      expect(api.analyzeSequence).toHaveBeenCalledWith({
        sequence: 'ATGCATGCATGC',
        type: 'DNA',
      });
    });

    // Verify results are displayed
    await waitFor(() => {
      expect(screen.getByText(/52.34%/)).toBeInTheDocument();
    });
  });

  it('should handle analysis error', async () => {
    api.analyzeSequence.mockRejectedValue(new Error('Analysis failed'));

    renderDashboard();

    // Enter sequence
    const textarea = screen.getByPlaceholderText(/Enter DNA sequence here/i);
    fireEvent.change(textarea, { target: { value: 'ATGC' } });

    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i });
    fireEvent.click(analyzeButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Analysis failed/i)).toBeInTheDocument();
    });
  });

  it('should switch between sequence types', () => {
    renderDashboard();

    // Check DNA tab is active by default
    expect(screen.getByPlaceholderText(/Enter DNA sequence here/i)).toBeInTheDocument();

    // Click RNA tab
    const rnaTab = screen.getByRole('button', { name: /RNA/i });
    fireEvent.click(rnaTab);

    // Verify RNA placeholder appears
    expect(screen.getByPlaceholderText(/Enter RNA sequence here/i)).toBeInTheDocument();

    // Click Protein tab
    const proteinTab = screen.getByRole('button', { name: /Protein/i });
    fireEvent.click(proteinTab);

    // Verify Protein placeholder appears
    expect(screen.getByPlaceholderText(/Enter Protein sequence here/i)).toBeInTheDocument();
  });
});
