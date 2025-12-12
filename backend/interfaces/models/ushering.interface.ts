import { Document, Types } from 'mongoose';



export interface ISlot {
  _id?: Types.ObjectId;
  StartDateTime: Date;
  EndDateTime: Date;
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
  slots: ISlot[];
}

export interface IReservedSlot {
  team: {
     title: string;
     description: string;
      };
  slot: ISlot; 
}

export interface IUshering extends Document {
postTime?: Date;
  teams: ITeam[]; 
}

