import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private authService: AuthService
  ) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'dummy';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'dummy';
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL') || '/auth/google/callback';
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = await this.authService.validateOAuthUser({
      email: emails[0].value,
      name: name?.givenName && name?.familyName ? `${name.givenName} ${name.familyName}` : name?.displayName || emails[0].value.split('@')[0],
      photoUrl: photos?.[0]?.value,
      provider: 'google',
      providerId: profile.id,
    });
    done(null, user);
  }
}

