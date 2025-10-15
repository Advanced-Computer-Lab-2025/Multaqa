import { IReview } from "../review.interface";

// !!!!!!! Sprint 2 !!!!!!!!
// To be revised then 

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