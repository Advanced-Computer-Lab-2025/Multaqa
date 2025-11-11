import { IReview } from "../models/review.interface";

export interface CreateReviewResponse {
  success: boolean;
  data: IReview;
  message: string;
}

export interface UpdateReviewResponse {
  success: boolean;
  data: IReview;
  message: string;
}

export interface GetReviewByIdResponse {
  success: boolean;
  data: IReview;
  message?: string;
}

export interface GetAllReviewsByEventResponse {
  success: boolean;
  data: IReview[];
  message: string;
}

export interface DeleteReviewResponse {
  success: boolean;
  message: string;
}