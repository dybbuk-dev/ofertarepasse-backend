import { ApiProperty } from '@nestjs/swagger';
import { AdvertEntity } from './../entities/advert.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdvertDto {
  @ApiProperty()
  @IsNotEmpty()
  plate: AdvertEntity['plate'];

  @ApiProperty()
  @IsNotEmpty()
  title: AdvertEntity['title'];

  @ApiProperty()
  @IsOptional()
  images: AdvertEntity['images'];

  @ApiProperty()
  @IsNotEmpty()
  brand: AdvertEntity['brand'];

  @ApiProperty()
  @IsNotEmpty()
  model: AdvertEntity['model'];

  @ApiProperty()
  @IsNotEmpty()
  fuel: AdvertEntity['fuel'];

  @ApiProperty()
  @IsNotEmpty()
  modelYear: AdvertEntity['modelYear'];

  @ApiProperty()
  @IsNotEmpty()
  manufactureYear: AdvertEntity['manufactureYear'];

  @ApiProperty()
  @IsNotEmpty()
  version: AdvertEntity['version'];

  @ApiProperty()
  @IsNotEmpty()
  color: AdvertEntity['color'];

  @ApiProperty()
  @IsNotEmpty()
  kilometer: AdvertEntity['kilometer'];

  @ApiProperty()
  @IsNotEmpty()
  value: AdvertEntity['value'];

  @ApiProperty()
  @IsNotEmpty()
  fipeValue: AdvertEntity['fipeValue'];

  @ApiProperty()
  @IsOptional()
  about: AdvertEntity['about'];

  @ApiProperty()
  @IsOptional()
  alert: AdvertEntity['alert'];

  @ApiProperty()
  @IsNotEmpty()
  user: AdvertEntity['user'];

  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  active: AdvertEntity['active'];

  @ApiProperty()
  @IsNotEmpty()
  city: AdvertEntity['city'];

  @ApiProperty()
  @IsNotEmpty()
  state: AdvertEntity['state'];

  @ApiProperty()
  @IsOptional()
  highlight: AdvertEntity['highlight'];

  @ApiProperty()
  @IsOptional()
  amountPeaple: AdvertEntity['amountPeaple'];

  @ApiProperty()
  @IsOptional()
  rolling: AdvertEntity['rolling'];
}
