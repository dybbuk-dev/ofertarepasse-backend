import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AdvertEntity } from '../entities/advert.entity';
import { CreateAdvertDto } from './create-advert.dto';

export class UpdateAdvertDto extends PartialType(CreateAdvertDto) {
  @ApiProperty()
  @IsOptional()
  title?: AdvertEntity['title'];

  @ApiProperty()
  @IsOptional()
  images?: AdvertEntity['images'];

  @ApiProperty()
  @IsOptional()
  kilometer?: AdvertEntity['kilometer'];

  @ApiProperty()
  @IsOptional()
  value?: AdvertEntity['value'];

  @ApiProperty()
  @IsOptional()
  about?: AdvertEntity['about'];

  @ApiProperty()
  @IsOptional()
  alert?: AdvertEntity['alert'];

  @ApiProperty()
  @IsOptional()
  highlight?: AdvertEntity['highlight'];

  @ApiProperty()
  @IsOptional()
  views?: AdvertEntity['views'];

  @ApiProperty()
  @IsOptional()
  proposals?: AdvertEntity['proposals'];
}
