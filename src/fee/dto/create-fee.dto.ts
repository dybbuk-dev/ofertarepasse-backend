import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FeeEntity } from '../entities/fee.entity';

export class CreateFeeDto {
  @ApiProperty()
  @IsNotEmpty()
  fee: FeeEntity['fee'];
}
