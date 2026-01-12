import { Controller, Post, Body, Get, UseGuards, Req, Res, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.refreshToken(user.id);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    if (!clientID || !clientSecret || clientID === 'dummy' || clientSecret === 'dummy') {
      throw new BadRequestException('Google OAuth is not configured');
    }
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const result = req.user as any;
    const clientUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';
    if (!result || !result.access_token) {
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
    const redirectUrl = `${clientUrl}/auth/callback?token=${result.access_token}`;
    return res.redirect(redirectUrl);
  }

}

