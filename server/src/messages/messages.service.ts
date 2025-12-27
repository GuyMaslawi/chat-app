import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository,
    private roomsService: RoomsService
  ) {}

  async create(createMessageDto: { roomId: string; userId: string; content: string }) {
    await this.roomsService.findOne(createMessageDto.roomId, createMessageDto.userId);
    const message = await this.messagesRepository.create(createMessageDto);
    return {
      id: message._id.toString(),
      roomId: message.roomId,
      userId: message.userId,
      content: message.content,
      createdAt: message.createdAt,
    };
  }

  async findByRoom(roomId: string, userId: string) {
    await this.roomsService.findOne(roomId, userId);
    const messages = await this.messagesRepository.findByRoom(roomId);
    return messages
      .reverse()
      .map((msg) => ({
        id: msg._id.toString(),
        roomId: msg.roomId,
        userId: msg.userId,
        content: msg.content,
        createdAt: msg.createdAt,
      }));
  }
}

