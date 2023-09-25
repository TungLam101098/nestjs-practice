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

export { saveCategory };
