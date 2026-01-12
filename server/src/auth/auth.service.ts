import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const existingUsername = await this.usersRepository.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      password: hashedPassword,
    });

    const payload = {
      sub: user._id.toString(),
      username: user.username || user.name || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        username: user.username || user.name || user.email.split('@')[0],
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username || user.name || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        username: user.username || user.name || user.email.split('@')[0],
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      username: user.username || user.name || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user._id.toString(),
      username: user.username || user.name || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthUser(oauthData: {
    email: string;
    name?: string;
    photoUrl?: string;
    provider: string;
    providerId: string;
  }) {
    const user = await this.usersRepository.createOrUpdateOAuthUser(oauthData);
    const payload = {
      sub: user._id.toString(),
      username: user.username || user.name || user.email.split('@')[0],
      email: user.email,
      name: user.name,
      photoUrl: user.photoUrl,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        username: user.username || user.name || user.email.split('@')[0],
        email: user.email,
        name: user.name,
        photoUrl: user.photoUrl,
      },
    };
  }
}

