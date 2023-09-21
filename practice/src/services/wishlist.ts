import wishlist from '@schemas/wishlist';
import { Wishlist } from '@interfaces';

/**
 * Saves a new wishlist item to the database
 * @param {Wishlist} wishlistData - The wishlist data to be saved
 * @returns {Promise<Wishlist>} - A promise that resolves to the saved wishlist item
 */
const saveWishlist = async (wishlistData: Wishlist) => await wishlist.create(wishlistData);

/**
 * Retrieves a wishlist item by userId from the database
 * @param {string} userId - The user ID associated with the wishlist item
 * @returns {Promise<Wishlist | null>} - A promise that resolves to the retrieved wishlist item or null if not found
 */
const getWishlistByUserId = async (userId: string) => await wishlist.findOne({ userId }).exec();

/**
 * Updates the 'courseIds' field for a user's wishlist in the database
 * @param {string} userId - The user ID associated with the wishlist item to be updated
 * @param {string[]} courseIds - An array of course IDs to add to the user's wishlist
 * @returns {Promise<Wishlist | null>} - A promise that resolves to the updated wishlist item or null if not found
 */
const updateCourseIdsByUserId = async (userId: string, courseIds: string[]) =>
  await wishlist
    .findOneAndUpdate({ userId }, { $addToSet: { courseIds: { $each: courseIds } } }, { new: true })
    .exec();

/**
 * Delete the ids in 'courseIds' field for a user's wishlist in the database
 * @param {string} userId - The user ID associated with the wishlist item to be updated
 * @param {string[]} courseIds - An array of course IDs to add to the user's wishlist
 * @returns {Promise<Wishlist | null>} - A promise that resolves to the updated wishlist item or null if not found
 */
const deleteCourseIdsByUserId = async (userId: string, courseIds: string[]) =>
  await wishlist
    .findOneAndUpdate({ userId }, { $pull: { courseIds: { $in: courseIds } } }, { new: true })
    .exec();

export { saveWishlist, getWishlistByUserId, updateCourseIdsByUserId, deleteCourseIdsByUserId };
