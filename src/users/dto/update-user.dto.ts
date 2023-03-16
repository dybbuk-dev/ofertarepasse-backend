import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  cpf?: UserEntity['cpf'];

  @IsOptional()
  phone?: UserEntity['phone'];

  @IsOptional()
  cnpj?: UserEntity['cnpj'];

  @IsOptional()
  cep?: UserEntity['cep'];

  @IsOptional()
  dateOfBirth?: UserEntity['dateOfBirth'];
}
