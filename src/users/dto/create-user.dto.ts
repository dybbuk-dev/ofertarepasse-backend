import { UserEntity } from './../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: UserEntity['name'];

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: UserEntity['email'];

  @ApiProperty()
  @IsOptional()
  status: UserEntity['status'];

  @ApiProperty()
  @IsNotEmpty()
  type: UserEntity['type'];

  @ApiProperty()
  @IsNotEmpty()
  password: UserEntity['password'];
}
