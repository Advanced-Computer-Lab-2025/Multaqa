import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'iconType' && prop !== 'padding' && prop !== 'border',
})<{
  iconType: IconType;
  padding: string;
  border?: boolean;
}>(({ theme, iconType, padding, border = true }) => {
  // Define colors for different icon types
  const getIconColor = () => {
    switch (iconType) {
      case "delete":
      case "error":
        return theme.palette.error.main;
      case "success":
        return "#4caf50";
      case "warning":
        return "#ff9800";
      case "info":
      case "help":
        return "#2196f3";
      default:
        return theme.palette.primary.main;
    }
  };

  return {
    cursor: "pointer",
    borderRadius: "50%",
    padding: padding,
    color: getIconColor(),
    border: border ? "1px solid #b6b7ba" : "none",

    "&:hover": {
      borderColor: getIconColor(),
      borderWidth: "2px",
      transition: "all 0.3 ease-in-out",
    },
  };
});

export type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark" | "search" | "warning" | "error" | "success" | "info" | "help";