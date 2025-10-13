import mongoose, { Schema } from "mongoose";
import { ICourt } from "../../interfaces/models/court.interface";
import { TIME_SLOTS, COURT_TYPES } from "../../constants/court.constants";

const courtSchema = new Schema<ICourt>({
  type: {
    type: String,
    enum: Object.values(COURT_TYPES),
    required: true
  },
  reservations: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    slot: {
      type: String, 
      enum: Object.values(TIME_SLOTS)
    }
  }]
},
{collection: 'court'}
);

courtSchema.set("toObject", { virtuals: true });
courtSchema.set("toJSON", { virtuals: true });

export const Court = mongoose.model<ICourt>('Court', courtSchema);