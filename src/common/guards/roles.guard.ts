import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { Payload } from '../interface/payload.interface';

// The RolesGuard is a guard that checks if the user has the required roles to access a specific feature.
// The guard implements the CanActivate interface to define the canActivate() method.
// The canActivate() method checks if the user has the required roles to access the feature.
// The required roles are extracted from the request object using the Reflector class.
// The user object is extracted from the request object using the ExecutionContext class.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user: Payload }>();
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}