'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Alert,
  CircularProgress,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { roomsApi, OnlineUser } from '@/lib/api';
import { getSocket } from '@/lib/socket';
import { Message } from '@/lib/api';
import { getCurrentUserId } from '@/components/RoomsList/RoomsList.utils';
import { logout } from '@/lib/auth';
import { UserList } from './UserList';
import { DarkModeToggle } from '@/components/DarkModeToggle/DarkModeToggle';
import { UserProfile } from '@/components/UserProfile';
import { styles } from './ChatRoom.sx';
import { lightModeColors, darkModeColors } from '@/lib/colors';
import {
  MessageNewPayload,
  PresenceUpdatePayload,
  RoomHistoryPayload,
  ErrorPayload,
  RoomUpdatedPayload,
  RoomDeletedPayload,
  PrivateChatCreatedPayload,
} from '@/lib/socket.types';

interface ChatRoomProps {
  roomId: string;
  onBack?: () => void;
}

export function ChatRoom({ roomId, onBack }: ChatRoomProps) {
  const router = useRouter();
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRoomName, setEditRoomName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null);
  const queryClient = useQueryClient();

  const { data: room, isLoading: roomLoading } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomsApi.getById(roomId),
  });

  const isLobby = useMemo(() => (room as any)?.isLobby || false, [room]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    
    socket.emit('room:join', { roomId });

    const handleRoomHistory = (data: RoomHistoryPayload) => {
      if (data.roomId === roomId) {
        setMessages(data.messages);
        setIsLoadingMessages(false);
      }
    };

    const handleNewMessage = (newMessage: MessageNewPayload) => {
      if (newMessage.roomId === roomId) {
        setMessages((old) => [...old, newMessage]);
      }
    };

    const handlePresenceUpdate = (data: PresenceUpdatePayload) => {
      if (data.roomId === roomId) {
        setOnlineUsers(data.users);
      }
    };

    const handleError = (error: ErrorPayload) => {
      
      if (error.code !== 'UNAUTHORIZED' && !error.message?.includes('Authentication required')) {
        setError(error.message);
      }
    };

    const handleRoomUpdated = (data: RoomUpdatedPayload) => {
      if (data.id === roomId) {
        
        queryClient.setQueryData(['room', roomId], (old: any) => ({
          ...old,
          name: data.name,
        }));
        setEditDialogOpen(false);
        setEditRoomName('');
      }
    };

    const handleRoomDeleted = (data: RoomDeletedPayload) => {
      if (data.roomId === roomId) {
        
        router.push('/rooms');
      }
    };

    const handlePrivateChatCreated = (data: PrivateChatCreatedPayload) => {
      
      router.push(`/rooms/${data.roomId}`);
    };

    socket.on('room:history', handleRoomHistory);
    socket.on('message:new', handleNewMessage);
    socket.on('presence:update', handlePresenceUpdate);
    socket.on('room:updated', handleRoomUpdated);
    socket.on('room:deleted', handleRoomDeleted);
    socket.on('private:chat:created', handlePrivateChatCreated);
    socket.on('error', handleError);

    return () => {
      socket.emit('room:leave', { roomId });
      socket.off('room:history', handleRoomHistory);
      socket.off('message:new', handleNewMessage);
      socket.off('presence:update', handlePresenceUpdate);
      socket.off('room:updated', handleRoomUpdated);
      socket.off('room:deleted', handleRoomDeleted);
      socket.off('private:chat:created', handlePrivateChatCreated);
      socket.off('error', handleError);
    };
  }, [roomId, router, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!message.trim() || !socketRef.current) {
      return;
    }
    socketRef.current.emit('message:send', {
      roomId,
      content: message.trim(),
    });
    setMessage('');
  }, [message, roomId]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const handleEditRoomNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditRoomName(e.target.value);
  }, []);

  const currentUserId = useMemo(() => getCurrentUserId(), []);

  const handleUserClick = useCallback((userId: string, username: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit('private:chat:create', {
      otherUserId: userId,
      otherUserName: username,
    });
  }, []);

  const isOwnMessage = useCallback((msg: Message) => {
    return currentUserId === msg.userId;
  }, [currentUserId]);

  const getUserMessageColor = useCallback((userId: string) => {
    if (userId === currentUserId) {
      return null;
    }

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % (theme.palette.mode === 'dark' ? darkModeColors.length : lightModeColors.length);
    
    return theme.palette.mode === 'dark' ? darkModeColors[index] : lightModeColors[index];
  }, [currentUserId, theme.palette.mode]);

  const handleBackToLobby = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.push('/rooms');
    }
  }, [onBack, router]);

  const handleEditClick = useCallback(() => {
    if (room) {
      setEditRoomName(room.name);
      setEditDialogOpen(true);
    }
  }, [room]);

  const handleEditSave = useCallback(() => {
    if (room && editRoomName.trim()) {
      socketRef.current?.emit('room:update', {
        roomId: (room as any).id || (room as any)._id,
        name: editRoomName.trim(),
      });
    }
  }, [room, editRoomName]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (room) {
      socketRef.current?.emit('room:delete', { roomId: (room as any).id || (room as any)._id });
    }
  }, [room]);

  const handleEditClose = useCallback(() => {
    setEditDialogOpen(false);
    setEditRoomName('');
  }, []);

  const handleDeleteClose = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  if (roomLoading || isLoadingMessages) {
    return (
      <Box sx={styles.loading}>
        <CircularProgress />
      </Box>
    );
  }

  if (!room) {
    return (
      <Box sx={styles.container}>
        <Alert severity="error">Room not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.toolbar}>
        {!isLobby && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToLobby}
            sx={styles.headerButton}
          >
            Back to Lobby
          </Button>
        )}
        <Typography variant="h6" sx={styles.headerTitle}>
          {room.name}
        </Typography>
        <Box sx={styles.spacer} />
        {room.createdBy === currentUserId && !(room as any).isLobby && (
          <>
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <UserProfile />
        <DarkModeToggle />
        <Button
          startIcon={<LogoutIcon />}
          onClick={logout}
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.5)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Content area with sidebar on left and chat in middle */}
      <Box sx={styles.contentContainer}>
        {/* Users list on the left */}
        <Box sx={styles.sidebar}>
          <UserList
            participants={room.participants}
            onlineUsers={onlineUsers}
            currentUserId={currentUserId || undefined}
            onUserClick={handleUserClick}
            isLobby={isLobby}
          />
        </Box>

        {/* Chat window in the middle */}
        <Box sx={styles.container}>
          <Box sx={styles.messagesContainer}>
            <List sx={styles.messagesList}>
              {messages.map((msg) => {
                const own = isOwnMessage(msg);
                const userColor = getUserMessageColor(msg.userId);
                
                
                const bubbleStyles: any = {
                  ...styles.messageBubble,
                  alignSelf: own ? 'flex-end' : 'flex-start',
                };

                if (own) {
                  bubbleStyles.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
                  bubbleStyles.color = 'white';
                } else {
                  if (userColor) {
                    bubbleStyles.background = userColor.bg;
                    bubbleStyles.backgroundColor = userColor.bg;
                    bubbleStyles.color = userColor.text;
                    bubbleStyles.border = `1.5px solid ${userColor.border}`;
                  } else {
                    bubbleStyles.backgroundColor = theme.palette.mode === 'dark' ? '#1e293b' : '#ffffff';
                    bubbleStyles.color = theme.palette.mode === 'dark' ? 'white' : '#0f172a';
                    bubbleStyles.border = `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'}`;
                  }
                }

                
                const contentStyles: any = {
                  ...styles.messageContent,
                };
                if (own) {
                  contentStyles.color = 'white !important';
                } else if (userColor) {
                  contentStyles.color = `${userColor.text} !important`;
                } else {
                  contentStyles.color = theme.palette.mode === 'dark' ? 'white !important' : '#0f172a !important';
                }

                
                const timeStyles: any = {
                  ...styles.messageTime,
                };
                if (own) {
                  timeStyles.color = 'rgba(255, 255, 255, 0.8) !important';
                } else if (userColor) {
                  
                  const hex = userColor.text.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16);
                  const g = parseInt(hex.substring(2, 4), 16);
                  const b = parseInt(hex.substring(4, 6), 16);
                  timeStyles.color = `rgba(${r}, ${g}, ${b}, 0.8) !important`;
                } else {
                  timeStyles.color = theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.8) !important' : '#64748b !important';
                }

                return (
                  <ListItem
                    key={msg.id}
                    sx={{
                      ...styles.messageItem,
                      alignItems: own ? 'flex-end' : 'flex-start',
                    }}
                  >
                <Box sx={bubbleStyles}>
                  <Typography variant="body2" sx={contentStyles}>
                    {msg.content}
                  </Typography>
                  <Typography variant="caption" sx={timeStyles}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input and send button at the bottom of chat area */}
          {error && (
            <Alert severity="error" sx={styles.alert}>
              {error}
            </Alert>
          )}
          <Box sx={styles.inputContainer}>
            <Box component="form" onSubmit={handleSend} sx={styles.inputForm}>
              <TextField
                fullWidth
                value={message}
                onChange={handleMessageChange}
                placeholder="Type a message..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: '10px', sm: '12px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                disabled={!message.trim()}
                sx={styles.sendButton}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Send
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>
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
            onChange={handleEditRoomNameChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (editRoomName.trim() && socketRef.current) {
                socketRef.current.emit('room:update', {
                  roomId,
                  name: editRoomName.trim(),
                });
              }
            }}
            variant="contained"
            disabled={!editRoomName.trim() || editRoomName.trim() === room?.name}
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
          <Button
            onClick={() => {
              if (socketRef.current) {
                socketRef.current.emit('room:delete', { roomId });
              }
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

