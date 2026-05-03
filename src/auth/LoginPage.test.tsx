import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';

const generateTokenMock = vi.fn();
const addUserMock = vi.fn();

vi.mock('./useAuth', () => ({
  useGenerateToken: () => generateTokenMock,
  useLoginWithToken: () => vi.fn(),
  useCheckLogin: () => vi.fn(),
  useLogout: () => vi.fn()
}));

vi.mock('../account/useUser', () => ({
  useAddUser: () => addUserMock,
  useGetUser: () => vi.fn(),
  useUpdateUser: () => vi.fn()
}));

describe('LoginPage', () => {
  beforeEach(() => {
    generateTokenMock.mockReset();
    addUserMock.mockReset();
  });

  it('starts on the email login view with no password path', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByText('Login with password')).not.toBeInTheDocument();
  });

  it('moves to the signup view and back to login', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: 'No account? Create one' }));
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Already have an account? Login in' }));
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('moves to the token view after a successful code request', async () => {
    generateTokenMock.mockResolvedValue(true);
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await waitFor(() => {
      expect(screen.getByText(/Logging in as user@example.com\./i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Code/i)).toBeInTheDocument();
    expect(screen.queryByText('Login with password')).not.toBeInTheDocument();
  });
});
