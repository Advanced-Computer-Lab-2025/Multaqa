import { Document, Schema } from "mongoose";

export interface IPollOption {
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  voteCount: number;
}

export interface IPollVote {
  userId: Schema.Types.ObjectId;
  vendorId: string;
  votedAt: Date;
}

export interface IPoll extends Document{
  title: string;
  description: string;
  startDate: Date; 
  endDate: Date;  
  options: IPollOption[];
  votes: IPollVote[];
  isActive: boolean;
  createdAt: Date;
}