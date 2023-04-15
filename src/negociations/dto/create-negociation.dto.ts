import { IsNotEmpty } from 'class-validator';
import { NegociationEntity } from '../entities/negociation.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNegociationDto {
  @ApiProperty()
  @IsNotEmpty()
  user: NegociationEntity['user'];

  @ApiProperty()
  @IsNotEmpty()
  advert: NegociationEntity['advert'];

  @ApiProperty()
  @IsNotEmpty()
  intermediary: NegociationEntity['user'];

  @ApiProperty()
  @IsNotEmpty()
  value: NegociationEntity['value'];
}
