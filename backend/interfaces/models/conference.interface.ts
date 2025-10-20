import { IEvent } from "./event.interface";

export interface IConference extends IEvent {
  fullAgenda: string;
  websiteLink: string;
  requiredBudget: number;
  fundingSource: string;
  extraRequiredResources: string[];
}
