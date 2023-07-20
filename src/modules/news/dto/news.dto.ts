import { ApiProperty } from '@nestjs/swagger';
import { ShortNewsDto } from './short-news.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class NewsDto extends ShortNewsDto {
  @ApiProperty()
  lastModify: string;

  @ApiProperty()
  user: UserDto;
}
