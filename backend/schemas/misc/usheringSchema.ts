import mongoose, { Schema } from "mongoose";
import { IUshering } from "../../interfaces/models/ushering.interface";



const UsheringSchema = new Schema<IUshering>({
  postTime: { type: Date, required: false },
  teams: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: false },
    slots: [{
      StartDate: { type: Date, required: true  },
      EndDate: { type: Date, required: true  },
      StartTime: { type: String, required: true },
      EndTime: { type: String, required: true },    
      isAvailable: { type: Boolean, default: true},
      reservedBy: {
        studentId: { type: Schema.Types.ObjectId,   ref: 'User'},
        reservedAt: Date
      },
      location: String
    }]
  }]
}) ;

UsheringSchema.set("toObject", { virtuals: true });
UsheringSchema.set("toJSON", { virtuals: true });

export const ushering = mongoose.model<IUshering>('Ushering', UsheringSchema);