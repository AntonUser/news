import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { TokensDto } from './dto/tokens.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AccessTokenDto } from './dto/access-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ type: TokensDto })
  register(@Body() dto: RegisterDto): Promise<TokensDto> {
    return this.authService.register(dto);
  }

  @Put('login')
  @ApiResponse({ type: TokensDto })
  login(@Body() dto: LoginDto): Promise<TokensDto> {
    return this.authService.login(dto);
  }

  @Put('refresh')
  @ApiBearerAuth('refresh-token')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiResponse({ type: AccessTokenDto })
  refreshAccessToken(@Req() req: Request) {
    return this.authService.updateAccessToken(req);
  }
}
