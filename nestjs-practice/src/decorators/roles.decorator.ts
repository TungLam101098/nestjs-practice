import { SetMetadata } from '@nestjs/common';

import { AuthMetadataKeys } from '@/enums';
import { Role } from '@/modules/users/enums/role.enum';

/**
 * Decorator for role-based access control
 * Sets metadata to specify which roles can access a route
 */
export const Roles = (...roles: Role[]) =>
  SetMetadata(AuthMetadataKeys.Roles, roles);
