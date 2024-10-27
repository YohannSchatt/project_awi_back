import { IsString, IsInt, IsEmail } from 'class-validator';

export class GetPayloadDto {
  @IsInt()
  idUtilisateur: number;

  @IsString()
  role: string;
}