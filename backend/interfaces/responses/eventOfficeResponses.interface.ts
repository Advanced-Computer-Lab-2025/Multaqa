import { IWorkshop } from "../workshop.interface";

export interface UpdateWorkshopResponse {
  success: boolean;
  data: IWorkshop;
  message: string;
}
