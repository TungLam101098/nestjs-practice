import Category from '@interfaces/category';

class CategoryDTO {
  name: string;

  constructor(category: Category) {
    this.name = category.name;
  }
}

export default CategoryDTO;
