'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Skeleton, Paper } from '@mui/material';
import { RoomsList } from '../RoomsList/RoomsList';
import { ChatRoom } from '../ChatRoom/ChatRoom';
import { getLobbyRoomId } from '@/lib/lobby';
import { styles } from './ChatLayout.sx';
import { DRAWER_WIDTH } from './ChatLayout.utils';

interface ChatLayoutProps {
  initialRoomId?: string;
}

export function ChatLayout({ initialRoomId }: ChatLayoutProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(initialRoomId || null);
  const [isLoading, setIsLoading] = useState(!initialRoomId);

  useEffect(() => {
    if (!initialRoomId) {
      getLobbyRoomId().then((lobbyId) => {
        if (lobbyId) {
          setSelectedRoomId(lobbyId);
        }
        setIsLoading(false);
      });
    }
  }, [initialRoomId]);

  const drawerWidth = useMemo(() => DRAWER_WIDTH, []);

  const handleBackToLobby = useCallback(() => {
    getLobbyRoomId().then((lobbyId) => {
      if (lobbyId) {
        setSelectedRoomId(lobbyId);
      }
    });
  }, []);

  return (
    <Box sx={styles.container}>
      <Box sx={{ ...styles.sidebar, width: drawerWidth }}>
        {isLoading ? (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Paper sx={{ p: 2, mb: 2 }}>
              <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 1.5, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width="40%" height={40} sx={{ borderRadius: 1 }} />
            </Paper>
            <Skeleton variant="text" width="50%" height={28} />
            {[...Array(3)].map((_, i) => (
              <Paper key={i} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <RoomsList onRoomSelect={setSelectedRoomId} selectedRoomId={selectedRoomId} />
        )}
      </Box>

      <Box component="main" sx={styles.main}>
        {isLoading ? (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="30%" height={28} />
                <Skeleton variant="text" width="50%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 2 }}>
              <Skeleton variant="rectangular" height={56} sx={{ flex: 1, borderRadius: 1 }} />
              <Skeleton variant="rectangular" width={80} height={56} sx={{ borderRadius: 1 }} />
            </Box>
          </Box>
        ) : selectedRoomId ? (
          <ChatRoom 
            roomId={selectedRoomId} 
            onBack={handleBackToLobby}
          />
        ) : null}
      </Box>
    </Box>
  );
}

