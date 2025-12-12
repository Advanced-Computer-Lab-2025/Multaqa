// TypeScript interfaces for flagged comments feature

export interface ToxicityCategories {
  insult: number;
  threat: number;
  profanity: number;
  hateSpeech: number;
}

export interface FlaggedForToxicity {
  isToxic: boolean;
  score: number;
  categories: ToxicityCategories;
}

export interface Reviewer {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface FlaggedComment {
  reviewId: string;
  eventId: string;
  eventName: string;
  comment: string;
  rating: number;
  reviewer: Reviewer;
  createdAt: string;
  flaggedForToxicity: FlaggedForToxicity;
}

export interface FlaggedCommentsResponse {
  success: boolean;
  data: FlaggedComment[];
  message: string;
}

export interface CommentCardProps {
  comment: FlaggedComment;
  onDelete: (eventId: string, userId: string) => void;
  onBlockUser: (userId: string) => void;
  onFlagSafe: (eventId: string, userId: string) => void;
  isDeleting?: boolean;
  isBlocking?: boolean;
  isFlaggingSafe?: boolean;
}
