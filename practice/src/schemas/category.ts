import mongoose from 'mongoose';

import { STRING } from '@constants';

const Schema = mongoose.Schema;

const Category = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minLength: STRING.CATEGORY_NAME_MIN_LENGTH,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', Category);
