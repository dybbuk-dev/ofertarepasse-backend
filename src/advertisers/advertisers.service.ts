import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class AdvertisersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    options: IPaginationOptions,
    search: string,
  ): Promise<Pagination<UserEntity>> {
    const usersWithAds = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.adverts', 'ad')
      .leftJoinAndSelect('user.negociations', 'negociations')
      .where('EXISTS (SELECT 1 FROM adverts WHERE ad.user = user.id)');

    if (search) {
      usersWithAds.andWhere('user.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    return paginate(usersWithAds, options);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.userRepository.softDelete(id);
  }
}
