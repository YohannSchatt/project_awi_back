import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateVendeurDto {
  @IsNotEmpty()
  @IsString()
  prenom: string;

  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  numero: string;
}