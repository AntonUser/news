import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserReqDto } from '../dtos/user-req.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserReqDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
