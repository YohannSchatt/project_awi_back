import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class SearchVendeurDto {

  @IsOptional()
  @IsString()
  prenom: string;

  @IsOptional()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  numero: string;
}