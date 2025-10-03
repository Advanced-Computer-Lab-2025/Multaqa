import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FieldType } from '../types';

export const StyledTextField = styled(TextField)<{ fieldType: FieldType; neumorphicBox?: boolean }>(({ neumorphicBox }) => ({
  '& .MuiInput-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fontWeight: 500,
    padding: '2px 8px 2px 0',
    ...(neumorphicBox && {
      '&.MuiInputLabel-sizeSmall': {
        background: '#e5e7eb',
      },
    }),
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#7851da',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7851da',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 18px',
  },
  '& .MuiInput-input': {
    padding: '8px 0', // Adjust values as needed
  },
  '& .MuiInput-underline:before': {
    transition: 'border-bottom-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInput-underline:after': {
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}));
