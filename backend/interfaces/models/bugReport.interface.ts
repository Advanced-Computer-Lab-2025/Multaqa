import { Schema } from "mongoose";
import { IUser } from "./user.interface";
import { BUG_REPORT_STATUS } from "../../constants/bugReport.constants";

 export interface IBugReport {
    title: string;  
    stepsToReproduce: string;
    expectedBehavior: string;
    actualBehavior: string;
    enviroment: string;
    reporterId:   IUser | Schema.Types.ObjectId;
    status:BUG_REPORT_STATUS;
    createdAt: Date;
    updatedAt: Date;
}