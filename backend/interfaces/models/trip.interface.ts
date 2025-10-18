import { IEvent } from "./event.interface";

export interface ITrip extends IEvent {
  price: number;
  capacity: number;
}
