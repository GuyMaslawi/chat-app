import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from './app.gateway';
import { MessagesService } from './messages/messages.service';
import { RoomsService } from './rooms/rooms.service';
import { AuthService } from './auth/auth.service';
import { Server, Socket } from 'socket.io';

describe('AppGateway', () => {
  let gateway: AppGateway;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockMessagesService: jest.Mocked<MessagesService>;
  let mockRoomsService: jest.Mocked<RoomsService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockServer: Partial<Server>;
  let mockSocket: Partial<Socket>;

  beforeEach(async () => {
    mockJwtService = {
      verifyAsync: jest.fn(),
      sign: jest.fn(),
    } as any;

    mockMessagesService = {
      create: jest.fn(),
      findByRoom: jest.fn(),
    } as any;

    mockRoomsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      joinRoom: jest.fn(),
    } as any;

    mockAuthService = {
      validateUser: jest.fn(),
    } as any;

    mockServer = {
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      sockets: {
        sockets: new Map(),
      } as any,
    };

    mockSocket = {
      id: 'socket-123',
      handshake: {
        auth: { token: 'valid-token' },
      } as any,
      data: {},
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppGateway,
        { provide: JwtService, useValue: mockJwtService },
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: RoomsService, useValue: mockRoomsService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    gateway = module.get<AppGateway>(AppGateway);
    gateway.server = mockServer as Server;
  });

  describe('handleConnection', () => {
    it('should reject connection without token', async () => {
      const socket = { ...mockSocket, handshake: { auth: {} } } as Socket;
      const emitError = jest.spyOn(gateway as any, 'emitError').mockImplementation(() => {});

      await gateway.handleConnection(socket as Socket);

      expect(emitError).toHaveBeenCalledWith(socket, 'Authentication required');
      expect(socket.disconnect).toHaveBeenCalled();
    });

    it('should accept connection with valid token', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-123',
        username: 'testuser',
        name: 'Test User',
        photoUrl: 'https://example.com/photo.jpg',
      });
      mockAuthService.validateUser.mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        photoUrl: 'https://example.com/photo.jpg',
      });

      await gateway.handleConnection(mockSocket as Socket);

      expect(mockSocket.data.userId).toBe('user-123');
      expect(mockSocket.data.username).toBe('testuser');
    });

    it('should reject connection with invalid token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      const emitError = jest.spyOn(gateway as any, 'emitError').mockImplementation(() => {});

      await gateway.handleConnection(mockSocket as Socket);

      expect(emitError).toHaveBeenCalledWith(mockSocket, 'Invalid authentication token');
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('room:create', () => {
    beforeEach(async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-123',
        username: 'testuser',
      });
      mockAuthService.validateUser.mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        photoUrl: undefined,
      });
      await gateway.handleConnection(mockSocket as Socket);
    });

    it('should create a room with valid payload', async () => {
      const room = {
        _id: { toString: () => 'room-123' },
        name: 'Test Room',
        participants: ['user-123'],
        createdAt: new Date(),
      };
      mockRoomsService.create.mockResolvedValue(room as any);

      await gateway.handleRoomCreate(mockSocket as Socket, { name: 'Test Room' });

      expect(mockRoomsService.create).toHaveBeenCalledWith({ name: 'Test Room' }, 'user-123');
      expect(mockSocket.join).toHaveBeenCalledWith('room-123');
    });

    it('should reject room creation with invalid payload', async () => {
      const emitError = jest.spyOn(gateway as any, 'emitError').mockImplementation(() => {});

      await gateway.handleRoomCreate(mockSocket as Socket, { name: '' });

      expect(emitError).toHaveBeenCalledWith(
        mockSocket,
        'Room name is required and must be a non-empty string',
        'VALIDATION_ERROR'
      );
      expect(mockRoomsService.create).not.toHaveBeenCalled();
    });
  });

  describe('message:send', () => {
    beforeEach(async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: 'user-123',
        username: 'testuser',
      });
      mockAuthService.validateUser.mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        name: 'Test User',
        photoUrl: undefined,
      });
      await gateway.handleConnection(mockSocket as Socket);
    });

    it('should send a message with valid payload', async () => {
      const room = {
        _id: { toString: () => 'room-123' },
        name: 'Test Room',
        participants: ['user-123'],
      };
      mockRoomsService.findOne.mockResolvedValue(room as any);
      mockMessagesService.create.mockResolvedValue({
        id: 'msg-123',
        roomId: 'room-123',
        userId: 'user-123',
        content: 'Hello',
        createdAt: new Date(),
      } as any);

      await gateway.handleMessage(mockSocket as Socket, {
        roomId: 'room-123',
        content: 'Hello',
      });

      expect(mockMessagesService.create).toHaveBeenCalledWith({
        roomId: 'room-123',
        userId: 'user-123',
        content: 'Hello',
      });
      expect(mockServer.to).toHaveBeenCalledWith('room-123');
    });

    it('should reject message with empty content', async () => {
      const emitError = jest.spyOn(gateway as any, 'emitError').mockImplementation(() => {});

      await gateway.handleMessage(mockSocket as Socket, {
        roomId: 'room-123',
        content: '',
      });

      expect(emitError).toHaveBeenCalledWith(
        mockSocket,
        'Message content is required and must be a non-empty string',
        'VALIDATION_ERROR'
      );
    });
  });
});

