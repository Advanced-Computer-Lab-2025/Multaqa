import { IEvent, IWaitlistEntry } from "./event.interface";
import { Event_Request_Status } from "../../constants/user.constants";

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
    id: number;
    commenter: string; // Events Office name as string
    timestamp: Date;
    text: string;
  }>;
  certificatesSent: boolean;
  certificatesSentAt: Date | null;
  waitlist?: IWaitlistEntry[];
}
