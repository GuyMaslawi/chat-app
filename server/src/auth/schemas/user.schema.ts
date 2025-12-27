import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: false, unique: true, sparse: true })
  username?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: false })
  name?: string;

  @Prop({ required: false })
  photoUrl?: string;

  @Prop({ required: false, enum: ['local', 'google', 'microsoft'] })
  provider?: string;

  @Prop({ required: false })
  providerId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

