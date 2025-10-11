import { IEvent } from "./event.interface";
import { Event_Request_Status } from "../constants/user.constants";

export interface IWorkshop extends IEvent {
  approvalStatus?: Event_Request_Status;
  fullAgenda?: string;
  associatedFaculty?: string;
  associatedProfs?: string[];
  requiredBudget?: number;
  fundingSource?: string;
  extraRequiredResources?: string[];
  capacity?: number;
  comments?: string; // optional field (since sometimes there are no comments)
}
