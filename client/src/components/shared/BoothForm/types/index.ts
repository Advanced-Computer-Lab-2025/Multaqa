import type { UploadStatus } from "../../FileUpload/types";

interface AttendeeInfo {
  name: string;
  email: string;
  idPath: string;
}

export interface BoothFormValues {
  boothAttendees: AttendeeInfo[];
  boothSetupDuration: number | string;
  boothSize: string;
  boothLocation: string;
}
