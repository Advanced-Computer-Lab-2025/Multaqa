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
  title: string;
  description: string;
  slots: ISlot[];
}

export interface IUshering extends Document {
  notes?: string;
  teams: ITeam[]; 
}