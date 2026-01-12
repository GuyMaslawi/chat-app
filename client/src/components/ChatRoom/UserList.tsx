'use client';

import { memo, useMemo, useCallback } from 'react';
import { Box, Typography, List, ListItem, ListItemButton, Avatar, Tooltip, useTheme } from '@mui/material';
import { Circle as CircleIcon } from '@mui/icons-material';
import { OnlineUser } from '@/lib/api';
import { styles } from './UserList.sx';
import { buildUsersList, User } from './UserList.utils';

interface UserListProps {
  participants: string[];
  onlineUsers: OnlineUser[];
  currentUserId?: string;
  onUserClick?: (userId: string, username: string) => void;
  isLobby?: boolean;
}

function UserListComponent({ participants, onlineUsers, currentUserId, onUserClick, isLobby = false }: UserListProps) {
  const theme = useTheme();
  
  const users: User[] = useMemo(() => buildUsersList(participants, onlineUsers, isLobby), [participants, onlineUsers, isLobby]);

  const handleUserClick = useCallback((user: User) => {
    if (onUserClick && user.userId !== currentUserId) {
      onUserClick(user.userId, user.username);
    }
  }, [onUserClick, currentUserId]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h6" sx={styles.title}>
          Members ({users.length})
        </Typography>
      </Box>
      <List sx={styles.list}>
        {users.map((user) => {
          const isCurrentUser = user.userId === currentUserId;
          const displayName = user.name || user.username;
          const avatarInitials = displayName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          return (
            <ListItem key={user.userId} disablePadding sx={styles.listItem}>
              <ListItemButton
                onClick={() => handleUserClick(user)}
                disabled={isCurrentUser}
                sx={styles.listItemButton}
              >
                <Box sx={styles.userInfo}>
                  <Box sx={styles.avatarContainer}>
                    <Avatar
                      src={user.photoUrl}
                      alt={displayName}
                      sx={{
                        ...styles.avatar,
                        backgroundColor: user.photoUrl
                          ? undefined
                          : (user.isOnline
                            ? (theme.palette.mode === 'dark'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(16, 185, 129, 0.1)')
                            : undefined),
                        color: user.photoUrl
                          ? undefined
                          : (user.isOnline ? '#10b981' : theme.palette.text.secondary),
                      }}
                    >
                      {!user.photoUrl && avatarInitials}
                    </Avatar>
                    <CircleIcon
                      sx={{
                        ...styles.statusIndicator,
                        color: user.isOnline ? '#10b981' : theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af',
                      }}
                    />
                  </Box>
                  <Box sx={styles.userDetails}>
                    <Typography
                      variant="body2"
                      sx={{
                        ...styles.username,
                        fontWeight: user.isOnline ? 600 : 500,
                        color: isCurrentUser ? theme.palette.text.secondary : theme.palette.text.primary,
                      }}
                    >
                      {displayName}
                      {isCurrentUser && (
                        <Box component="span" sx={{ opacity: 0.7, marginLeft: 0.5 }}>
                          (You)
                        </Box>
                      )}
                    </Typography>
                    <Box sx={styles.status}>
                      <CircleIcon
                        sx={{
                          fontSize: '8px',
                          color: user.isOnline ? '#10b981' : theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af',
                        }}
                      />
                      <Typography variant="caption" component="span">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export const UserList = memo(UserListComponent);

