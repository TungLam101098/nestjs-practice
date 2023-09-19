import { Request, NextFunction, Response } from 'express';

let courseInstance: CourseController | null = null;

class CourseController {
  /**
   * Handle user create courses requests
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next - The next middleware function in the processing chain
   */
  async handleCreateCoursesRequest(_req: Request, res: Response, _next: NextFunction) {
    // TODO: Create courses request
    res.send('Post courses successfully');
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
