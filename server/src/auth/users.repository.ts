import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: { username: string; email: string; password: string }): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByProviderId(provider: string, providerId: string): Promise<User | null> {
    return this.userModel.findOne({ provider, providerId }).exec();
  }

  async createOrUpdateOAuthUser(userData: {
    email: string;
    name?: string;
    photoUrl?: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    const existing = await this.findByProviderId(userData.provider, userData.providerId);
    if (existing) {
      existing.name = userData.name || existing.name;
      existing.photoUrl = userData.photoUrl || existing.photoUrl;
      existing.email = userData.email;
      return existing.save();
    }

    const existingByEmail = await this.findByEmail(userData.email);
    if (existingByEmail) {
      existingByEmail.provider = userData.provider;
      existingByEmail.providerId = userData.providerId;
      existingByEmail.name = userData.name || existingByEmail.name;
      existingByEmail.photoUrl = userData.photoUrl || existingByEmail.photoUrl;
      return existingByEmail.save();
    }

    const user = new this.userModel({
      email: userData.email,
      name: userData.name,
      photoUrl: userData.photoUrl,
      provider: userData.provider,
      providerId: userData.providerId,
      username: userData.email.split('@')[0] + '_' + Date.now(),
    });
    return user.save();
  }
}

