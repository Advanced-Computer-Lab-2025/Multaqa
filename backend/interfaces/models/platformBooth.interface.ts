import { Event_Request_Status } from "../../constants/user.constants";
import { IEvent } from "./event.interface";
import { IVendor } from "./vendor.interface";
import { IFileInfo } from "../fileData.interface";

export interface IBoothAttendee {
  name: string;
  email: string;
  nationalId: IFileInfo;
}

export interface IPlatformBoothRequestData {
  boothSetupDuration: number; // in weeks
  boothLocation: string;
  boothAttendees: IBoothAttendee[];
  boothSize: "2x2" | "4x4";
  status: Event_Request_Status;
  QRCodeGenerated: boolean;
}

export interface IPlatformBooth extends IEvent {
  vendor: IVendor | string;
  RequestData: IPlatformBoothRequestData;
}
