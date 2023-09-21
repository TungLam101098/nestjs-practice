import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Wishlist = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    courseIds: { type: Array, required: true, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('Wishlist', Wishlist);
