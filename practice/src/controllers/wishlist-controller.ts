import { Response, NextFunction } from 'express';

import {
  getWishlistByUserId,
  saveWishlist,
  updateCourseIdsByUserId,
  deleteCourseIdsByUserId,
} from '@services/wishlist';
import { getCourses } from '@services/course';
import { ensureError, logger } from '@utils';
import { AuthenticatedRequest } from '@interfaces';
import { EXCEPTIONS } from '@constants';

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
    next: NextFunction
  ) {
    try {
      const courseIdsRequest: string[] = req.body;

      const userId = req.userId;

      if (!userId) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const courses = await getCourses();
      const courseIds = courses.map((course) => course._id.toHexString());
      const isInvalidCourseIds = !courseIdsRequest.every((course) => courseIds.includes(course));

      if (isInvalidCourseIds) {
        return next(EXCEPTIONS.COURSES_INVALID_EXCEPTION);
      }

      const wishlistFound = await getWishlistByUserId(userId);

      // Handle to update courseIds in database if userId is existed
      if (wishlistFound && wishlistInstance) {
        const courseIdsDatabase = wishlistFound.courseIds;

        return wishlistInstance.handleUpdateWishlist(
          userId,
          courseIdsRequest,
          courseIdsDatabase,
          res,
          next
        );
      }

      const wishlist = await saveWishlist({
        userId,
        courseIds: courseIdsRequest,
      });

      res.send(wishlist);
    } catch (error: unknown) {
      // Catch error while finding and saving wishlist
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle the update of a user's wishlist by adding requested course IDs
   * @param {string} userId - The user ID for whom the wishlist is being updated
   * @param {string[]} courseIdsRequest - An array of course IDs to be added to the wishlist
   * @param {string[]} courseIdsDatabase - An array of course IDs currently stored in the database for the user's wishlist
   * @param {Response} res - The Express response object to send the updated wishlist in the response
   * @param {NextFunction} next - The Express next function for error handling
   */
  async handleUpdateWishlist(
    userId: string,
    courseIdsRequest: string[],
    courseIdsDatabase: string[],
    res: Response,
    next: NextFunction
  ) {
    try {
      const isInvalidParams = !userId || !courseIdsRequest.length || !res || !next;

      if (isInvalidParams) {
        logger.error('Missing field when updating wishlist');

        return next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
      }

      const isExistsCourseIds = courseIdsDatabase.some((courseIdDatabase) =>
        courseIdsRequest.includes(courseIdDatabase)
      );

      if (isExistsCourseIds) {
        return next(EXCEPTIONS.COURSES_EXISTS_EXCEPTION);
      }

      const wishlist = await updateCourseIdsByUserId(userId, courseIdsRequest);

      res.send(wishlist);
    } catch (error: unknown) {
      // Catch error while updating courseIds
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle GET request to retrieve a wishlist
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleGetWishlistRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;

      if (!userId) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const wishlist = await getWishlistByUserId(userId);

      if (wishlist) {
        const courseIds = wishlist.courseIds;

        return res.send(courseIds);
      }

      const emptyWishlist: string[] = [];

      res.send(emptyWishlist);
    } catch (error: unknown) {
      // Catch errors while finding wishlist
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle DELETE request to delete course ids from a wishlist
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleDeleteCoursesFromWishlistRequest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const courseIdsRequest: string[] = req.body;
      const isInvalidRequest = !(typeof courseIdsRequest === 'object') || !courseIdsRequest.length;

      if (isInvalidRequest) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const userId = req.userId;

      if (!userId) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const wishlistFound = await getWishlistByUserId(userId);

      if (!wishlistFound) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const courseIdsDatabase = wishlistFound.courseIds;
      const isInvalidCourseIds = !courseIdsRequest.every((courseId) =>
        courseIdsDatabase.includes(courseId)
      );

      if (isInvalidCourseIds) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const wishlist = await deleteCourseIdsByUserId(userId, courseIdsRequest);

      if (!wishlist) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const courseIds = wishlist.courseIds;

      res.send(courseIds);
    } catch (error: unknown) {
      // Catch errors while finding and deleting course ids from wishlist
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
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
