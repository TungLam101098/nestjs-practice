import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { MESSAGES } from '@/constants';
import { AuthMetadataKeys, AuthStrategies } from '@/enums';
import { handleError } from '@/utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategies.Jwt) {
  constructor(private reflector: Reflector) {
    super();
  }

  // Add logger
  private readonly logger = new Logger(JwtAuthGuard.name);

  /**
   * Determines if the current request can be activated (accessed)
   * Checks for @IsPublicRoute() decorator to bypass authentication
   */
  canActivate(context: ExecutionContext) {
    this.logger.log('Checking if user is authenticated');

    const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(
      AuthMetadataKeys.IsPublic,
      [context.getHandler(), context.getClass()],
    );

    // If the route is not public, call the parent canActivate method
    if (!isPublic) {
      this.logger.log('Route is not public');

      return super.canActivate(context);
    }

    this.logger.log('Route is public');

    return true;
  }

  /**
   * Handles the result of passport authentication
   * Throws UnauthorizedException if authentication fails
   */
  handleRequest<T>(err: unknown, user: T): T {
    if (err || !user) {
      this.logger.error(`User is not authenticated: ${JSON.stringify(user)}`);

      return handleError({
        error: err,
        defaultMessage: MESSAGES.MISSING_TOKEN,
        ExceptionClass: UnauthorizedException,
      });
    }

    return user;
  }
}
