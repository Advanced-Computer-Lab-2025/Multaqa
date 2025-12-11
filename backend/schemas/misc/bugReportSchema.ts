import mongoose, { Schema } from 'mongoose';
import { IBugReport } from '../../interfaces/models/bugReport.interface';
import { BUG_REPORT_STATUS } from '../../constants/bugReport.constants';

const bugReportSchema = new Schema<IBugReport>({
    title: { type: String, required: true },
    stepsToReproduce: { type: String, required: true },
    expectedBehavior: { type: String, required: true },
    actualBehavior: { type: String, required: true },
    environment: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(BUG_REPORT_STATUS), default: BUG_REPORT_STATUS.PENDING},
    date: { type: Date, required: true }
});

bugReportSchema.set("toObject", { virtuals: true });
bugReportSchema.set("toJSON", { virtuals: true });

export const BugReport = mongoose.model<IBugReport>('BugReport', bugReportSchema);

