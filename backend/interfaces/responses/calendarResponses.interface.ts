export interface GetAuthUrlResponse {
  success: boolean;
  message: string;
  url: string;
}

export interface CalendarCallbackResponse {
  success: boolean;
  message: string;
}

export interface AddEventResponse {
  success: boolean;
  message: string;
  event: any;
}
