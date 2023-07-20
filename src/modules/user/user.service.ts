import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(dto: UserCreateDto) {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  findByEmailOrFail(email: string) {
    return this.userRepository.findOneByOrFail({ email });
  }
}
