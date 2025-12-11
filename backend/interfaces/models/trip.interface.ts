import { IEvent, IWaitlistEntry } from "./event.interface";

export interface ITrip extends IEvent {
  price: number;
  capacity: number;
  waitlist?: IWaitlistEntry[];
}
