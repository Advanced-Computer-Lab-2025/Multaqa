interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  boothAttendees: AttendeeInfo[];
  boothSetupDuration: number | string;
  boothSize: string;
  boothLocation: string;
}
