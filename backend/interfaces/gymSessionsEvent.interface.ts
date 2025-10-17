import { GYM_SESSION_TYPES } from "../constants/events.constants";
import { IEvent } from "./models/event.interface";

export interface IGymSessionCreationRequest {
    time: string;
    sessionType: GYM_SESSION_TYPES;
    date: Date;
    duration: number;
    trainer: string;
    capacity: number;
}
   
export interface IGymSessionEvent extends IEvent {
  trainer?: string | null;
  sessionType: GYM_SESSION_TYPES;
  capacity: number;
  duration: number;
}
