import { IsDecimal, IsEnum, IsInt, IsDateString, IsNotEmpty , IsOptional} from 'class-validator';
import { Statut, Etat } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateJeuUnitaireDto {
  @IsNotEmpty()
  @IsDecimal()
  @Type(() => String)
  prix: number;

  
  @IsEnum(Statut)
  statut: Statut;


  @IsEnum(Etat)
  etat: Etat;

  @IsInt()
  idVendeur: number;

  @IsInt()
  idJeu: number;
}