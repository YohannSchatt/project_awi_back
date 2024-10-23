// src/jeu/dto/response-catalogue.dto.ts
import { InfoJeuDto } from './response-info-jeu.dto';

export class CatalogueDto {
  jeux: InfoJeuDto[];
}