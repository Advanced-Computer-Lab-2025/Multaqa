export type UploadStatus = "idle" | "uploading" | "success" | "error";

interface AttendeeInfo {
  name: string;
  email: string;
  idPath: string;
}

export interface BazarFormValues {
  bazaarAttendees: AttendeeInfo[];
  boothSize: string;
}

export interface BazarApplicationFormProps {
  eventId: string;
}
