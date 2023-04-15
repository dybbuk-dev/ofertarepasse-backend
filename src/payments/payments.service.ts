/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPago } from 'mercadopago/interface';
import { UsersService } from 'src/users/users.service';
import { AdvertsService } from 'src/adverts/adverts.service';
const mercadopago: MercadoPago = require('mercadopago');

@Injectable()
export class PaymentsService {
  constructor(
    private readonly userServices: UsersService,
    private readonly advertsService: AdvertsService,
  ) {}

  async create(data: CreatePaymentDto) {
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN_TESTE,
    });

    const advert = await this.advertsService.findOne({
      where: { id: data.advert },
    });

    const userPayer = await this.userServices.findOne({
      where: { id: data.userPayer },
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
      notification_url: `https://8e2c-2804-1be8-f135-24f0-10c4-3b6e-febb-7a35.sa.ngrok.io/api/v1/payments/notifications`,
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

    mercadopago.preferences.create(preference as any);
  }

  notification(data: any) {
    console.log(data);
  }
}
