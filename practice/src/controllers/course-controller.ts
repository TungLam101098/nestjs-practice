import { NextFunction, Response } from 'express';

import {
  getCoursesByName,
  saveCourses,
  getCourses,
  getCourseById,
  deleteCourseById,
  updateCourseById,
  getCoursesByCondition,
} from '@services/course';
import { ensureError, logger } from '@utils';
import { AuthenticatedRequest, Course } from '@interfaces';
import { EXCEPTIONS } from '@constants';

let courseInstance: CourseController | null = null;

class CourseController {
  /**
   * Handle GET request to user create courses
   * @param {AuthenticatedRequest} req - authenticated request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - The next middleware function in the processing chain
   */
  async handleCreateCoursesRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // TODO: Verify the body request using middleware
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
      // Catch errors while finding or saving courses: missing field, course name is existed..
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle GET request to retrieve a list of courses
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleGetCoursesRequest(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const courses = await getCourses();

      res.send({ courses });
    } catch (error) {
      // Catch errors while finding courses
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.SERVICE_UNAVAILABLE_EXCEPTION);
    }
  }

  /**
   * Handle GET request to retrieve details of a specific course by its id
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleGetCourseDetailRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      const course = await getCourseById(courseId);

      res.send(course);
    } catch (error) {
      // Catch errors while finding course
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
    }
  }

  /**
   * Handle PUT request to update a course by its id
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleUpdateCourseRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // TODO: Verify the body request using middleware
    try {
      const isNotAdmin = !req.isAdmin;

      if (isNotAdmin) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const { name, category, description }: Course = req.body;
      const isInvalidRequest = !name || !category || !description;

      if (isInvalidRequest) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      const courseId = req.params.id;

      // Verify courseId valid
      await getCourseById(courseId);

      const coursesFoundByName = await getCoursesByCondition({ name });
      const isExistsCourses = !!coursesFoundByName.length;

      if (isExistsCourses) {
        return next(EXCEPTIONS.COURSES_NAME_EXISTS_EXCEPTION);
      }

      const course = await updateCourseById(courseId, req.body);

      res.send(course);
    } catch (error) {
      // Catch errors while finding by id, name and updating course
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
    }
  }

  /**
   * Handle DELETE request to delete a course by its id
   * @param {AuthenticatedRequest} req - The authenticated request object
   * @param {Response} res - The response object
   * @param {NextFunction} next - The next middleware function
   */
  async handleDeleteCourseRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const isNotAdmin = !req.isAdmin;

      if (isNotAdmin) {
        return next(EXCEPTIONS.PERMISSION_DENIED_EXCEPTION);
      }

      const courseId = req.params.id;
      const course = await deleteCourseById(courseId);

      if (!course) {
        return next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
      }

      res.send(course);
    } catch (error) {
      // Catch errors while deleting course: courseId not found...
      const { message } = ensureError(error);
      logger.error(message);

      next(EXCEPTIONS.BAD_REQUEST_EXCEPTION);
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
