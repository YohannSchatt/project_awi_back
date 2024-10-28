import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  @IsNotEmpty()
  dateDebut: string;

  @IsDateString()
  @IsNotEmpty()
  dateFin: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}