import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatRoom } from './ChatRoom';
import { getSocket } from '@/lib/socket';

const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();
const mockGetById = jest.fn();

jest.mock('@/lib/socket', () => ({
  getSocket: () => ({
    emit: mockEmit,
    on: mockOn,
    off: mockOff,
  }),
}));
jest.mock('@/lib/auth', () => ({
  getToken: () => 'mock-token',
}));
jest.mock('@/lib/api', () => ({
  roomsApi: {
    getById: mockGetById,
  },
}));
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const theme = createTheme();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
};

describe('ChatRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetById.mockResolvedValue({
      _id: '1',
      name: 'Test Room',
      participants: ['user1'],
    });
    mockOn.mockImplementation((event, callback) => {
      if (event === 'room:history') {
        setTimeout(() => {
          callback({
            roomId: '1',
            messages: [
              {
                id: '1',
                roomId: '1',
                userId: 'user1',
                content: 'Hello',
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }, 0);
      }
    });
  });

  it('renders chat room', async () => {
    render(<ChatRoom roomId="1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test Room')).toBeInTheDocument();
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
    expect(mockEmit).toHaveBeenCalledWith('room:join', { roomId: '1' });
  });

  it('sends a message', async () => {
    const user = userEvent.setup();
    mockGetById.mockResolvedValue({
      _id: '1',
      name: 'Test Room',
      participants: ['user1'],
    });
    mockOn.mockImplementation((event, callback) => {
      if (event === 'room:history') {
        setTimeout(() => {
          callback({ roomId: '1', messages: [] });
        }, 0);
      }
    });

    render(<ChatRoom roomId="1" />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'New message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith('message:send', {
        roomId: '1',
        content: 'New message',
      });
    });
  });
});

