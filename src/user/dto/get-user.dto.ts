import { Optional } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsString, IsInt, IsEmail } from 'class-validator';

export class GetUserDto {

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  role: Role;
}