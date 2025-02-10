import { Statut } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InfoJeuStockDto {
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
  statut : Statut;

  @IsNotEmpty()
  @IsNumber()
  idJeuUnitaire: number;

  @IsNotEmpty()
  @IsNumber()
  prix: number;
}