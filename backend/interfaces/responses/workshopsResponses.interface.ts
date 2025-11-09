import { IEvent } from "../models/event.interface";
import { IWorkshop } from "../models/workshop.interface";

export interface CreateWorkshopResponse {
  success: boolean;
  data: IEvent;
  message: string;
}

export interface UpdateWorkshopResponse {
  success: boolean;
  data: IWorkshop;
  message: string;
}

export interface UpdateWorkshopStatusResponse {
  success: boolean;
  data: IWorkshop;
  message: string;
}

export interface SendCertificatesResponse {
  success: boolean;
  message: string;
}