import { BoxProps } from "@mui/material";

export interface CustomBoxProps extends BoxProps {
  containerType: "inwards" | "outwards";
  padding?: string | number;
  margin?: string | number;
  width?: string;
  height?: string;
  borderRadius?: string | number;
}

export interface ManagementCardProps {
  id: string;
  name: string;
  email: string;
  details: React.ReactNode;
  statusComponent: React.ReactNode;
  actions: React.ReactNode;
  hoverBorderColor: string;
  hoverBoxShadow: string;
}
