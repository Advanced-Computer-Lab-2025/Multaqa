import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export const StyledIconButton = styled(IconButton)<{ iconType: IconType }>(
  ({ theme, iconType }) => ({
    cursor: "pointer",
    borderRadius: "50%",
    padding: theme.spacing(1),
    color:
      iconType === "delete"
        ? theme.palette.error.main
        : theme.palette.primary.main,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  })
);

export type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark" | "search";