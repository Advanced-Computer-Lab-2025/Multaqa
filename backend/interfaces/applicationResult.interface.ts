import { IEvent } from "./models/event.interface";
import { IVendor } from "./models/vendor.interface";
import { Event_Request_Status } from "../constants/user.constants";

export interface applicationResult {
  vendor?: IVendor; 
  event?: IEvent;
  applicationStatus: Event_Request_Status;
}