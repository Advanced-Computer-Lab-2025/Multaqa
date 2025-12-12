import mongoose, { Schema } from "mongoose";
import { IUshering } from "../../interfaces/models/ushering.interface";



const UsheringSchema = new Schema<IUshering>({
  postTime: {  
    startDateTime: { type: Date, required: false },
    endDateTime: { type: Date, required: false }
  },
  teams: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    slots: [{
      StartDateTime: { type: Date, required: true  },
      EndDateTime: { type: Date, required: true  },   
      isAvailable: { type: Boolean, default: true},
      location: { type: String, required: false },
      reservedBy: {
        studentId: { type: Schema.Types.ObjectId,   ref: 'User'},
        reservedAt: Date
      },
    }]
  }]
}) ;

UsheringSchema.set("toObject", { virtuals: true });
UsheringSchema.set("toJSON", { virtuals: true });

export const ushering = mongoose.model<IUshering>('Ushering', UsheringSchema);