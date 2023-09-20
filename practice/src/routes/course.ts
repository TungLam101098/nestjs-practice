import { Router } from 'express';

import CourseController from '@controllers/course-controller';
import { verifyToken } from '@middlewares/auth-handler';

const router = Router();
const courseInstance = CourseController.getInstance();

router.post('/', verifyToken, courseInstance.handleCreateCoursesRequest);

export default router;
