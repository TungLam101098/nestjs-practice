import { Router } from 'express';

import WishlistController from '@controllers/wishlist-controller';
import validate from '@middlewares/validator';
import { verifyToken } from '@middlewares/auth-handler';
import { wishlistValidationRules } from '@validation-rules';

const router = Router();
const wishlistInstance = WishlistController.getInstance();

router.post(
  '/',
  verifyToken,
  wishlistValidationRules,
  validate,
  wishlistInstance.handleAddCourseToWishlistRequest
);

router.get('/', verifyToken, wishlistInstance.handleGetWishlistRequest);

router.delete('/', verifyToken, wishlistInstance.handleDeleteCoursesFromWishlistRequest);

export default router;
