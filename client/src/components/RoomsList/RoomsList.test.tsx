import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RoomsList } from './RoomsList';
import { getSocket } from '@/lib/socket';

const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();

jest.mock('@/lib/socket', () => ({
  getSocket: () => ({
    emit: mockEmit,
    on: mockOn,
    off: mockOff,
  }),
}));
jest.mock('@/lib/auth', () => ({
  getToken: () => 'mock-token',
  removeToken: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('RoomsList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOn.mockImplementation((event, callback) => {
      if (event === 'room:list') {
        setTimeout(() => {
          callback({
            rooms: [
              { id: '1', name: 'Room 1', participants: ['user1'], createdAt: new Date().toISOString() },
              { id: '2', name: 'Room 2', participants: ['user1', 'user2'], createdAt: new Date().toISOString() },
            ],
          });
        }, 0);
      }
    });
  });

  it('renders rooms list', async () => {
    render(<RoomsList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Room 1')).toBeInTheDocument();
      expect(screen.getByText('Room 2')).toBeInTheDocument();
    });
    expect(mockEmit).toHaveBeenCalledWith('room:list');
  });

  it('creates a new room', async () => {
    const user = userEvent.setup();
    mockOn.mockImplementation((event, callback) => {
      if (event === 'room:list') {
        setTimeout(() => {
          callback({ rooms: [] });
        }, 0);
      }
    });

    render(<RoomsList />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByLabelText('Room Name')).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText('Room Name'), 'New Room');
    await user.click(screen.getByRole('button', { name: /create room/i }));

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith('room:create', { name: 'New Room' });
    });
  });
});

