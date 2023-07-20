import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from './dto/tokens.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: RegisterDto) {
    const user = await this.userService.create(dto);
    return this.#getTokens(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmailOrFail(dto.email);
    if (!user) {
      throw new NotFoundException(
        'Пользователь с указанным адресом электронной почты не найден',
      );
    }

    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException('Неверный пароль');
    }

    return this.#getTokens(user.id);
  }

  async updateAccessToken(req: Request) {
    const refreshToken = (req.get('authorization') || '')
      .replace('Bearer', '')
      .trim();
    const playload = this.jwtService.decode(refreshToken) as jwt.JwtPayload;
    const at = await this.jwtService.signAsync(
      {
        sub: playload.sub,
        role: playload.role,
      },
      {
        secret: process.env.ACCESS_JWT_SECRET,
        expiresIn: process.env.ACCESS_JWT_EXP || '3m',
      },
    );

    return {
      accessToken: at,
    };
  }

  async #getTokens(userId: number): Promise<TokensDto> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.ACCESS_JWT_SECRET,
          expiresIn: process.env.ACCESS_JWT_EXP || '3m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.REFRESH_JWT_SECRET,
          expiresIn: process.env.REFRESH_JWT_EXP || '3d',
        },
      ),
    ]);

    const jwtTokensDto = new TokensDto();
    jwtTokensDto.accessToken = at;
    jwtTokensDto.refreshToken = rt;

    return jwtTokensDto;
  }
}
