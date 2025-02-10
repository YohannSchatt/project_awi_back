import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateJeuDto {

  @IsNotEmpty()
  @IsString()
  idJeu: number;

  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  editeur: string;

  @IsOptional()
  @IsString()
  description: string;

 @IsOptional() 
  @IsString()
  image: string;
}