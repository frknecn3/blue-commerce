import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('LoginForm Component', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      replace: mockReplace,
    } as any);
  });

  it('renders email and password inputs with submit button', () => {
    render(<LoginForm />);

    expect(screen.getByText('Welcome Back')).toBeDefined();
    expect(screen.getByLabelText('E-mail')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined();
  });

  it('displays validation error and prevents signIn on empty submit', async () => {
    const { container } = render(<LoginForm />);
    const form = container.querySelector('form')!;

    fireEvent.submit(form);

    expect(signIn).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address.')).toBeDefined();
  });

  it('displays error message when email format is invalid', async () => {
    const { container } = render(<LoginForm />);
    const form = container.querySelector('form')!;
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.change(passwordInput, { target: { value: 'secret123' } });
    fireEvent.submit(form);

    expect(signIn).not.toHaveBeenCalled();
    expect(screen.getByText('Please enter a valid email address.')).toBeDefined();
  });

  it('calls signIn and redirects on valid credentials', async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      ok: true,
      error: null,
      status: 200,
      url: '/',
    } as any);

    const { container } = render(<LoginForm />);
    const form = container.querySelector('form')!;
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'user@example.com',
        password: 'ValidPass123',
        redirect: false,
      });
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });

  it('displays error on failed authentication response', async () => {
    vi.mocked(signIn).mockResolvedValueOnce({
      ok: false,
      error: 'CredentialsSignin',
      status: 401,
      url: null,
    } as any);

    const { container } = render(<LoginForm />);
    const form = container.querySelector('form')!;
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getAllByText('Invalid email or password.').length).toBeGreaterThan(0);
    });
  });
});
