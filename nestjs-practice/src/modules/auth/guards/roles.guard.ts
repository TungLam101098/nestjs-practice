import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthMetadataKeys } from '@/enums';
import { AuthenticatedRequest } from '@/interfaces';
import { Role } from '@/modules/users/enums/role.enum';
import { handleError } from '@/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Add logger
  private readonly logger = new Logger(RolesGuard.name);

  /**
   * Checks if the current user has the required roles to access a route
   * Uses role metadata from @Roles() decorator
   */
  canActivate(context: ExecutionContext): boolean {
    this.logger.log('Checking if user has required roles');

    const requiredRoles: Role[] = this.reflector.getAllAndOverride<Role[]>(
      AuthMetadataKeys.Roles,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || !requiredRoles.length) {
      this.logger.log('No roles required for route');

      return true;
    }

    // Get user role from request object
    const request: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const hasRole: boolean = requiredRoles.includes(request.user.role);

    // If user role is not in required roles, deny access
    if (!hasRole) {
      this.logger.error(
        `User role ${request.user.role} is not authorized to access the route`,
      );

      return handleError({
        defaultMessage: `User role ${request.user.role} is not authorized`,
        ExceptionClass: UnauthorizedException,
      });
    }

    this.logger.log('User has required roles');

    return true;
  }
}
