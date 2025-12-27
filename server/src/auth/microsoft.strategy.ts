import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-microsoft';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    configService: ConfigService,
    private authService: AuthService
  ) {
    const clientID = configService.get<string>('MICROSOFT_CLIENT_ID') || 'dummy';
    const clientSecret = configService.get<string>('MICROSOFT_CLIENT_SECRET') || 'dummy';
    const callbackURL = configService.get<string>('MICROSOFT_CALLBACK_URL') || '/auth/microsoft/callback';
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user.read'],
      tenant: 'common',
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
      email: emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName,
      name: name?.givenName && name?.familyName ? `${name.givenName} ${name.familyName}` : name?.displayName || profile._json?.displayName || emails?.[0]?.value?.split('@')[0] || 'User',
      photoUrl: photos?.[0]?.value,
      provider: 'microsoft',
      providerId: profile.id,
    });
    done(null, user);
  }
}

