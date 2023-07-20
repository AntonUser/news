import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { News } from 'src/modules/news/entities/news.entity';
import { UserDto } from '../dto/user.dto';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => News, (news) => news.user)
  news: News[];

  @BeforeInsert()
  hashBeforeInsertPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeUpdate()
  hashBeforeUpdatePassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  toDto(): UserDto {
    return {
      id: this.id,
      lastName: this.lastName,
      firstName: this.firstName,
      email: this.email,
    };
  }
}
