import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// The JwtStrategy class extends the PassportStrategy class from the @nestjs/passport package.
// The validate() method is called when the user is authenticated and returns the user object (append in the request).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_KEY'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, username: payload.username, role: payload.role };
  }
}