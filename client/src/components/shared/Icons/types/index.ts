import { IconButtonProps } from "@mui/material";
import { IconType } from "../styles";

export interface CustomIconProps extends IconButtonProps {
  icon: IconType;
  containerType?: "inwards" | "outwards";
}
