import { IsNotEmpty } from 'class-validator';
import { NegociationEntity } from '../entities/negociation.entity';

export class CreateNegociationDto {
  @IsNotEmpty()
  user: NegociationEntity['user'];

  @IsNotEmpty()
  advert: NegociationEntity['advert'];

  @IsNotEmpty()
  value: NegociationEntity['value'];
}
