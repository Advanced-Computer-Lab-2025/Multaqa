import { Types } from "mongoose";
import { Event_Request_Status } from "../constants/user.constants";
import { IEvent } from "./models/event.interface";
import { IVendor } from "./models/vendor.interface";

export interface IBoothAttendee {
  name: string;
  email: string;
}

export interface IPlatformBoothRequestData {
  boothSetupDuration: number; // in weeks
  boothLocation: string;
  boothAttendees: IBoothAttendee[];
  boothSize: "2x2" | "4x4";
  status: Event_Request_Status;
}

export interface IPlatformBooth extends IEvent {
  vendor: IVendor | string;
  RequestData: IPlatformBoothRequestData;
}
