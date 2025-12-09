import mongoose, { Schema } from 'mongoose';
import { IBugReport } from '../../interfaces/models/bugReport.interface';
import { BUG_REPORT_STATUS } from '../../constants/bugReport.constants';

const bugReportSchema = new Schema<IBugReport>({
    title: { type: String, required: true },
    stepsToReproduce: { type: String, required: true },
    expectedBehavior: { type: String, required: true },
    actualBehavior: { type: String, required: true },
    enviroment: { type: String, required: true },
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(BUG_REPORT_STATUS), default: BUG_REPORT_STATUS.PENDING},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

bugReportSchema.set("toObject", { virtuals: true });
bugReportSchema.set("toJSON", { virtuals: true });

export const BugReport = mongoose.model<IBugReport>('BugReport', bugReportSchema);

