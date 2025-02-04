
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class CatalogueRequestDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  editeur?: string;

  @IsOptional()
  @IsNumber()
  prixMin?: number;

  @IsOptional()
  @IsNumber()
  prixMax?: number;

  @IsNumber()
  @Min(1)
  page: number;
}