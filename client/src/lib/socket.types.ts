
export interface RoomCreatePayload {
  name: string;
}

export interface RoomListResponse {
  rooms: Array<{
    id: string;
    name: string;
    participants: string[];
    createdBy?: string;
    createdAt: string;
    isPrivate?: boolean;
    isLobby?: boolean;
  }>;
}

export interface RoomUpdatePayload {
  roomId: string;
  name: string;
}

export interface RoomDeletePayload {
  roomId: string;
}

export interface RoomUpdatedPayload {
  id: string;
  name: string;
  participants: string[];
  createdBy?: string;
  createdAt: string;
  isPrivate?: boolean;
  isLobby?: boolean;
}

export interface RoomDeletedPayload {
  roomId: string;
}

export interface RoomCreatedPayload {
  id: string;
  name: string;
  participants: string[];
  createdBy?: string;
  createdAt: string;
  isPrivate?: boolean;
  isLobby?: boolean;
}

export interface PrivateChatCreatePayload {
  otherUserId: string;
  otherUserName?: string;
}

export interface PrivateChatCreatedPayload {
  roomId: string;
}

export interface RoomJoinPayload {
  roomId: string;
}

export interface RoomLeavePayload {
  roomId: string;
}

export interface MessageSendPayload {
  roomId: string;
  content: string;
}

export interface MessageNewPayload {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface PresenceUpdatePayload {
  roomId: string;
  users: Array<{
    userId: string;
    username: string;
    name?: string;
    photoUrl?: string;
    socketId: string;
  }>;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

export interface RoomHistoryPayload {
  roomId: string;
  messages: MessageNewPayload[];
}

