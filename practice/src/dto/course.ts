import { Course } from '@interfaces';

class CourseDTO {
  name: string;
  category: string;
  description?: string;

  constructor(user: Course) {
    this.name = user.name;
    this.category = user.category;
    this.description = user.description || '';
  }
}

export default CourseDTO;
