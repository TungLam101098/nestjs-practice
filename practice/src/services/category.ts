import category from '@schemas/category';
import CategoryDTO from '@dto/category';
import Category from '@interfaces/category';

/**
 * Save category data into database
 * @param {Category} category data to save database
 * @return {Category} category is saved into database
 */
const saveCategory = async (categoryData: Category) => {
  const categoryDTO = new CategoryDTO(categoryData);

  return await category.create(categoryDTO);
};

/**
 * Get all categories from the database
 * @returns {Promise<Category[]>} - A promise that resolves to an array of all categories
 */
const getCategories = async () => await category.find({}).exec();

/**
 * Get categories by their name from the database
 * @param {string[]} names - An array of category name to search for
 * @returns {Promise<Category[]>} - A promise that resolves to an array of matching categories
 */
const getCategoryByName = async (name: string) => await category.findOne({ name }).exec();

export { saveCategory, getCategories, getCategoryByName };
