import { Request } from 'express';

import { Role } from '@/modules/users/enums/role.enum';

/**
 * Interface representing authenticated user data in requests
 * Contains user's role information extracted from JWT token
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

/**
 * Extended Request interface that includes authenticated user data
 * Used in auth guards and controllers to access current user's role
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
