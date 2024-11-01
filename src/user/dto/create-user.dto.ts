import { Role } from '@prisma/client';
import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  role: Role;
}