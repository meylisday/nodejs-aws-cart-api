import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { User } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(userId: string): Promise<UserEntity> {
    console.log('findOne')
    return this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
  }

  async createOne({ name, password }: User): Promise<UserEntity> {
    const id = v4();
    const newUser = { id: name || id, name, password };

    return this.userRepository.save(newUser);
  }
}
