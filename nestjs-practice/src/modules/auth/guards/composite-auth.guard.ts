import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';

import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

/**
 * Composite guard that combines JWT authentication and role-based authorization
 * Guards are executed sequentially - if JWT auth fails, role check is skipped
 */
@Injectable()
export class CompositeAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly rolesGuard: RolesGuard,
  ) {}

  // Add logger
  private readonly logger = new Logger(CompositeAuthGuard.name);

  /**
   * Checks if the current request can access the route by validating both JWT and roles
   *
   * @param context - Execution context containing HTTP request details
   * @returns Promise resolving to boolean indicating if access is granted
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('Checking if user is authorized to access the route');

    // First verify JWT token
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);

    // If JWT auth fails, return early
    if (!isAuthenticated) {
      this.logger.error('User is not authenticated');

      return false;
    }

    this.logger.log('User is authenticated');

    // Then check role-based access
    return this.rolesGuard.canActivate(context);
  }
}
