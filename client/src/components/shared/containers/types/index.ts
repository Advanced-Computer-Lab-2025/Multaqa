import { BoxProps } from "@mui/material";

export interface CustomBoxProps extends BoxProps {
  containerType: "inwards" | "outwards";
  padding?: string | number;
  margin?: string | number;
  width?: string;
  height?: string;
  borderRadius?: string | number;
}
