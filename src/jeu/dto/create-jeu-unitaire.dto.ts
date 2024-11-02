import { IsDecimal, IsEnum, IsInt, IsDateString, IsNotEmpty , IsOptional} from 'class-validator';
import { Statut, Etat } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateJeuUnitaireDto {
  @IsNotEmpty()
  @IsDecimal()
  @Type(() => String)
  prix: number;

  @IsNotEmpty()
  @IsEnum(Statut)
  statut: Statut;

  @IsNotEmpty()
  @IsEnum(Etat)
  etat: Etat;

  @IsNotEmpty()
  @IsInt()
  idVendeur: number;

  @IsNotEmpty()
  @IsInt()
  idJeu: number;
}