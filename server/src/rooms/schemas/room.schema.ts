import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ required: true })
  createdBy: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ default: false })
  isLobby: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

