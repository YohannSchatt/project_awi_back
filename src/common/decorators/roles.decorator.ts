import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';


// The Roles() decorator is used to specify the roles that are allowed to access a specific feature.
export const ROLES_KEY = 'roles';
export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);