// src/jeu/dto/response-catalogue.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CatalogueDto {
  jeux: InfoJeuUnitaireDto[];
}

export class InfoJeuUnitaireDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  nom: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  editeur: string;
  @IsNotEmpty()
  prix : number;
  @IsNotEmpty()
  nomVendeur: string;
  @IsNotEmpty()
  image: string; // Add the image attribute
  @IsNotEmpty()
  etat: string; // Add the statut attribute

  // Add other properties as needed
}