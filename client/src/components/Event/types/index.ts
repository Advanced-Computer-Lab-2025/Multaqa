import { SvgIconComponent } from "@mui/icons-material";

type BasicProps = {
  user?: string,
  registered?: boolean,
  onDelete?: () => void,
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  id: string,
  userInfo?: any;
  background: string,
  icon: SvgIconComponent;
  attended?: boolean;
  isRegisteredEvent?: boolean;
  datePassed?: boolean;
  registrationPassed?: boolean;
  archived?: boolean;
  allowedUsers?: string[];
}
export type BazarViewProps = BasicProps & {
  details: Record<string, string>;
  name: string;
  vendors?: any;
  description: string;
  registrationDeadline?: any;
  vendorStatus?: string;
  calendarButton?: React.ReactNode;
};

//names and emails of a max of 5 individuals attending, duration of booth set up, location of booth setup, booth size 
export type BoothViewProps = BasicProps & {
  company: string,
  people?: { name: string; email: string }[];
  description: string,
  details: Record<string, string>,
  payButton?: React.ReactNode;
  vendorStatus?: string;
  isRequested?:boolean;
  calendarButton?: React.ReactNode;
}

//create conferences by adding the  start and end dates and times, full agenda, conference website link, required budget, source of funding (extrernal or GUC), extra required resources

//details => start date, end date, start time, end time, required budget, source of funcing, extra required resources, link
export type ConferenceViewProps = BasicProps & {
  name: string,
  description: string,
  agenda: string,
  cachedProfessors?: { firstName: string, lastName: string }[],
  details: Record<string, string>,
}

//create workshops by adding the workshop name, location (GUC Cairo or GUC Berlin), start and end dates and times, short description, full agenda, faculty responsible (MET, IET, etc..), professor(s) participating, required budget, funding source (external or GUC), extra required resources, capacity, registeration deadline

//details => start date, end date, start time, end time, location ,faculty responsible , professors participating , required budget, funding source, extra required resources, capacity, registration deadline
type Attendee = {
  email: string;
  firstName: string;
  lastName: string;
  _id: string;
};

type AttendeesArray = Attendee[];

export type WorkshopViewProps = BasicProps & {
  name: string,
  description: string,
  agenda: string,
  professors: string[],
  professorsId: string[],
  details: Record<string, string>,
  professorStatus?:string;
  evaluateButton?:React.ReactNode;
  commentButton?:React.ReactNode;
  attendees?: AttendeesArray;
  registrationDeadline?: any;
}