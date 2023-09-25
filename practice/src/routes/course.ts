import { Router } from 'express';

import CourseController from '@controllers/course-controller';
import validate from '@middlewares/validator';
import { verifyToken } from '@middlewares/auth-handler';
import { courseAddedValidationRules, courseUpdatedValidationRules } from '@validation-rules';

const router = Router();
const courseInstance = CourseController.getInstance();

// Route to handle GET requests for retrieving courses
router.get('/', verifyToken, courseInstance.handleGetCoursesRequest);

// Route to handle GET requests for retrieving course details by id
router.get('/:id', verifyToken, courseInstance.handleGetCourseDetailRequest);

// Route to handle POST requests for creating courses
router.post(
  '/',
  verifyToken,
  courseAddedValidationRules,
  validate,
  courseInstance.handleCreateCoursesRequest
);

// Route to handle PUT requests for update course by id
router.put(
  '/:id',
  verifyToken,
  courseUpdatedValidationRules,
  validate,
  courseInstance.handleUpdateCourseRequest
);

// Route to handle DELETE requests for delete course by id
router.delete('/:id', verifyToken, courseInstance.handleDeleteCourseRequest);

export default router;
