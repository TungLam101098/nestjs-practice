import mongoose from 'mongoose';

import { STRING } from '@constants';

const Schema = mongoose.Schema;

const Course = new Schema(
  {
    name: { type: String, required: true, unique: true, minLength: STRING.COURSE_NAME_MIN_LENGTH },
    description: { type: String },
    category: { type: String, required: true, minLength: STRING.CATEGORY_NAME_MIN_LENGTH },
  },
  { timestamps: true }
);

export default mongoose.model('Course', Course);
