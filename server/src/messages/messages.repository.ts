import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class MessagesRepository {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  async create(messageData: { roomId: string; userId: string; content: string }): Promise<Message> {
    const message = new this.messageModel(messageData);
    return message.save();
  }

  async findByRoom(roomId: string, limit: number = 50): Promise<Message[]> {
    return this.messageModel
      .find({ roomId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

