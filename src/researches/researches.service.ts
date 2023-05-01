import { Injectable } from '@nestjs/common';
import { CreateResearchDto } from './dto/create-research.dto';
import { Like, Not, Repository } from 'typeorm';
import { ResearchEntity } from './entities/research.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResearchesService {
  constructor(
    @InjectRepository(ResearchEntity)
    private readonly researchesRepository: Repository<ResearchEntity>,
  ) {}

  async create(data: CreateResearchDto) {
    const findSearch = await this.researchesRepository.findOne({
      where: { text: data.text },
    });

    if (!findSearch) {
      const search = this.researchesRepository.create(data);

      return this.researchesRepository.save(search);
    }
  }

  findAll(limit: number, search: string) {
    return this.researchesRepository.find({
      where: {
        text: search ? Like(`%${search}%`) : Not(''),
      },
      take: limit > 10 ? 10 : limit,
      order: search ? undefined : { access: 'DESC' },
    });
  }

  async amountAccess(id: string) {
    const search = await this.researchesRepository.findOneOrFail({
      where: { id },
    });

    const searchMerge = this.researchesRepository.merge(search, {
      access: search.access + 1,
    });

    await this.researchesRepository.save(searchMerge);
  }
}
