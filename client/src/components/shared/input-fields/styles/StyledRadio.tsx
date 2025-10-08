import { Radio } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledRadio = styled(Radio)<{ multaqaFill?: boolean }>(({ 
  theme, 
  multaqaFill 
}) => ({
  color: theme.palette.primary.dark,
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  '&.Mui-checked': {
    color: theme.palette.tertiary.main,
    filter: `
      drop-shadow(-3px -3px 6px #FAFBFF)
      drop-shadow(3px 3px 6px rgba(22, 27, 29, 0.25))
    `,
  },
  
  '&:hover': {
    backgroundColor: 'rgba(120, 81, 218, 0.04)',
  },
  
  '& .MuiSvgIcon-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  
  // Unchecked box shadow (similar to search bar)
  '&:not(.Mui-checked) .MuiSvgIcon-root': {
    filter: `
      drop-shadow(-2px -2px 4px #FAFBFF)
      drop-shadow(2px 2px 4px rgba(22, 27, 29, 0.25))
    `,
  },
}));
