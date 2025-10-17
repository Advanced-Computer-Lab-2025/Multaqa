interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BazarFormValues {
  bazaarAttendees: AttendeeInfo[];
  boothSize: string;
}

export interface BazarApplicationFormProps {
  eventId: string;
}