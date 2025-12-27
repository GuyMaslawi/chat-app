import { render, screen } from '@testing-library/react';
import { AuthGuard } from './AuthGuard';

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    jest.mock('@/lib/auth', () => ({
      getToken: () => 'mock-token',
      isTokenExpired: () => false,
      logout: jest.fn(),
    }));

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

