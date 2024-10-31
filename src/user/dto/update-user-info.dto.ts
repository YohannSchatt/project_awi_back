import { IsString, IsEmail } from 'class-validator';

export class UpdateUserInfoDto {

  @IsString()
  prenom: string;

  @IsString()
  nom: string;

  @IsEmail()
  email: string;
}