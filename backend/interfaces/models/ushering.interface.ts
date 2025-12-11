import { Document, Types } from 'mongoose';



export interface ISlot {
  StartDate: Date;
  EndDate: Date;
  StartTime: string;
  EndTime: string;
  isAvailable: boolean;
  reservedBy?: {
    studentId: Types.ObjectId;
    reservedAt: Date;
  } | null;
  location?: string;
}

export interface ITeam {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  color?: string;
  slots: ISlot[];
}

export interface IUshering extends Document {
postTime?: Date;
  teams: ITeam[]; 
}