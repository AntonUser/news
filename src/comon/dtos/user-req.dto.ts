import { IsNumber } from 'class-validator';

export class UserReqDto {
  @IsNumber()
  sub!: number;

  @IsNumber()
  iat!: number;

  @IsNumber()
  exp!: number;
}
