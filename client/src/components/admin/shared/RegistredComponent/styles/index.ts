import Chip from '@mui/material/Chip';
import { styled } from "@mui/material/styles";

export const StyledIdChip = styled(Chip)(({ theme }) => ({
  fontSize: "12px",
  "MuiChip-root": {
    borderRadius: "50px",
    padding: "2px 2px",
    fontFamily: "var(--font-poppins), system-ui, sans-serif",
    textTransform: "none",
    letterSpacing: "0.5px",
    fontWeight: 900,
    width: "w-fit",
  },
  ".MuiChip-avatarColorPrimary ": {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    border: `1px solid ${theme.palette.primary.main}`
  }
}));