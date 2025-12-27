import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';

@Injectable()
export class RoomsRepository {
  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async create(roomData: { name: string; participants: string[]; createdBy: string; isPrivate?: boolean; isLobby?: boolean }): Promise<Room> {
    const room = new this.roomModel(roomData);
    return room.save();
  }

  async findLobby(): Promise<Room | null> {
    return this.roomModel.findOne({ isLobby: true }).exec();
  }

  async findByName(name: string): Promise<Room | null> {
    return this.roomModel.findOne({ name }).exec();
  }

  async updateById(roomId: string, updateData: any): Promise<Room | null> {
    return this.roomModel.findByIdAndUpdate(roomId, { $set: updateData }, { new: true }).exec();
  }

  async findAll(userId: string): Promise<Room[]> {
    return this.roomModel.find({ participants: userId }).exec();
  }

  async findById(id: string): Promise<Room | null> {
    return this.roomModel.findById(id).exec();
  }

  async findPrivateRoom(userId1: string, userId2: string): Promise<Room | null> {
    return this.roomModel
      .findOne({
        isPrivate: true,
        participants: { $all: [userId1, userId2], $size: 2 },
      })
      .exec();
  }

  async addParticipant(roomId: string, userId: string): Promise<Room | null> {
    return this.roomModel
      .findByIdAndUpdate(roomId, { $addToSet: { participants: userId } }, { new: true })
      .exec();
  }

  async update(roomId: string, updateData: { name: string }): Promise<Room | null> {
    return this.roomModel.findByIdAndUpdate(roomId, updateData, { new: true }).exec();
  }

  async delete(roomId: string): Promise<Room | null> {
    return this.roomModel.findByIdAndDelete(roomId).exec();
  }
}

