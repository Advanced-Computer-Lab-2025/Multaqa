import { ButtonProps } from "@mui/material";
type BasicProps = {
  user?: string,
  registered?: boolean,
  onDelete?: () => void,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  id:string,
  userInfo:{ id: string; name: string; email:string };
  isReady:boolean;
}
export type BazarViewProps = BasicProps & {
  details: Record<string, string>;
  name: string;
  vendors?: string[],
  description: string;
};

//names and emails of a max of 5 individuals attending, duration of booth set up, location of booth setup, booth size 
export type BoothViewProps = BasicProps & {
  company: string,
  people?: { name: string; email: string }[];
  details: Record<string, string>,
}

//create conferences by adding the  start and end dates and times, full agenda, conference website link, required budget, source of funding (extrernal or GUC), extra required resources

//details => start date, end date, start time, end time, required budget, source of funcing, extra required resources, link
export type ConferenceViewProps = BasicProps & {
  name: string,
  description: string,
  agenda: string,
  details: Record<string, string>,
}

//create workshops by adding the workshop name, location (GUC Cairo or GUC Berlin), start and end dates and times, short description, full agenda, faculty responsible (MET, IET, etc..), professor(s) participating, required budget, funding source (external or GUC), extra required resources, capacity, registeration deadline

//details => start date, end date, start time, end time, location ,faculty responsible , professors participating , required budget, funding source, extra required resources, capacity, registration deadline

export type WorkshopViewProps = BasicProps & {
  name: string,
  description: string,
  agenda: string,
  professors:string []
  details: Record<string, string>,
}