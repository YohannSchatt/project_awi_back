import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Constants {
    private static JWT_KEY: string;
    private static JWT_EXPIRATION: number;
    private static DATABASE_HOST: string;
    private static DATABASE_PORT: string;
    private static DATABASE_USER: string;
    private static DATABASE_PASSWORD: string;
  
    constructor(private configService: ConfigService) {
      Constants.JWT_KEY = this.configService.get<string>('JWT_KEY');
      Constants.JWT_EXPIRATION = this.configService.get<number>('JWT_EXPIRATION');
      Constants.DATABASE_HOST = this.configService.get<string>('DATABASE_HOST');
      Constants.DATABASE_PORT = this.configService.get<string>('DATABASE_PORT');
      Constants.DATABASE_USER = this.configService.get<string>('DATABASE_USER');
      Constants.DATABASE_PASSWORD = this.configService.get<string>('DATABASE_PASSWORD');
    }

    public static getJWTKey(): string {
        return Constants.JWT_KEY;
    }

    public static getJWTExpiration(): number {
        return Constants.JWT_EXPIRATION;
    }

    public static getDatabaseHost(): string {
        return Constants.DATABASE_HOST;
    }

    public static getDatabasePort(): string {
        return Constants.DATABASE_PORT;
    }

    public static getDatabaseUser(): string {
        return Constants.DATABASE_USER;
    }

    public static getDatabasePassword(): string {
        return Constants.DATABASE_PASSWORD;
    }
  }