
interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  attendees: AttendeeInfo[];
  boothDuration: string;
  boothSize: string;
  selectedBoothId: number | null;
}
