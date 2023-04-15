import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async create(data: CreateUserDto) {
    if (data.email) {
      const user = await this.findOne({
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

  async uploadImage(id: string, file: Express.Multer.File) {
    const user = await this.findOne({ where: { id } });

    if (user.image) {
      await this.s3Service.deleteFile(user.image);
    }

    const key = await this.s3Service.uploadFile(file);

    await this.update(id, { image: key });
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOne(options: FindOneOptions<UserEntity>) {
    return this.usersRepository.findOneOrFail(options);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.findOne({ where: { id } });

    this.usersRepository.merge(user, data);
    return await this.usersRepository.save(user);
  }

  async remove(id: string) {
    await this.usersRepository.findOneOrFail({ where: { id } });
    this.usersRepository.delete({ id });
  }
}
