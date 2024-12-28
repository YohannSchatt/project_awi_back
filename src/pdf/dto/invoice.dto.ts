// src/jeu/dto/response-catalogue.dto.ts
import { IsNotEmpty } from 'class-validator';
import { Etat } from '@prisma/client';

export class InvoiceDto {

    @IsNotEmpty()
    date: Date;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    items : ItemDto[];
}

export class ItemDto {
    @IsNotEmpty()
    nom: string;

    @IsNotEmpty()
    editeur: string;

    @IsNotEmpty()
    prix : number;

    @IsNotEmpty()
    etat: Etat;
}