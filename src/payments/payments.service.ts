/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MercadoPago } from 'mercadopago/interface';
import { UsersService } from 'src/users/users.service';
import { AdvertsService } from 'src/adverts/adverts.service';
import { EmailsService } from 'src/emails/emails.service';
// import { CreatePaymentPayload } from 'mercadopago/models/payment/create-payload.model';
const mercadopago: MercadoPago = require('mercadopago');

@Injectable()
export class PaymentsService {
  constructor(
    private readonly userServices: UsersService,
    private readonly advertsService: AdvertsService,
    private readonly emailsServices: EmailsService,
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
      notification_url: `https://8f88-2804-1be8-f135-24f0-b016-23a8-1ecd-a417.ngrok-free.app/api/v1/payments/notifications`,
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

    return mercadopago.preferences.create(preference as any);
  }

  async notification(data: any) {
    if (data.type === 'payment' && data.data.id) {
      try {
        const payment = await mercadopago.payment.get(data.data.id);

        const advert = await this.advertsService.findOne({
          where: { id: payment.response.metadata.advert },
        });

        const userPayer = await this.userServices.findOne({
          where: { id: payment.response.metadata.user_payer },
        });

        const userReceive = await this.userServices.findOne({
          where: { id: payment.response.metadata.user_receive },
        });

        await this.emailsServices.negociation(
          userPayer.email,
          'Pagamento Efetuado',
          `Parabéns, você acabou de adquirir um ${advert.title}. Entre em contato com o vendedor para combinar uma entrega, Email: ${userReceive.email}, Telefone: ${userReceive.phone}`,
        );

        await this.emailsServices.negociation(
          userReceive.email,
          'VEÍCULO VENDIDO',
          `Parabéns, você acabou de vender ${advert.title}. Entre em contato com o comprador para combinar uma entrega, Email: ${userPayer.email}, Telefone: ${userPayer.phone}`,
        );

        ////////// Pagamento pix com o vendedor ////////////

        mercadopago.configure({
          access_token: process.env.MERCADOPAGO_ACCESS_TOKEN_TESTE,
        });

        const valueTax = advert.value / 100;
        const valuePayment = advert.value - valueTax;

        const formatNumber = new Intl.NumberFormat('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        });

        const payment_data = {
          transaction_amount: valuePayment,
          description: 'Compra de produto X',
          payment_method_id: 'pix',
          installments: 1,
          payer: {
            email: userReceive.email,
          },
          pix: {
            additional_info: `Pagamento referente a sua venda ${
              advert.title
            }. Lembrando que ${formatNumber.format(
              valueTax,
            )}, ou seja, 1% de ${formatNumber.format(
              advert.value,
            )} é taxa da plataforma`,
            expires: '2023-04-30T23:59:59Z',
            compe: {
              recipient: {
                type: 'cpf',
                number: userReceive.pix,
              },
              description: `Você vendeu ${
                advert.title
              } por ${formatNumber.format(advert.value)}`,
              amount: {
                value: valuePayment,
                currency: 'BRL',
              },
            },
          },
        };

        console.log(payment_data);

        mercadopago.payment.save(payment_data);
      } catch (err) {
        throw Error(err.message);
      }
    }
  }
}
