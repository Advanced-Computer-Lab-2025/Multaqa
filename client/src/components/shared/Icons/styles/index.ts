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
  })
);

export type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark" | "search";