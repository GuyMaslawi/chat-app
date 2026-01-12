'use client';

import { Avatar, Box, Typography } from '@mui/material';
import { getCurrentUser } from '@/lib/auth';
import { styles } from './UserProfile.sx';

export function UserProfile() {
  const user = getCurrentUser();

  if (!user) {
    return null;
  }

  const displayName = user.name || user.username;
  const avatarInitials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Box sx={styles.container}>
      <Avatar
        src={user.photoUrl}
        alt={displayName}
        sx={styles.avatar}
      >
        {!user.photoUrl && avatarInitials}
      </Avatar>
      <Box sx={styles.userInfo}>
        <Typography variant="body2" sx={styles.name}>
          {displayName}
        </Typography>
        {user.email && (
          <Typography variant="caption" sx={styles.email}>
            {user.email}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

