import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJeuDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  editeur: string;

  @IsOptional()
  @IsString()
  description: string;
}