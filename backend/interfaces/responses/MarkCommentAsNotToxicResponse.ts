import { IReview } from "../models/review.interface";

export interface MarkCommentAsNotToxicResponse {
  success: boolean;
  data?: IReview;
  message: string;
}
