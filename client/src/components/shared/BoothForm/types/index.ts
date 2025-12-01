import { IFileInfo } from "../../../../../../backend/interfaces/fileData.interface";

interface AttendeeInfo {
  name: string;
  email: string;
  nationalId: IFileInfo | null;
}

export interface BoothFormValues {
  boothAttendees: AttendeeInfo[];
  boothSetupDuration: number | string;
  boothSize: string;
  boothLocation: string;
  price: number;
}
