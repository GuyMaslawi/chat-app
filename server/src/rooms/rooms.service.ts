import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/room.schema';

@Injectable()
export class RoomsService {
  constructor(private roomsRepository: RoomsRepository) {}

  async create(createRoomDto: CreateRoomDto, userId: string) {
    return this.roomsRepository.create({
      name: createRoomDto.name,
      participants: [userId],
      createdBy: userId,
      isPrivate: false,
      isLobby: false,
    });
  }

  async findOrCreateLobby(): Promise<Room> {
    let lobby = await this.roomsRepository.findLobby();
    
    if (!lobby) {
      const existingLobbyByName = await this.roomsRepository.findByName('Lobby');
      
      if (existingLobbyByName && !existingLobbyByName.isPrivate) {
        lobby = await this.roomsRepository.updateById(existingLobbyByName._id.toString(), { 
          isLobby: true 
        });
        if (!lobby) lobby = existingLobbyByName;
      } else {
        lobby = await this.roomsRepository.create({
          name: 'Lobby',
          participants: [],
          createdBy: 'system',
          isPrivate: false,
          isLobby: true,
        });
      }
    }
    
    return lobby;
  }

  async findOrCreatePrivateRoom(userId1: string, userId2: string, otherUserName: string): Promise<Room> {
    const existingRoom = await this.roomsRepository.findPrivateRoom(userId1, userId2);
    if (existingRoom) {
      return existingRoom;
    }

    return this.roomsRepository.create({
      name: otherUserName,
      participants: [userId1, userId2],
      createdBy: userId1,
      isPrivate: true,
    });
  }

  async findAll(userId: string) {
    const rooms = await this.roomsRepository.findAll(userId);
    const lobby = await this.findOrCreateLobby();
    const lobbyId = lobby._id.toString();
    const lobbyInList = rooms.find(r => {
      const roomId = typeof r._id === 'string' ? r._id : r._id.toString();
      return roomId === lobbyId;
    });
    if (!lobbyInList) {
      rooms.unshift(lobby);
    } else {
      const lobbyIndex = rooms.findIndex(r => {
        const roomId = typeof r._id === 'string' ? r._id : r._id.toString();
        return roomId === lobbyId;
      });
      if (lobbyIndex >= 0) {
        rooms[lobbyIndex] = lobby;
      }
    }
    return rooms;
  }

  async findOne(id: string, userId: string) {
    const room = await this.roomsRepository.findById(id);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if (!(room as any).isLobby && !room.participants.includes(userId)) {
      throw new ForbiddenException('You are not a participant of this room');
    }
    return room;
  }

  async joinRoom(roomId: string, userId: string) {
    const room = await this.roomsRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return this.roomsRepository.addParticipant(roomId, userId);
  }

  async update(roomId: string, updateData: { name: string }, userId: string) {
    const room = await this.roomsRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if ((room as any).isLobby) {
      throw new ForbiddenException('Cannot edit the lobby room');
    }
    if (room.createdBy !== userId) {
      throw new ForbiddenException('Only the room creator can edit the room');
    }
    return this.roomsRepository.update(roomId, updateData);
  }

  async remove(roomId: string, userId: string) {
    const room = await this.roomsRepository.findById(roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    if ((room as any).isLobby) {
      throw new ForbiddenException('Cannot delete the lobby room');
    }
    if (room.createdBy !== userId) {
      throw new ForbiddenException('Only the room creator can delete the room');
    }
    return this.roomsRepository.delete(roomId);
  }
}

