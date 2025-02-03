import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class EnregistrerRetraitJeuDto {
    @IsNumber()
    @IsNotEmpty()
    idVendeur: number;

    @IsOptional()
    idJeu: number[];

    @IsBoolean()
    @IsNotEmpty()
    argent: boolean;


}

