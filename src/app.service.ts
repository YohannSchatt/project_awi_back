import { Injectable } from '@nestjs/common';

// The AppService class is a service that provides application-related functionality.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
