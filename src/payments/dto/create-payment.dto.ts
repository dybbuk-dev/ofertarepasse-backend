import { IsNotEmpty } from 'class-validator';
import { PaymentEntity } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  receiver: PaymentEntity['receiver'];

  @IsNotEmpty()
  payer: PaymentEntity['payer'];

  @IsNotEmpty()
  intermediary: PaymentEntity['intermediary'];

  @IsNotEmpty()
  advert: PaymentEntity['advert'];
}
