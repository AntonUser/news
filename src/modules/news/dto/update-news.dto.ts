import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNewsDto {
  @IsString()
  @ApiProperty()
  body: string;

  @IsString()
  @ApiProperty()
  title: string;
}
