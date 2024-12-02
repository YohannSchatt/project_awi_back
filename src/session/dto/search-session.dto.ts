import { IsString } from "class-validator";

export class SearchSessionDto {

@IsString()
titre?: string = '';

@IsString()
lieu?: string = '';

@IsString()
dateDebut? : String = '';

@IsString()
dateFin? : String = '';

}