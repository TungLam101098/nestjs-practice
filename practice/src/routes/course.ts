import { Router } from 'express';

import CourseController from '@controllers/course-controller';

const router = Router();
const courseInstance = CourseController.getInstance();

router.post('/', courseInstance.handleCreateCoursesRequest);

export default router;
