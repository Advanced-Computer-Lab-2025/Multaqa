import { IFileInfo } from "../../../../../../backend/interfaces/fileData.interface";
interface AttendeeInfo {
  name: string;
  email: string;
  nationalId: IFileInfo | null;
}

export interface BazarFormValues {
  bazaarAttendees: AttendeeInfo[];
  boothSize: string;
  price: number;
}

export interface BazarApplicationFormProps {
  eventId: string;
  location: string;
}
