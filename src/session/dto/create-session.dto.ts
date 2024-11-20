import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateSessionDto {

  @IsString()
  @IsNotEmpty()
  titre : string;

  @IsString()
  @IsNotEmpty()
  lieu: string;

  @IsDateString()
  @IsNotEmpty()
  dateDebut: string;

  @IsDateString()
  @IsNotEmpty()
  dateFin: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  comission: number;
}