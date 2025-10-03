import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FieldType } from '../types';

export const StyledTextField = styled(TextField)<{ fieldType: FieldType }>(() => ({
  '& .MuiInput-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInput-underline:before': {
    transition: 'border-bottom-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInput-underline:after': {
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}));
