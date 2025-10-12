import { PickerValue } from "@mui/x-date-pickers/internals";

interface AttendeeInfo {
  name: string;
  email: string;
}

export interface BoothFormValues {
  attendees: AttendeeInfo[];
  startDate: PickerValue | null;
  endDate: PickerValue | null;
  boothSize: string;
  selectedBoothId: number | null;
}
