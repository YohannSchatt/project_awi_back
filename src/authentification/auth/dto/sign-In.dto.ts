import { Role } from "@prisma/client";
import { IsString } from "class-validator";

export class SignInDto {
    @IsString()
    email: string;
  
    @IsString()
    password: Role;
  }