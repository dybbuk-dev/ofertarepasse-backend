import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  receiver: string;

  @IsNotEmpty()
  payer: string;

  @IsNotEmpty()
  intermediary: string;

  @IsNotEmpty()
  advert: string;

  @IsNotEmpty()
  negociation: string;
}
