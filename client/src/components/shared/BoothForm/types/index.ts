
interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  attendees: AttendeeInfo[];
  startDate: Date | null;
  endDate: Date | null;
  boothSize: string;
  selectedBoothId: number | null;
}
