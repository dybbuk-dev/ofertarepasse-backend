import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateNegociationDto } from './create-negociation.dto';

export class UpdateNegociationDto extends PartialType(CreateNegociationDto) {
  @ApiProperty()
  @IsNotEmpty()
  status: string;
}
