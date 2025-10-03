import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const StyledIconButton = styled(IconButton)<{
  iconType: IconType;
  padding: string;
  border?: boolean;
}>(({ theme, iconType, padding, border = true }) => ({
  cursor: "pointer",
  borderRadius: "50%",
  padding: padding,
  color:
    iconType === "delete"
      ? theme.palette.error.main
      : theme.palette.primary.main,
  border: border ? "1px solid #b6b7ba" : "none",

  "&:hover": {
    borderColor:
      iconType === "delete"
        ? theme.palette.error.main
        : theme.palette.primary.main,
    borderWidth: "2px",
    transition: "all 0.3 ease-in-out",
  },
}));

export type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark" | "search";