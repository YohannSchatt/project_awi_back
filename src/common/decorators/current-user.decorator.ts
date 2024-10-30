import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../interface/payload.interface';

// This is a custom decorator that extracts the user object from the request object.
// The user object is stored in the request object by the JwtAuthGuard.
export const CurrentUser  = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);