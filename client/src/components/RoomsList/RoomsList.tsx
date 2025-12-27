'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Paper,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Logout as LogoutIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Circle as CircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { roomsApi, OnlineUser } from '@/lib/api';
import { logout } from '@/lib/auth';
import { getRoomInitial, getCurrentUserId } from './RoomsList.utils';
import { getSocket } from '@/lib/socket';
import { DarkModeToggle } from '@/components/DarkModeToggle/DarkModeToggle';
import { styles } from './RoomsList.sx';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import {
  RoomListResponse,
  PresenceUpdatePayload,
  ErrorPayload,
  RoomUpdatedPayload,
  RoomDeletedPayload,
  RoomCreatedPayload,
} from '@/lib/socket.types';

interface RoomsListProps {
  onRoomSelect?: (roomId: string) => void;
  selectedRoomId?: string | null;
}

export function RoomsList({ onRoomSelect, selectedRoomId }: RoomsListProps = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [onlineUsersByRoom, setOnlineUsersByRoom] = useState<Record<string, OnlineUser[]>>({});
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; participants: string[]; createdBy?: string; createdAt: string; isPrivate?: boolean; isLobby?: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ id: string; name: string } | null>(null);
  const [editRoomName, setEditRoomName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const socket = getSocket();

    
    socket.emit('room:list');

    const handleRoomList = (data: RoomListResponse) => {
      setRooms(data.rooms);
      setIsLoading(false);
      
      if (onRoomSelect && !selectedRoomId) {
        const lobby = data.rooms.find(r => r.isLobby);
        if (lobby) {
          onRoomSelect(lobby.id);
        }
      }
    };

    const handleRoomCreated = (data: RoomCreatedPayload) => {
      
      setRooms((prev) => {
        const exists = prev.some((room) => room.id === data.id);
        if (exists) {
          return prev; 
        }
        return [...prev, data]; 
      });
      setIsLoading(false);
    };

    const handlePresenceUpdate = (data: PresenceUpdatePayload) => {
      setOnlineUsersByRoom((prev) => {
        
        
        const newState = {
          ...prev,
          [data.roomId]: data.users,
        };
        
        
        return newState;
      });
    };

    const handleError = (error: ErrorPayload) => {
      
      if (error.code !== 'UNAUTHORIZED' && !error.message?.includes('Authentication required')) {
        setError(error.message);
      }
    };

    const handleRoomUpdated = (data: RoomUpdatedPayload) => {
      setRooms((prev) =>
        prev.map((room) => (room.id === data.id ? { ...room, name: data.name } : room))
      );
      setEditDialogOpen(false);
      setEditingRoom(null);
      setEditRoomName('');
    };

    const handleRoomDeleted = (data: RoomDeletedPayload) => {
      setRooms((prev) => prev.filter((room) => room.id !== data.roomId));
      
      setOnlineUsersByRoom((prev) => {
        const newState = { ...prev };
        delete newState[data.roomId];
        return newState;
      });
      setDeleteDialogOpen(false);
      setDeletingRoomId(null);
      
      if (window.location.pathname.includes(`/rooms/${data.roomId}`)) {
        router.push('/rooms');
      }
    };

    socket.on('room:list', handleRoomList);
    socket.on('room:created', handleRoomCreated);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('room:updated', handleRoomUpdated);
    socket.on('room:deleted', handleRoomDeleted);
    socket.on('error', handleError);

    return () => {
      socket.off('room:list', handleRoomList);
      socket.off('room:created', handleRoomCreated);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('room:updated', handleRoomUpdated);
      socket.off('room:deleted', handleRoomDeleted);
      socket.off('error', handleError);
    };
  }, [router, mounted, onRoomSelect, selectedRoomId]);

  
  const refetchRooms = () => {
    if (mounted) {
      const socket = getSocket();
      socket.emit('room:list');
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (roomName.trim()) {
      const socket = getSocket();
      socket.emit('room:create', { name: roomName.trim() });
      setRoomName('');
    }
  };

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const handleEditClick = useCallback((e: React.MouseEvent, room: { id: string; name: string }) => {
    e.stopPropagation();
    setEditingRoom(room);
    setEditRoomName(room.name);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    setDeletingRoomId(roomId);
    setDeleteDialogOpen(true);
  }, []);

  const handleEditConfirm = useCallback(() => {
    if (editingRoom && editRoomName.trim()) {
      const socket = getSocket();
      socket.emit('room:update', {
        roomId: editingRoom.id,
        name: editRoomName.trim(),
      });
    }
  }, [editingRoom, editRoomName]);

  const handleDeleteConfirm = useCallback(() => {
    if (deletingRoomId) {
      const socket = getSocket();
      socket.emit('room:delete', { roomId: deletingRoomId });
    }
  }, [deletingRoomId]);

  
  const containerStyles = useMemo(() => onRoomSelect
    ? {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        backgroundColor: 'background.default',
      }
    : { ...styles.container, height: '100%', display: 'flex', flexDirection: 'column' }, [onRoomSelect]);

  const lobby = useMemo(() => rooms.find(r => r.isLobby), [rooms]);
  const privateRooms = useMemo(() => rooms.filter(r => r.isPrivate && !r.isLobby), [rooms]);
  const publicRooms = useMemo(() => rooms.filter(r => !r.isPrivate && !r.isLobby), [rooms]);

  return (
    <Box sx={containerStyles}>
      {/* Toolbar at the top - only show if not in sidebar mode */}
      {!onRoomSelect && (
        <Box sx={styles.toolbar}>
          <Typography variant="h6" sx={styles.headerTitle}>
            Chat Rooms
          </Typography>
          <Box sx={styles.spacer} />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <DarkModeToggle />
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              variant="outlined"
              sx={styles.logoutButton}
            >
              Logout
            </Button>
          </Box>
        </Box>
      )}

      {/* Content area */}
      <Box sx={{ ...styles.content, flex: 1, overflow: 'auto' }} suppressHydrationWarning>
        {!mounted ? (
          <Box sx={styles.loading}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : (
          <>
            {/* Create Room Section - Show in both modes */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, color: 'text.primary' }}>
                Create Room
              </Typography>
              <Paper sx={onRoomSelect ? { ...styles.formCard, padding: 2 } : styles.formCard}>
                <form onSubmit={handleCreateRoom}>
                  <Box sx={onRoomSelect ? { display: 'flex', flexDirection: 'column', gap: 1.5 } : styles.formRow}>
                    <TextField
                      label="Room Name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      fullWidth
                      size={onRoomSelect ? 'small' : 'medium'}
                      sx={styles.input}
                      placeholder="Enter a room name..."
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<AddIcon />}
                      disabled={!roomName.trim()}
                      sx={onRoomSelect ? { ...styles.createButton, height: '40px', minWidth: '100%' } : styles.createButton}
                    >
                      Create Room
                    </Button>
                  </Box>
                </form>
                {error && (
                  <Alert severity="error" sx={{ ...styles.alert, marginTop: 2 }}>
                    {error}
                  </Alert>
                )}
              </Paper>
            </Box>

        {isLoading ? (
          <Box sx={styles.loading}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : rooms && rooms.length > 0 ? (
          <>
            {/* Lobby Section */}
            {lobby && (
                <Box sx={{ marginBottom: 4 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, color: 'text.primary' }}>
                    Available Rooms
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
                    Lobby
                  </Typography>
                  {onRoomSelect ? (
                    <Paper
                      key={lobby.id}
                      sx={{
                        ...styles.roomCard,
                        backgroundColor: selectedRoomId === lobby.id ? 'action.selected' : 'background.paper',
                        borderColor: selectedRoomId === lobby.id ? 'primary.main' : 'divider',
                      }}
                      onClick={() => {
                        if (onRoomSelect) {
                          onRoomSelect(lobby.id);
                        } else {
                          router.push(`/rooms/${lobby.id}`);
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative', width: '100%' }}>
                        <Box sx={styles.roomIcon}>{getRoomInitial(lobby.name)}</Box>
                        <Typography variant="h6" sx={styles.roomName}>
                          {lobby.name}
                        </Typography>
                        <Box sx={styles.roomMeta}>
                          <PeopleIcon sx={{ fontSize: '1rem' }} />
                          <Typography variant="body2" sx={{ marginRight: 2 }}>
                            Public Room
                          </Typography>
                          {onlineUsersByRoom[lobby.id] && onlineUsersByRoom[lobby.id].length > 0 && (
                            <Chip
                              icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                              label={`${onlineUsersByRoom[lobby.id].length} online`}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: '24px',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                    ) : (
                      <Grid container sx={styles.roomsGrid}>
                        <Paper
                          key={lobby.id}
                          sx={styles.roomCard}
                          onClick={() => router.push(`/rooms/${lobby.id}`)}
                        >
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            <Box sx={styles.roomIcon}>{getRoomInitial(lobby.name)}</Box>
                            <Typography variant="h6" sx={styles.roomName}>
                              {lobby.name}
                            </Typography>
                            <Box sx={styles.roomMeta}>
                              <PeopleIcon sx={{ fontSize: '1rem' }} />
                              <Typography variant="body2" sx={{ marginRight: 2 }}>
                                Public Room
                              </Typography>
                              {onlineUsersByRoom[lobby.id] && onlineUsersByRoom[lobby.id].length > 0 && (
                                <Chip
                                  icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                                  label={`${onlineUsersByRoom[lobby.id].length} online`}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10b981',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: '24px',
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    )}
                </Box>
              )}

            {privateRooms.length > 0 && (
                <Box sx={{ marginBottom: 4 }}>
                  <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, color: 'text.primary' }}>
                    Private Chats
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
                    Your private conversations
                  </Typography>
                  <Box sx={onRoomSelect ? { display: 'flex', flexDirection: 'column', gap: 1 } : {}}>
                    {onRoomSelect ? (
                      privateRooms.map((room) => (
                        <Paper
                          key={room.id}
                          sx={{
                            ...styles.roomCard,
                            backgroundColor: selectedRoomId === room.id ? 'action.selected' : 'background.paper',
                            borderColor: selectedRoomId === room.id ? 'primary.main' : 'divider',
                          }}
                          onClick={() => {
                            if (onRoomSelect) {
                              onRoomSelect(room.id);
                            } else {
                              router.push(`/rooms/${room.id}`);
                            }
                          }}
                        >
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            <Box sx={styles.roomIcon}>{getRoomInitial(room.name)}</Box>
                            <Typography variant="h6" sx={styles.roomName}>
                              {room.name}
                            </Typography>
                            <Box sx={styles.roomMeta}>
                              <PeopleIcon sx={{ fontSize: '1rem' }} />
                              <Typography variant="body2" sx={{ marginRight: 2 }}>
                                Private
                              </Typography>
                              {onlineUsersByRoom[room.id] && onlineUsersByRoom[room.id].length > 0 && (
                                <Chip
                                  icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                                  label={`${onlineUsersByRoom[room.id].length} online`}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    color: '#10b981',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: '24px',
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      ))
                    ) : (
                      <Grid container sx={styles.roomsGrid}>
                        {privateRooms.map((room) => (
                          <Paper
                            key={room.id}
                            sx={styles.roomCard}
                            onClick={() => router.push(`/rooms/${room.id}`)}
                          >
                            <Box sx={{ position: 'relative', width: '100%' }}>
                              <Box sx={styles.roomIcon}>{getRoomInitial(room.name)}</Box>
                              <Typography variant="h6" sx={styles.roomName}>
                                {room.name}
                              </Typography>
                              <Box sx={styles.roomMeta}>
                                <PeopleIcon sx={{ fontSize: '1rem' }} />
                                <Typography variant="body2" sx={{ marginRight: 2 }}>
                                  Private
                                </Typography>
                                {onlineUsersByRoom[room.id] && onlineUsersByRoom[room.id].length > 0 && (
                                  <Chip
                                    icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                                    label={`${onlineUsersByRoom[room.id].length} online`}
                                    size="small"
                                    sx={{
                                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                      color: '#10b981',
                                      fontWeight: 600,
                                      fontSize: '0.75rem',
                                      height: '24px',
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Paper>
                        ))}
                      </Grid>
                    )}
                  </Box>
                </Box>
              )}

            {publicRooms.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, color: 'text.primary' }}>
                    Public Rooms
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 2, color: 'text.secondary' }}>
                    Join public rooms created by the community
                  </Typography>
                  <Box sx={onRoomSelect ? { display: 'flex', flexDirection: 'column', gap: 1 } : {}}>
                    {onRoomSelect ? (
                      publicRooms.map((room) => {
                        const currentUserId = getCurrentUserId();
                        const isCreator = room.createdBy === currentUserId;
                        
                        return (
                          <Paper
                            key={room.id}
                            sx={{
                              ...styles.roomCard,
                              backgroundColor: selectedRoomId === room.id ? 'action.selected' : 'background.paper',
                              borderColor: selectedRoomId === room.id ? 'primary.main' : 'divider',
                            }}
                            onClick={() => {
                              if (onRoomSelect) {
                                onRoomSelect(room.id);
                              } else {
                                router.push(`/rooms/${room.id}`);
                              }
                            }}
                          >
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            {isCreator && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          display: 'flex',
                          gap: 0.5,
                          zIndex: 1,
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleEditClick(e, { id: room.id, name: room.name })}
                          sx={{
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteClick(e, room.id)}
                          sx={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                    <Box sx={styles.roomIcon}>{getRoomInitial(room.name)}</Box>
                    <Typography variant="h6" sx={styles.roomName}>
                      {room.name}
                    </Typography>
                    <Box sx={styles.roomMeta}>
                      <PeopleIcon sx={{ fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ marginRight: 2 }}>
                        {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}
                      </Typography>
                      {onlineUsersByRoom[room.id] && onlineUsersByRoom[room.id].length > 0 && (
                        <Chip
                          icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                          label={`${onlineUsersByRoom[room.id].length} online`}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: '24px',
                          }}
                        />
                      )}
                            </Box>
                          </Box>
                        </Paper>
                        );
                      })
                    ) : (
                      <Grid container sx={styles.roomsGrid}>
                        {publicRooms.map((room) => {
                          const currentUserId = getCurrentUserId();
                          const isCreator = room.createdBy === currentUserId;
                          
                          return (
                            <Paper
                              key={room.id}
                              sx={styles.roomCard}
                              onClick={() => router.push(`/rooms/${room.id}`)}
                            >
                              <Box sx={{ position: 'relative', width: '100%' }}>
                                {isCreator && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: 8,
                                      right: 8,
                                      display: 'flex',
                                      gap: 0.5,
                                      zIndex: 1,
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleEditClick(e, { id: room.id, name: room.name })}
                                      sx={{
                                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        color: '#6366f1',
                                        '&:hover': {
                                          backgroundColor: 'rgba(99, 102, 241, 0.2)',
                                        },
                                      }}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => handleDeleteClick(e, room.id)}
                                      sx={{
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        '&:hover': {
                                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                                        },
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                                <Box sx={styles.roomIcon}>{getRoomInitial(room.name)}</Box>
                                <Typography variant="h6" sx={styles.roomName}>
                                  {room.name}
                                </Typography>
                                <Box sx={styles.roomMeta}>
                                  <PeopleIcon sx={{ fontSize: '1rem' }} />
                                  <Typography variant="body2" sx={{ marginRight: 2 }}>
                                    {room.participants.length} participant{room.participants.length !== 1 ? 's' : ''}
                                  </Typography>
                                  {onlineUsersByRoom[room.id] && onlineUsersByRoom[room.id].length > 0 && (
                                    <Chip
                                      icon={<CircleIcon sx={{ fontSize: '0.75rem !important', color: '#10b981' }} />}
                                      label={`${onlineUsersByRoom[room.id].length} online`}
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                        color: '#10b981',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: '24px',
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Paper>
                          );
                        })}
                      </Grid>
                    )}
                  </Box>
                </Box>
              )}
          </>
        ) : (
          <Box sx={styles.empty}>
            <ChatIcon sx={styles.emptyIcon} />
            <Typography variant="h6" sx={{ marginBottom: 1, color: 'text.primary', fontWeight: 600 }}>
              No rooms available yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: 2 }}>
              Use the form above to create your first room and start chatting with others!
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
              Rooms you create will appear here, and you can join the lobby to chat with everyone.
            </Typography>
          </Box>
        )}
          </>
        )}
      </Box>

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Room Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            value={editRoomName}
            onChange={(e) => setEditRoomName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditConfirm}
            variant="contained"
            disabled={!editRoomName.trim() || editRoomName.trim() === editingRoom?.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Room Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this room? This action cannot be undone and all messages will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

