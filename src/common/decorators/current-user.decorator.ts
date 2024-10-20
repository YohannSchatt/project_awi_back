import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Payload } from '../interface/payload.interface';

export const CurrentUser  = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request);
    console.log(request.user);
    return request.user;
  },
);