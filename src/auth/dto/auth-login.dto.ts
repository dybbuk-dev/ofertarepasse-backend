import { IsNotEmpty, IsOptional } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  email: string;

  @IsOptional()
  password?: string;
}
