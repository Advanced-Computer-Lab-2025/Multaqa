import { ButtonProps } from "@mui/material";

export type BazarViewProps = {
  details: Record<string, string>;
  name: string;
  description: string;
};

//names and emails of a max of 5 individuals attending, duration of booth set up, location of booth setup, booth size 
export type BoothViewProps ={
  company: string,
  people?: Record<string, {id:string, name:string, email:string}>
  details: Record <string, string>,
}