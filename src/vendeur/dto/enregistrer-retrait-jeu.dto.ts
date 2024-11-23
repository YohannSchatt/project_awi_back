import { IsNumber } from 'class-validator';

export class EnregistrerRetraitJeuDto {
    @IsNumber()
    idVendeur: number;
    @IsNumber()
    idJeu: number;
}

