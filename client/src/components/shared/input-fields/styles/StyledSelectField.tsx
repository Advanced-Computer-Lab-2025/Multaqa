import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectFieldType } from '../types';

export const StyledSelectField = styled(Select)<{ fieldType: SelectFieldType; neumorphicBox?: boolean }>(({ neumorphicBox }) => ({
  width: '100%',
  borderRadius: '50px',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  ...(neumorphicBox && {
    backgroundColor: '#e5e7eb',
  }),
  
  '& .MuiSelect-select': {
    padding: '12px 40px 12px 18px !important',
    minHeight: 'unset !important',
    display: 'flex',
    alignItems: 'center',
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    borderRadius: '50px',
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
  
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
  },
  
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent',
    borderWidth: '1px',
  },
  
  '& .MuiSelect-icon': {
    color: '#7851da',
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    right: '12px',
  },
  
  '&.Mui-focused .MuiSelect-icon': {
    transform: 'rotate(180deg)',
  },
  
  '& .MuiInputBase-input': {
    padding: '12px 18px',
  },
}));