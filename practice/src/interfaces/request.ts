import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export { AuthenticatedRequest };
