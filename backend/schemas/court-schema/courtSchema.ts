import mongoose, { Schema } from "mongoose";
import { TIME_SLOTS } from "../../constants/court.constants";
import { ICourt } from "../../interfaces/models/court.interface";

const courtSchema = new Schema<ICourt>({
  type: {
    type: String,
    enum: ['basketball', 'tennis', 'football'],
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