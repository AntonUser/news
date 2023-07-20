import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NewsDto } from '../dto/news.dto';
import { ShortNewsDto } from '../dto/short-news.dto';

@Entity('news')
export class News extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: new Date() })
  lastModify: Date;

  @ManyToOne(() => User, (user) => user.news)
  user: User;

  @BeforeUpdate()
  updateLastModify() {
    this.lastModify = new Date();
  }

  toDto(): NewsDto {
    return {
      ...this.toShortDto(),
      lastModify: this.lastModify.toDateString(),
      user: this.user.toDto(),
    };
  }

  toShortDto(): ShortNewsDto {
    return {
      id: this.id,
      title: this.title,
      body: this.body,
    };
  }
}
