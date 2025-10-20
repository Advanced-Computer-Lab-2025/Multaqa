interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  boothAttendees: AttendeeInfo[];
  boothSetupDuration: number | null;
  boothSize: string;
  boothLocation: string;
}
