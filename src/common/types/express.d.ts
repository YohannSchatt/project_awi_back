import { Payload } from '../interfaces/payload.interface';

declare module 'express' {
  export interface Request {
    user?: Payload;
  }
}