import { NextFunction, Request, Response } from 'express';

let authInstance: AuthController | null = null;

class AuthController {
  /**
   * Handle user registration requests.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next - The next middleware function in the processing chain.
   */
  async handleRegistrationRequest(req: Request, res: Response, next: NextFunction) {
    // TODO: Implement handle register user
    console.log(next);
    res.send('OKE');
  }

  /**
   * Get singleton authentication controller instance
   */
  static getInstance() {
    if (!authInstance) {
      authInstance = new AuthController();
    }

    return authInstance;
  }
}

export default AuthController;
