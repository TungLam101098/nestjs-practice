import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '@interfaces';

let wishlistInstance: WishlistController | null = null;

class WishlistController {
  /**
   * Handle POST request to add courses into wishlist
   * @param {AuthenticatedRequest} req - authenticated request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleAddCourseToWishlistRequest(
    req: AuthenticatedRequest,
    res: Response,
    _next: NextFunction
  ) {
    // TODO: Implement add course to wishlist request
    res.send('Add course to wishlist successfully');
  }

  /**
   * Get singleton authentication controller instance
   */
  static getInstance() {
    if (!wishlistInstance) {
      wishlistInstance = new WishlistController();
    }

    return wishlistInstance;
  }
}

export default WishlistController;
