import { Document ,Types} from "mongoose";
import { IUser } from "./user.interface";
import { BUG_REPORT_STATUS } from "../../constants/bugReport.constants";

 export interface IBugReport extends Document{
    title: string;  
    stepsToReproduce: string;
    expectedBehavior: string;
    actualBehavior: string;
    enviroment: string;
    createdBy:  Types.ObjectId;
    status: BUG_REPORT_STATUS;
    date: Date;
}