import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { MESSAGES } from '@/constants';
import { AuthFields } from '@/enums';
import { User } from '@/modules/users/entities/user.entity';
import { handleError } from '@/utils';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Configures the local authentication strategy
   * Sets up username field to use email instead of default username
   */
  constructor(private authService: AuthService) {
    super({
      usernameField: AuthFields.Email,
    });
  }

  /**
   * Validates user credentials during local authentication
   * Called automatically by Passport when local strategy is used
   */
  async validate(email: string, password: string): Promise<User> {
    const user: User | null = await this.authService.validateUser(
      email,
      password,
    );

    if (!user) {
      return handleError({
        defaultMessage: MESSAGES.INVALID_CREDENTIALS,
        ExceptionClass: UnauthorizedException,
      });
    }

    return user;
  }
}
