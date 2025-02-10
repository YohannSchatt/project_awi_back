import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InfoJeuDBDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  editeur: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  idJeu: number;
}