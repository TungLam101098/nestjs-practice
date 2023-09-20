import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { STRING, TOKEN } from '@constants';

const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: { type: String, required: true, unique: true, minLength: STRING.USERNAME_MIN_LENGTH },
    password: { type: String, required: true, minLength: STRING.PASSWORD_MIN_LENGTH },
    email: { type: String, required: true },
    isAdmin: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

/**
 * Middleware function executed before saving a User instance.
 * It hashes the user's password if it has been modified before saving.
 * @param {function} next - A callback function to continue the save operation.
 */
User.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashedPassword = bcrypt.hashSync(this.password, TOKEN.SALT_ROUNDS);
  this.password = hashedPassword;

  next();
});

export default mongoose.model('User', User);
