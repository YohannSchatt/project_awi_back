// src/jeu/dto/response-catalogue.dto.ts
import { InfoJeuUnitaireDto } from './response-info-jeu-unitaire.dto';

export class CatalogueDto {
  jeux: InfoJeuUnitaireDto[];
}