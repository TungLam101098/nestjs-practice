import { Router } from 'express';

import CourseController from '@controllers/course-controller';
import { verifyToken } from '@middlewares/auth-handler';

const router = Router();
const courseInstance = CourseController.getInstance();

// Route to handle GET requests for retrieving courses
router.get('/', verifyToken, courseInstance.handleGetCoursesRequest);

// Route to handle GET requests for retrieving course details by id
router.get('/:id', verifyToken, courseInstance.handleGetCourseDetailRequest);

// Route to handle POST requests for creating courses
router.post('/', verifyToken, courseInstance.handleCreateCoursesRequest);

export default router;
