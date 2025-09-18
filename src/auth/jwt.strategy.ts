import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // 1. Check for cookie
          if (req?.cookies?.accessToken) {
            return req.cookies.accessToken;
          }

          // 2. Fallback: check Authorization header
          if (req?.headers?.authorization?.startsWith('Bearer ')) {
            return req.headers.authorization.split(' ')[1];
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret',
    });
  }

  async validate(payload: any) {
    return {
      reg_id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
