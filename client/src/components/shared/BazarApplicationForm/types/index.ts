interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BazarFormValues {
  attendees: AttendeeInfo[];
  boothSize: string;
}
