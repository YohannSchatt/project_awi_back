
import { Statut } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class EtatJeuDto {

    @IsInt()
    idJeu: number;

    @IsEnum(Statut)
    statut: Statut;

}