
import { IAvailableSlots } from "../models/court.interface";

export interface getAvailableCourtsResponse {
  success: boolean;
  data: IAvailableSlots;
  message: string;
}