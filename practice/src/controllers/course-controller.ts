import { NextFunction, Response } from 'express';

import { getCoursesByName, saveCourses } from '@services/course';
import { ensureError, logger } from '@utils';
import { AuthenticatedRequest, Course } from '@interfaces';
import { EXCEPTIONS } from '@constants';

let courseInstance: CourseController | null = null;

class CourseController {
  /**
   * Handle user create courses requests
   * @param {AuthenticatedRequest} req - AuthenticatedRequest object
   * @param {Response} res - Response object
   * @param {NextFunction} next - The next middleware function in the processing chain
   */
  async handleCreateCoursesRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // TODO: Update verify the body request using middleware
    try {
      const isNotAdmin = !req.isAdmin;

      if (isNotAdmin) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const isInvalidRequest = typeof req.body !== 'object' || !req.body.length;

      if (isInvalidRequest) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const courseNames = req.body.map((course: Course) => course.name);
      const foundCourses = await getCoursesByName(courseNames);
      const isExistsCourses = !!foundCourses.length;

      if (isExistsCourses) {
        return next(EXCEPTIONS.COURSES_NAME_EXISTS_EXCEPTION);
      }

      const courses = await saveCourses(req.body);

      res.send({ courses });
    } catch (error) {
      // Catch error while finding or saving courses: missing field, course name is existed..
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Get singleton course controller instance
   */
  static getInstance() {
    if (!courseInstance) {
      courseInstance = new CourseController();
    }

    return courseInstance;
  }
}

export default CourseController;
