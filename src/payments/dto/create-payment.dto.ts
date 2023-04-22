import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  userReceive: string;

  @IsNotEmpty()
  userPayer: string;

  @IsNotEmpty()
  userIntermediary: string;

  @IsNotEmpty()
  advert: string;
}
