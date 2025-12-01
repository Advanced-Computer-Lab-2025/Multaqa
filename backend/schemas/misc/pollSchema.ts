import mongoose, { Schema } from 'mongoose';
import { IPoll } from '../../interfaces/models/poll.interface';

const pollSchema = new Schema<IPoll>({
  title: { type: String, required: true },
  description: { type: String, required: false },
  startDate: { type: Date, default: Date.now },
  deadlineDate: { type: Date, required: true },
  options: [
    new Schema(
      {
        boothId: { type: String, required: true },
        vendorId: { type: String, required: true },
        vendorName: { type: String, required: true },
        vendorLogo: { type: String },
        voteCount: { type: Number, required: true, default: 0 }
      },
      { _id: false }
    )
  ],
  votes: [
    new Schema(
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vendorId: { type: String, required: true },
        votedAt: { type: Date, default: Date.now }
      },
      { _id: false }
    )
  ],
  createdAt: { type: Date, default: Date.now }
});

pollSchema.virtual("isActive").get(function (this: IPoll) {
  return new Date() < this.deadlineDate;
});

pollSchema.set("toObject", { virtuals: true });
pollSchema.set("toJSON", { virtuals: true });

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);