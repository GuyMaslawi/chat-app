'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';
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

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={{ ...styles.sidebar, width: drawerWidth }}>
        <RoomsList onRoomSelect={setSelectedRoomId} selectedRoomId={selectedRoomId} />
      </Box>

      <Box component="main" sx={styles.main}>
        {selectedRoomId && (
          <ChatRoom 
            roomId={selectedRoomId} 
            onBack={handleBackToLobby}
          />
        )}
      </Box>
    </Box>
  );
}

