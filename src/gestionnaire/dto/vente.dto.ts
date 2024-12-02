import { Decimal } from '@prisma/client/runtime/library';
import {IsOptional, IsObject, IsDecimal, isDecimal, IsDefined, IsDate, IsString } from 'class-validator';

export class VenteDto {

    @IsDecimal()
    prix: Decimal;

    @IsString()
    nomVendeur: string;

    @IsString()
    nomJeu: string;

    @IsString()
    nomSession: string;

    @IsDate()
    dateAchat: Date;
}