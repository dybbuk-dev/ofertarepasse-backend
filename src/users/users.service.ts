import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateUserDto) {
    if (data.email) {
      const { user } = await this.findOne({
        where: {
          email: data.email,
        },
      });

      if (user) {
        return {
          error: true,
          message: 'Esse email ja está cadastrado',
        };
      }
    }

    const user = this.usersRepository.create(data);

    await this.usersRepository.save(user);

    user.password = undefined;
    return user;
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(options: FindOneOptions<UserEntity>) {
    try {
      const user = await this.usersRepository.findOneOrFail(options);

      return {
        error: false,
        user,
      };
    } catch (error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }

  async update(id: string, data: UpdateUserDto) {
    const { error, user } = await this.findOne({ where: { id } });

    if (!error) {
      this.usersRepository.merge(user, data);
      return await this.usersRepository.save(user);
    }
  }

  async remove(id: string) {
    await this.usersRepository.findOneOrFail({ where: { id } });
    this.usersRepository.delete({ id });
  }
}
