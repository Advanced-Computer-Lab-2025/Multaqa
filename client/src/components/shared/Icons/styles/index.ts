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
      case "primary":
        return theme.palette.primary.main;
      case "tertiary":
        return theme.palette.tertiary.main;
      case "secondary":
        return theme.palette.tertiary.main;

      // default: return undefined so the button can inherit color (allow sx overrides)
      default:
        return undefined;
    }
  };

  const computedColor = getIconColor();

  return {
    cursor: "pointer",
    borderRadius: "50%",
    padding: padding,
    // only set a semantic color when defined; otherwise let the component inherit color
    ...(computedColor ? { color: computedColor } : {}),
    // Use currentColor for the border so it follows the icon color (including sx overrides)
    border: border ? `1px solid currentColor` : "none",

    "&:hover": {
      // Increase border width on hover while keeping the color tied to the icon color
      borderWidth: "2px",
      transition: "all 0.18s ease-in-out",
    },
  };
});

export type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark" | "search" | "warning" | "error" | "success" | "info" | "help"| "primary"
|"secondary"|"tertiary";