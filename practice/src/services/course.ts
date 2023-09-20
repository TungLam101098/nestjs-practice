import course from '@schemas/course';

import { Course } from '@interfaces';

/**
 * Get all courses from the database.
 * @returns {Promise<Course[]>} - A promise that resolves to an array of all courses.
 */
const getCourses = async () => await course.find({}).exec();

/**
 * Get a course by its ID from the database.
 * @param {string} id - The ID of the course to retrieve.
 * @returns {Promise<Course | null>} - A promise that resolves to the retrieved course or null if not found.
 */
const getCourseById = async (id: string) => await course.findById(id).exec();

/**
 * Get courses by their names from the database
 * @param {string[]} names - An array of course names to search for
 * @returns {Promise<Course[]>} - A promise that resolves to an array of matching courses
 */
const getCoursesByName = async (names: string[]) =>
  await course.find({ name: { $in: names } }).exec();

/**
 * Save an array of courses to the database
 * @param {Course[]} courseData - An array of course data to be saved
 * @returns {Promise<Course[]>} - A promise that resolves to an array of saved courses
 */
const saveCourses = async (courseData: Course[]) => {
  const courseFunctions = courseData.map((courseInfo) => course.create(courseInfo));
  const savedCourses = await Promise.all(courseFunctions);

  return savedCourses;
};

/**
 * Update a course by its ID in the database
 * @param {string} id - The ID of the course to be updated
 * @param {Course} courseData - The updated course data
 * @returns {Promise<Course | null>} - A promise that resolves to the updated course or null if not found
 */
const updateCoursesById = async (id: string, courseData: Course) =>
  await course
    .findOneAndUpdate({ _id: id }, courseData, {
      new: true,
    })
    .exec();

export { getCourses, getCourseById, getCoursesByName, saveCourses, updateCoursesById };
