import { NextFunction, Request, Response } from 'express';

import { getCategoryByName, saveCategory } from '@services/category';
import { ensureError, logger } from '@utils';
import Category from '@interfaces/category';
import { EXCEPTIONS } from '@constants';

let categoryInstance: CategoryController | null = null;

class CategoryController {
  /**
   * Handle create category requests
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - The next middleware function in the processing chain
   */
  async handleCreateCategoryRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { name }: Category = req.body;
      const categoryFound = await getCategoryByName(name);

      if (categoryFound) {
        return next(EXCEPTIONS.CATEGORY_EXISTS_EXCEPTION);
      }

      const category = await saveCategory({ name });

      res.send(category);
    } catch (error: unknown) {
      // Catch error while finding and save category
      const { message } = ensureError(error);
      logger.info(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Get singleton category controller instance
   */
  static getInstance() {
    if (!categoryInstance) {
      categoryInstance = new CategoryController();
    }

    return categoryInstance;
  }
}

export default CategoryController;
