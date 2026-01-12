import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages/messages.service';
import { RoomsService } from './rooms/rooms.service';
import { AuthService } from './auth/auth.service';
import {
  RoomCreatePayload,
  RoomJoinPayload,
  RoomLeavePayload,
  MessageSendPayload,
  MessageNewPayload,
  PresenceUpdatePayload,
  ErrorPayload,
  RoomHistoryPayload,
  RoomListResponse,
  RoomUpdatePayload,
  RoomDeletePayload,
  RoomCreatedPayload,
  PrivateChatCreatePayload,
} from './app.gateway.types';
import { BadRequestException, Logger } from '@nestjs/common';
interface OnlineUser {
  userId: string;
  username: string;
  name?: string;
  photoUrl?: string;
  socketId: string;
}
@WebSocketGateway({
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CLIENT_URL 
        ? process.env.CLIENT_URL.split(',')
        : [];
      // Allow localhost on any port in development
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(AppGateway.name);
  private roomUsers = new Map<string, Set<string>>();
  private userInfo = new Map<string, OnlineUser>();
  private userRooms = new Map<string, Set<string>>();
  private roomMessageHistory = new Map<string, MessageNewPayload[]>();
  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
    private roomsService: RoomsService,
    private authService: AuthService
  ) {}
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.emitError(client, 'Authentication required');
        client.disconnect();
        return;
      }
      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;
      const username = payload.username || payload.name || userId;
      const name = payload.name;
      const photoUrl = payload.photoUrl;
      const user = await this.authService.validateUser(userId);
      if (!user) {
        this.emitError(client, 'User not found');
        client.disconnect();
        return;
      }
      client.data.userId = userId;
      client.data.username = username;
      client.data.name = name;
      client.data.photoUrl = photoUrl;
      this.userInfo.set(userId, {
        userId,
        username,
        name,
        photoUrl,
        socketId: client.id,
      });
      if (!this.userRooms.has(userId)) {
        this.userRooms.set(userId, new Set());
      }
      try {
        const lobby = await this.roomsService.findOrCreateLobby();
        const lobbyId = lobby._id.toString();
        client.join(lobbyId);
        this.addUserToRoom(userId, lobbyId);
        this.emitPresenceUpdate(lobbyId);
      } catch (error) {
        this.logger.error(`Error joining lobby: ${error.message}`);
      }
      this.logger.log(`User ${username} (${userId}) connected`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      this.emitError(client, 'Invalid authentication token');
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (!userId) return;
    const username = client.data.username || userId;
    this.logger.log(`User ${username} (${userId}) disconnected`);
    const userRooms = this.userRooms.get(userId);
    if (userRooms) {
      userRooms.forEach((roomId) => {
        this.removeUserFromRoom(userId, roomId);
        this.emitPresenceUpdate(roomId);
      });
      this.userRooms.delete(userId);
    }
    this.userInfo.delete(userId);
  }
  private addUserToRoom(userId: string, roomId: string) {
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set());
    }
    this.roomUsers.get(roomId)!.add(userId);
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId)!.add(roomId);
  }
  private removeUserFromRoom(userId: string, roomId: string) {
    const roomUserSet = this.roomUsers.get(roomId);
    if (roomUserSet) {
      roomUserSet.delete(userId);
      if (roomUserSet.size === 0) {
        this.roomUsers.delete(roomId);
      }
    }
    const userRoomSet = this.userRooms.get(userId);
    if (userRoomSet) {
      userRoomSet.delete(roomId);
    }
  }
  private getOnlineUsersForRoom(roomId: string): OnlineUser[] {
    const userIds = this.roomUsers.get(roomId);
    if (!userIds || userIds.size === 0) {
      return [];
    }
    return Array.from(userIds)
      .map((userId) => this.userInfo.get(userId))
      .filter((user): user is OnlineUser => user !== undefined);
  }
  private emitError(client: Socket, message: string, code?: string) {
    const error: ErrorPayload = { message, code };
    client.emit('error', error);
  }
  private emitPresenceUpdate(roomId: string) {
    const users = this.getOnlineUsersForRoom(roomId);
    const payload: PresenceUpdatePayload = { roomId, users };
    this.server.to(roomId).emit('presence:update', payload);
    this.server.emit('presence:update', payload);
  }
  @SubscribeMessage('room:create')
  async handleRoomCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomCreatePayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      this.emitError(client, 'Room name is required and must be a non-empty string', 'VALIDATION_ERROR');
      return;
    }
    if (payload.name.length > 100) {
      this.emitError(client, 'Room name must be 100 characters or less', 'VALIDATION_ERROR');
      return;
    }
    try {
      const room = await this.roomsService.create({ name: payload.name.trim() }, userId);
      const roomData: RoomCreatedPayload = {
        id: room._id.toString(),
        name: room.name,
        participants: room.participants,
        createdBy: (room as any).createdBy,
        createdAt: (room as any).createdAt?.toISOString() || new Date().toISOString(),
        isPrivate: (room as any).isPrivate || false,
        isLobby: (room as any).isLobby || false,
      };
      const allUserIds = Array.from(this.userInfo.keys());
      allUserIds.forEach((uid) => {
        const user = this.userInfo.get(uid);
        if (user) {
          const socket = this.server.sockets.sockets.get(user.socketId);
          if (socket) {
            socket.emit('room:created', roomData);
          }
        }
      });
      client.join(room._id.toString());
      this.addUserToRoom(userId, room._id.toString());
      this.emitPresenceUpdate(room._id.toString());
      const history: RoomHistoryPayload = {
        roomId: room._id.toString(),
        messages: [],
      };
      client.emit('room:history', history);
    } catch (error) {
      this.logger.error(`Error creating room: ${error.message}`);
      this.emitError(client, 'Failed to create room', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('private:chat:create')
  async handlePrivateChatCreate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PrivateChatCreatePayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.otherUserId !== 'string' || payload.otherUserId.trim().length === 0) {
      this.emitError(client, 'Other user ID is required', 'VALIDATION_ERROR');
      return;
    }
    if (payload.otherUserId === userId) {
      this.emitError(client, 'Cannot create private chat with yourself', 'VALIDATION_ERROR');
      return;
    }
    try {
      const otherUser = await this.authService.validateUser(payload.otherUserId);
      if (!otherUser) {
        this.emitError(client, 'User not found', 'NOT_FOUND');
        return;
      }
      const otherUserName = payload.otherUserName || otherUser.name || otherUser.username || 'User';
      const room = await this.roomsService.findOrCreatePrivateRoom(
        userId,
        payload.otherUserId,
        otherUserName
      );
      const roomData: RoomCreatedPayload = {
        id: room._id.toString(),
        name: otherUserName,
        participants: room.participants,
        createdBy: (room as any).createdBy,
        createdAt: (room as any).createdAt?.toISOString() || new Date().toISOString(),
        isPrivate: true,
      };
      const allUserIds = [userId, payload.otherUserId];
      allUserIds.forEach((uid) => {
        const user = this.userInfo.get(uid);
        if (user) {
          const socket = this.server.sockets.sockets.get(user.socketId);
          if (socket) {
            socket.emit('room:created', roomData);
          }
        }
      });
      client.join(room._id.toString());
      this.addUserToRoom(userId, room._id.toString());
      const otherUserInfo = this.userInfo.get(payload.otherUserId);
      if (otherUserInfo) {
        const otherSocket = this.server.sockets.sockets.get(otherUserInfo.socketId);
        if (otherSocket) {
          otherSocket.join(room._id.toString());
          this.addUserToRoom(payload.otherUserId, room._id.toString());
        }
      }
      this.emitPresenceUpdate(room._id.toString());
      const messages = await this.messagesService.findByRoom(room._id.toString(), userId);
      const history: RoomHistoryPayload = {
        roomId: room._id.toString(),
        messages: messages.map((msg) => ({
          id: msg.id,
          roomId: room._id.toString(),
          userId: msg.userId,
          content: msg.content,
          createdAt: msg.createdAt?.toISOString() || new Date().toISOString(),
        })),
      };
      client.emit('room:history', history);
      client.emit('private:chat:created', { roomId: room._id.toString() });
    } catch (error) {
      this.logger.error(`Error creating private chat: ${error.message}`);
      this.emitError(client, 'Failed to create private chat', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('room:list')
  async handleRoomList(@ConnectedSocket() client: Socket) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    try {
      const rooms = await this.roomsService.findAll(userId);
      const response: RoomListResponse = {
        rooms: rooms.map((room) => ({
          id: room._id.toString(),
          name: room.name,
          participants: room.participants,
          createdBy: (room as any).createdBy,
          createdAt: (room as any).createdAt?.toISOString() || new Date().toISOString(),
          isPrivate: (room as any).isPrivate || false,
          isLobby: (room as any).isLobby || false,
        })),
      };
      client.emit('room:list', response);
      const roomsToUpdate: string[] = [];
      rooms.forEach((room) => {
        const roomId = room._id.toString();
        const wasInRoom = client.rooms.has(roomId);
        if (!wasInRoom) {
          client.join(roomId);
        }
        if (!this.userRooms.get(userId)?.has(roomId)) {
          this.addUserToRoom(userId, roomId);
          roomsToUpdate.push(roomId);
        }
      });
      roomsToUpdate.forEach((roomId) => {
        this.emitPresenceUpdate(roomId);
      });
      rooms.forEach((room) => {
        const users = this.getOnlineUsersForRoom(room._id.toString());
        const payload: PresenceUpdatePayload = {
          roomId: room._id.toString(),
          users,
        };
        client.emit('presence:update', payload);
      });
    } catch (error) {
      this.logger.error(`Error listing rooms: ${error.message}`);
      this.emitError(client, 'Failed to list rooms', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('room:join')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomJoinPayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.roomId !== 'string' || payload.roomId.trim().length === 0) {
      this.emitError(client, 'Room ID is required', 'VALIDATION_ERROR');
      return;
    }
    try {
      const room = await this.roomsService.findOne(payload.roomId, userId);
      if (!(room as any).isLobby && !room.participants.includes(userId)) {
        await this.roomsService.joinRoom(payload.roomId, userId);
      }
      client.join(payload.roomId);
      if (!this.userRooms.get(userId)?.has(payload.roomId)) {
        this.addUserToRoom(userId, payload.roomId);
        this.emitPresenceUpdate(payload.roomId);
      }
      const messages = await this.messagesService.findByRoom(payload.roomId, userId);
      const history: RoomHistoryPayload = {
        roomId: payload.roomId,
        messages: messages.map((msg) => ({
          id: msg.id,
          roomId: msg.roomId,
          userId: msg.userId,
          content: msg.content,
          createdAt: msg.createdAt?.toISOString() || new Date().toISOString(),
        })),
      };
      client.emit('room:history', history);
      this.roomMessageHistory.set(payload.roomId, history.messages.slice(-100));
    } catch (error) {
      this.logger.error(`Error joining room: ${error.message}`);
      this.emitError(client, error.message || 'Failed to join room', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('room:leave')
  handleRoomLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomLeavePayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.roomId !== 'string' || payload.roomId.trim().length === 0) {
      this.emitError(client, 'Room ID is required', 'VALIDATION_ERROR');
      return;
    }
    client.leave(payload.roomId);
    this.removeUserFromRoom(userId, payload.roomId);
    this.emitPresenceUpdate(payload.roomId);
  }
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessageSendPayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.roomId !== 'string' || payload.roomId.trim().length === 0) {
      this.emitError(client, 'Room ID is required', 'VALIDATION_ERROR');
      return;
    }
    if (!payload.content || typeof payload.content !== 'string' || payload.content.trim().length === 0) {
      this.emitError(client, 'Message content is required and must be a non-empty string', 'VALIDATION_ERROR');
      return;
    }
    if (payload.content.length > 5000) {
      this.emitError(client, 'Message content must be 5000 characters or less', 'VALIDATION_ERROR');
      return;
    }
    try {
      const room = await this.roomsService.findOne(payload.roomId, userId);
      const message = await this.messagesService.create({
        roomId: payload.roomId,
        userId,
        content: payload.content.trim(),
      });
      const messagePayload: MessageNewPayload = {
        id: message.id,
        roomId: message.roomId,
        userId: message.userId,
        content: message.content,
        createdAt: message.createdAt?.toISOString() || new Date().toISOString(),
      };
      this.server.to(payload.roomId).emit('message:new', messagePayload);
      const history = this.roomMessageHistory.get(payload.roomId) || [];
      history.push(messagePayload);
      if (history.length > 100) {
        history.shift();
      }
      this.roomMessageHistory.set(payload.roomId, history);
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      this.emitError(client, error.message || 'Failed to send message', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('room:update')
  async handleRoomUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomUpdatePayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.roomId !== 'string' || payload.roomId.trim().length === 0) {
      this.emitError(client, 'Room ID is required', 'VALIDATION_ERROR');
      return;
    }
    if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      this.emitError(client, 'Room name is required and must be a non-empty string', 'VALIDATION_ERROR');
      return;
    }
    if (payload.name.length > 100) {
      this.emitError(client, 'Room name must be 100 characters or less', 'VALIDATION_ERROR');
      return;
    }
    try {
      const room = await this.roomsService.update(payload.roomId, { name: payload.name.trim() }, userId);
      const roomData = {
        id: room._id.toString(),
        name: room.name,
        participants: room.participants,
        createdBy: (room as any).createdBy,
        createdAt: (room as any).createdAt?.toISOString() || new Date().toISOString(),
        isPrivate: (room as any).isPrivate || false,
        isLobby: (room as any).isLobby || false,
      };
      const allUserIds = Array.from(this.userInfo.keys());
      allUserIds.forEach((uid) => {
        const user = this.userInfo.get(uid);
        if (user) {
          const socket = this.server.sockets.sockets.get(user.socketId);
          if (socket) {
            socket.emit('room:updated', roomData);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Error updating room: ${error.message}`);
      this.emitError(client, error.message || 'Failed to update room', 'SERVER_ERROR');
    }
  }
  @SubscribeMessage('room:delete')
  async handleRoomDelete(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: RoomDeletePayload
  ) {
    const userId = client.data.userId;
    if (!userId) {
      this.emitError(client, 'Authentication required', 'UNAUTHORIZED');
      return;
    }
    if (!payload || typeof payload.roomId !== 'string' || payload.roomId.trim().length === 0) {
      this.emitError(client, 'Room ID is required', 'VALIDATION_ERROR');
      return;
    }
    try {
      await this.roomsService.remove(payload.roomId, userId);
      this.roomMessageHistory.delete(payload.roomId);
      const roomUserSet = this.roomUsers.get(payload.roomId);
      if (roomUserSet) {
        roomUserSet.forEach((uid) => {
          this.userRooms.get(uid)?.delete(payload.roomId);
        });
        this.roomUsers.delete(payload.roomId);
      }
      const allUserIds = Array.from(this.userInfo.keys());
      allUserIds.forEach((uid) => {
        const user = this.userInfo.get(uid);
        if (user) {
          const socket = this.server.sockets.sockets.get(user.socketId);
          if (socket) {
            socket.emit('room:deleted', { roomId: payload.roomId });
          }
        }
      });
    } catch (error) {
      this.logger.error(`Error deleting room: ${error.message}`);
      this.emitError(client, error.message || 'Failed to delete room', 'SERVER_ERROR');
    }
  }
}