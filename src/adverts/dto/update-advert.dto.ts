import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { AdvertEntity } from '../entities/advert.entity';

export class UpdateAdvertDto {
  @ApiProperty()
  @IsOptional()
  title: AdvertEntity['title'];

  @ApiProperty()
  @IsOptional()
  images: AdvertEntity['images'];

  @ApiProperty()
  @IsOptional()
  kilometer: AdvertEntity['kilometer'];

  @ApiProperty()
  @IsOptional()
  value: AdvertEntity['value'];

  @ApiProperty()
  @IsOptional()
  about: AdvertEntity['about'];

  @ApiProperty()
  @IsOptional()
  highlight: AdvertEntity['highlight'];
}
