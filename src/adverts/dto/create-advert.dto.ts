import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdvertDto {
  @IsNotEmpty()
  plate: string;

  @IsNotEmpty()
  @IsOptional()
  images: string[];

  @IsNotEmpty()
  brand: string;

  @IsNotEmpty()
  model: string;

  @IsNotEmpty()
  modelYear: string;

  @IsNotEmpty()
  manufactureYear: string;

  @IsNotEmpty()
  version: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  amountDoors: string;

  @IsNotEmpty()
  exchange: string;

  @IsNotEmpty()
  @IsOptional()
  armored: boolean;

  @IsNotEmpty()
  kilometer: number;

  @IsNotEmpty()
  @IsOptional()
  differential: string;

  @IsNotEmpty()
  value: number;

  @IsNotEmpty()
  @IsOptional()
  details: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsOptional()
  views: number;

  @IsNotEmpty()
  @IsOptional()
  active: boolean;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;
}
