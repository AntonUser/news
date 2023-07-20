import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, playload: JwtPayload) {
    const user = await this.userRepository.findOneBy({ id: +playload.sub });
    if (!user) {
      return false;
    }
    const refreshToken = (req.get('authorization') || '')
      .replace('Bearer', '')
      .trim();
    return {
      ...playload,
      refreshToken,
    };
  }
}
