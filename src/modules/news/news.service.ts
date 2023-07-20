import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto } from './dto/create-news.dto';
import { User } from '../user/entities/user.entity';
import { UpdateNewsDto } from './dto/update-news.dto';
import { UserReqDto } from 'src/comon/dtos/user-req.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepository: Repository<News>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getOne(id: number) {
    return this.newsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  getAll() {
    return this.newsRepository.find({
      relations: ['user'],
    });
  }

  async create(dto: CreateNewsDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const news = this.newsRepository.create({ ...dto, user });
    return this.newsRepository.save(news);
  }

  async update(id: number, dto: UpdateNewsDto, userReq: UserReqDto) {
    const news = await this.newsRepository.findOneOrFail({
      where: { id },
      select: ['id', 'user'],
      relations: ['user'],
    });

    if (news.user.id !== userReq.sub) {
      throw new ForbiddenException('Редактирование новости недоступно для вас');
    }

    return this.newsRepository.save({ ...dto, id });
  }

  async delete(id: number, userReq: UserReqDto) {
    const news = await this.newsRepository.findOneOrFail({
      where: { id },
      select: ['id', 'user'],
      relations: ['user'],
    });

    if (news.user.id !== userReq.sub) {
      throw new ForbiddenException('Удаление новости недоступно для вас');
    }

    await this.newsRepository.delete(id);
  }
}
