import { Wishlist } from '@interfaces';

class WishlistDTO {
  userId: string;
  courseIds: string[];

  constructor(user: Wishlist) {
    this.userId = user.userId;
    this.courseIds = user.courseIds;
  }
}

export default WishlistDTO;
