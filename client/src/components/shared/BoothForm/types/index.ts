interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
//   attendees: AttendeeInfo[];
//   setupDuration: string;
  boothSize: string;
  selectedBoothId: number | null;
}
