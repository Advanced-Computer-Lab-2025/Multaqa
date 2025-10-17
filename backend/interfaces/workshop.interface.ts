import { IEvent } from "./models/event.interface";
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
  comments?: Array<{
    commenter: string; // ObjectId as string
    timestamp: Date;
    text: string;
  }>;
}
