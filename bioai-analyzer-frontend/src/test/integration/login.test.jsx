import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { AuthProvider } from '../../context/AuthContext';
import * as authService from '../../services/auth';

// Mock the auth service
vi.mock('../../services/auth', () => ({
  login: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderLoginForm = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  it('should complete successful login flow', async () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';

    authService.login.mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });

    renderLoginForm();

    // Fill in the form
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait for the API call
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Verify token and user are stored
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockUser);
    });
  });

  it('should handle login failure', async () => {
    authService.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginForm();

    // Fill in the form
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });

    // Verify no token is stored
    expect(localStorage.getItem('token')).toBeNull();
  });
});
