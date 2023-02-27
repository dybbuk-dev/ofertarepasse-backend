import { AdvertEntity } from './../entities/advert.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  plate: AdvertEntity['plate'];

  @IsNotEmpty()
  @IsOptional()
  images: AdvertEntity['images'];

  @IsNotEmpty()
  brand: AdvertEntity['brand'];

  @IsNotEmpty()
  model: AdvertEntity['model'];

  @IsNotEmpty()
  fuel: AdvertEntity['fuel'];

  @IsNotEmpty()
  modelYear: AdvertEntity['modelYear'];

  @IsNotEmpty()
  manufactureYear: AdvertEntity['manufactureYear'];

  @IsNotEmpty()
  version: AdvertEntity['version'];

  @IsNotEmpty()
  color: AdvertEntity['color'];

  @IsNotEmpty()
  kilometer: AdvertEntity['kilometer'];

  @IsNotEmpty()
  value: AdvertEntity['value'];

  @IsNotEmpty()
  @IsOptional()
  about: AdvertEntity['about'];

  @IsNotEmpty()
  userId: AdvertEntity['userId'];

  @IsNotEmpty()
  @IsOptional()
  views: AdvertEntity['views'];

  @IsNotEmpty()
  @IsOptional()
  active: AdvertEntity['active'];

  @IsNotEmpty()
  city: AdvertEntity['city'];

  @IsNotEmpty()
  state: AdvertEntity['state'];

  @IsOptional()
  highlight: AdvertEntity['highlight'];

  @IsOptional()
  amountPeaple: number;

  @IsOptional()
  rolling: number;
}
