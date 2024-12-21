import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: { type: Array, default: [] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  date: { type: Date, default: Date.now },
}, {
  timestamps: true
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;