import { PartialType } from '@nestjs/swagger';
import { CreateAdvertDto } from './create-advert.dto';

export class UpdateAdvertDto extends PartialType(CreateAdvertDto) {}
