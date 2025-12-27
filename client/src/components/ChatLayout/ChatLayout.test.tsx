import { render, screen } from '@testing-library/react';
import { ChatLayout } from './ChatLayout';

jest.mock('@/lib/lobby', () => ({
  getLobbyRoomId: jest.fn().mockResolvedValue('lobby-id'),
}));

jest.mock('../RoomsList/RoomsList', () => ({
  RoomsList: () => <div>RoomsList</div>,
}));

jest.mock('../ChatRoom/ChatRoom', () => ({
  ChatRoom: () => <div>ChatRoom</div>,
}));

describe('ChatLayout', () => {
  it('renders loading state initially', () => {
    render(<ChatLayout />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

