import {  IsString, IsEmail, IsOptional } from 'class-validator';

export class SearchVendeurDto {

  @IsOptional()
  @IsString()
  prenom: string;

  @IsOptional()
  @IsString()
  nom: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  numero: string;
}