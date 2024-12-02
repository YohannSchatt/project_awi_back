import { Decimal } from '@prisma/client/runtime/library';
import {IsOptional, IsObject, IsDecimal, isDecimal, IsDefined } from 'class-validator';
import { VenteDto } from './vente.dto';

export class DashboardDto {

    @IsDecimal()
    @IsOptional()
    ArgentARendreSession: Decimal;

    @IsDecimal()
    @IsOptional()
    ArgentGagneSession: Decimal;

    @IsDecimal()
    @IsOptional()
    ArgentComission: Decimal;

    @IsDecimal()
    ArgentTotal: Decimal;

    @IsDecimal()
    sommeDue: Decimal;

    @IsDecimal()
    sommeRetire: Decimal;

    @IsObject()
    @IsOptional()
    DetailVentes: VenteDto[];
}