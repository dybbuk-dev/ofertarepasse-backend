/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Not, Repository } from 'typeorm';
import { CreateNegociationDto } from './dto/create-negociation.dto';
import { UpdateNegociationDto } from './dto/update-negociation.dto';
import { NegociationEntity } from './entities/negociation.entity';
import { EmailsService } from 'src/emails/emails.service';
import { AdvertsService } from 'src/adverts/adverts.service';
import { MercadoPago } from 'mercadopago/interface';
const mercadopago: MercadoPago = require('mercadopago');

@Injectable()
export class NegociationsService {
  constructor(
    @InjectRepository(NegociationEntity)
    private readonly negociationsRepository: Repository<NegociationEntity>,
    private readonly emailsServices: EmailsService,
    private readonly advertServices: AdvertsService,
  ) {}

  async create(data: CreateNegociationDto) {
    const negociation = this.negociationsRepository.create(data);
    const saveNegociation = await this.negociationsRepository.save(negociation);

    const advert = await this.advertServices.findOne({
      where: {
        id: saveNegociation.advert,
      },
      relations: ['user'],
    });

    await this.emailsServices.negociation(
      advert.user.email,
      'Negociação Iniciada',
      `Uma negociação foi aberta para o seu anúncio: ${advert.title}`,
    );

    return saveNegociation;
  }

  findAll(user: string) {
    return this.negociationsRepository.find({
      where: {
        user: {
          id: user ? user : Not(''),
        },
      },
      relations: ['advert'],
    });
  }

  findOne(options: FindOneOptions<NegociationEntity>) {
    return this.negociationsRepository.findOneOrFail(options);
  }

  async update(id: string, updateNegociationDto: UpdateNegociationDto) {
    const negociation = await this.findOne({ where: { id } });

    this.negociationsRepository.merge(negociation, updateNegociationDto);

    return this.negociationsRepository.save(negociation);
  }

  async notification(data: any) {
    if (data.type === 'payment' && data.data.id) {
      try {
        const payment = await mercadopago.payment.get(data.data.id);

        console.log(payment);
      } catch (err) {
        throw Error(err.message);
      }
    }
  }
}
