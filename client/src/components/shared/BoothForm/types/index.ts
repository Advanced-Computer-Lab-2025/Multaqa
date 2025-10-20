interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  boothAttendees: AttendeeInfo[];
  boothSetupDuration: number;
  boothSize: string;
  boothLocation: string;
}
