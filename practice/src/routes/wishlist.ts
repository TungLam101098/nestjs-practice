import { Router } from 'express';

import WishlistController from '@controllers/wishlist-controller';
import { verifyToken } from '@middlewares/auth-handler';

const router = Router();
const wishlistInstance = WishlistController.getInstance();

router.post('/', verifyToken, wishlistInstance.handleAddCourseToWishlistRequest);

export default router;
