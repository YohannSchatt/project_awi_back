import { IsNumber, Min } from 'class-validator';

export class EnregistrerRetraitArgentDto {
    @IsNumber()
    idVendeur: number;
    @IsNumber()
    @Min(0.5)
    montant: number;
}
