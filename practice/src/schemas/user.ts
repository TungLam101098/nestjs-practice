import mongoose from 'mongoose';

import { STRING } from '@constants';

const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true, minLength: STRING.USERNAME_MIN_LENGTH },
    password: { type: String, required: true, minLength: STRING.PASSWORD_MIN_LENGTH },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', User);
