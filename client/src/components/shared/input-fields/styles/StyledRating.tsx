import { Rating } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledRating = styled(Rating)<{ multaqaFill?: boolean }>(({ 
  theme, 
  multaqaFill 
}) => ({
  '& .MuiRating-iconFilled': {
    color: multaqaFill ? theme.palette.tertiary.main: '#faaf00',
    transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiRating-iconHover': {
    color: multaqaFill ? '#6842C0' : '#ff9800',
    transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiRating-iconEmpty': {
    transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}));