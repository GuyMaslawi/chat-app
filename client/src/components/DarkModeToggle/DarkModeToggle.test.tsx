import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DarkModeToggle } from './DarkModeToggle';

jest.mock('@/app/providers', () => ({
  useThemeMode: () => ({
    mode: 'light',
    toggleMode: jest.fn(),
  }),
}));

describe('DarkModeToggle', () => {
  it('renders dark mode icon when in light mode', () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls toggleMode when clicked', async () => {
    const toggleMode = jest.fn();
    jest.mock('@/app/providers', () => ({
      useThemeMode: () => ({
        mode: 'light',
        toggleMode,
      }),
    }));

    const user = userEvent.setup();
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(toggleMode).toHaveBeenCalled();
  });
});

