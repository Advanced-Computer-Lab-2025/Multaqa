import { Schema } from "mongoose";
import { IReview } from "../../interfaces/review.interface";

export const reviewSchema = new Schema<IReview>({
  reviewerId: { type: String, required: true, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
});
