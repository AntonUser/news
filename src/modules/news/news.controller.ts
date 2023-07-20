import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/comon/decorators/user.decorator';
import { UserReqDto } from 'src/comon/dtos/user-req.dto';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';
import { ShortNewsDto } from './dto/short-news.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({ type: [ShortNewsDto] })
  async getAll() {
    const news = await this.newsService.getAll();
    return news.map((v) => v.toShortDto());
  }

  @Get('/:id')
  @ApiResponse({ type: NewsDto })
  async getOne(@Param('id') id: number) {
    const v = await this.newsService.getOne(id);
    return v.toDto();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: NewsDto })
  @ApiBearerAuth('access-token')
  async createNews(@User() userReq: UserReqDto, @Body() dto: CreateNewsDto) {
    const news = await this.newsService.create(dto, userReq.sub);
    return news.toDto();
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ type: NewsDto })
  @ApiBearerAuth('access-token')
  async updateNews(
    @User() userReq: UserReqDto,
    @Body() dto: UpdateNewsDto,
    @Param('id') id: number,
  ) {
    const news = await this.newsService.update(id, dto, userReq);
    return news.toDto();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  deleteNews(@Param('id') id: number, @User() userReq: UserReqDto) {
    return this.newsService.delete(id, userReq);
  }
}
