import { IBugReport } from "../models/bugReport.interface";

export interface IBugReportResponse {
  success: boolean;
  data: IBugReport | IBugReport[];
  message: string;
}

export interface IUpdateBugReportStatusResponse {
  success: boolean;
  message: string;
}
