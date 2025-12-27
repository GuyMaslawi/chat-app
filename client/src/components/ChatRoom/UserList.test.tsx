import { render, screen } from '@testing-library/react';
import { UserList } from './UserList';

const mockOnlineUsers = [
  { userId: '1', username: 'User1', socketId: 'socket1' },
  { userId: '2', username: 'User2', socketId: 'socket2' },
];

describe('UserList', () => {
  it('renders user list', () => {
    render(
      <UserList
        participants={['1', '2']}
        onlineUsers={mockOnlineUsers}
        currentUserId="1"
      />
    );

    expect(screen.getByText(/Members/i)).toBeInTheDocument();
  });

  it('shows all online users in lobby mode', () => {
    render(
      <UserList
        participants={[]}
        onlineUsers={mockOnlineUsers}
        isLobby={true}
      />
    );

    expect(screen.getByText('User1')).toBeInTheDocument();
    expect(screen.getByText('User2')).toBeInTheDocument();
  });
});

