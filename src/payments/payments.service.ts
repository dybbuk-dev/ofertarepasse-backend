/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPago } from 'mercadopago/interface';
import { UsersService } from 'src/users/users.service';
import { AdvertsService } from 'src/adverts/adverts.service';
import { EmailsService } from 'src/emails/emails.service';
import { NegociationsService } from './../negociations/negociations.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
const mercadopago: MercadoPago = require('mercadopago');

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly userServices: UsersService,
    private readonly advertsService: AdvertsService,
    private readonly emailsServices: EmailsService,
    private readonly negociationsService: NegociationsService,
  ) {}

  async create(data: CreatePaymentDto) {
    try {
      mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });

      const advert = await this.advertsService.findOne({
        where: { id: data.advert },
      });

      const userPayer = await this.userServices.findOne({
        where: { id: data.payer },
      });

      const preference = {
        items: [
          {
            title: advert.title,
            description: advert.about,
            currency_id: 'BRL',
            quantity: 1,
            unit_price: advert.value,
          },
        ],
        payer: {
          name: userPayer.name,
          email: userPayer.email,
          cpf: userPayer.cpf,
        },
        notification_url: `https://1c1d-2804-1be8-f135-24f0-c5d1-c2c2-5e18-4f3.ngrok-free.app/api/v1/payments/notifications`,
        payment_methods: {
          excluded_payment_methods: [
            {
              id: 'ticket',
            },
          ],
          excluded_payment_types: [
            {
              id: 'ticket',
            },
          ],
        },
        metadata: data,
      };

      const { body } = await mercadopago.preferences.create(preference as any);

      const payment = this.paymentRepository.create({
        ...data,
        paymentLink: body.init_point,
      });
      return this.paymentRepository.save(payment);
    } catch (err) {
      throw Error(err);
    }
  }

  async notification(data: any) {
    if (data.type === 'payment' && data.data.id) {
      try {
        const payment = await mercadopago.payment.get(data.data.id);

        const advert = await this.advertsService.findOne({
          where: { id: payment.response.metadata.advert },
        });

        const negociation = await this.negociationsService.findOne({
          where: { advert: advert.id },
        });

        // const userPayer = await this.userServices.findOne({
        //   where: { id: payment.response.metadata.user_payer },
        // });

        // const userReceive = await this.userServices.findOne({
        //   where: { id: payment.response.metadata.user_receive },
        // });

        await this.negociationsService.update(negociation.id, {
          status: 'finalized',
        });

        await this.advertsService.update(advert.id, { active: false });

        // await this.emailsServices.negociation(
        //   userPayer.email,
        //   'Pagamento Efetuado',
        //   `Parabéns, você acabou de adquirir um ${advert.title}. Entre em contato com o vendedor para combinar uma entrega, Email: ${userReceive.email}, Telefone: ${userReceive.phone}`,
        // );

        // await this.emailsServices.negociation(
        //   userReceive.email,
        //   'VEÍCULO VENDIDO',
        //   `Parabéns, você acabou de vender ${advert.title}. Entre em contato com o comprador para combinar uma entrega, Email: ${userPayer.email}, Telefone: ${userPayer.phone}`,
        // );
      } catch (err) {
        throw Error(err.message);
      }
    }
  }
}
