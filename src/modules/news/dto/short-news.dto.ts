import { ApiProperty } from '@nestjs/swagger';

export class ShortNewsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;
}
