import { Optional } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsString, IsInt, IsEmail } from 'class-validator';

export class GetUserDto {
  @IsInt()
  idUtilisateur: number;

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  role: Role;
}