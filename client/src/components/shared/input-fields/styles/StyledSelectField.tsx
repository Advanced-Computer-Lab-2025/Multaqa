import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import { SelectFieldType } from '../types';

// Styled MUI Select with support for a neumorphic variant.
// Filters out custom props so they are not passed to the DOM.
export const StyledSelectField = styled(Select, {
  shouldForwardProp: (prop) => prop !== 'fieldType' && prop !== 'neumorphicBox',
})<{ fieldType: SelectFieldType; neumorphicBox?: boolean }>(({ neumorphicBox }) => ({
  width: '100%',
  borderRadius: '50px',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  backgroundColor: 'transparent',

  '& .MuiSelect-select': {
    padding: '12px 40px 12px 18px !important',
    minHeight: 'unset !important',
    display: 'flex',
    alignItems: 'center',
  },

  '& .MuiFormLabel-root': {
    backgroundColor: '#e5e7eb !important',
    '&.Mui-focused': {
      backgroundColor: '#e5e7eb !important',
    },
  },

  '& .MuiInputLabel-root': {
    backgroundColor: '#e5e7eb !important',
    '&.MuiInputLabel-shrink': {
      backgroundColor: '#e5e7eb !important',
    },
  },

  '& .MuiInputLabel-outlined': {
    backgroundColor: 'transparent !important',
    '&.MuiInputLabel-shrink': {
      backgroundColor: 'transparent !important',
      padding: '0 4px',
    },
  },

  ...(neumorphicBox
    ? {
        backgroundColor: 'transparent !important',
        '& .MuiSelect-select': {
          backgroundColor: 'transparent !important',
        },
        '& .MuiOutlinedInput-input': {
          backgroundColor: 'transparent !important',
        },
      }
    : {}),

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

  // Added root-level selectors per user request (duplicated from nested context)
  '&:hover fieldset': {
    borderColor: '#7851da',
  },
  '&.Mui-focused fieldset': {
    borderColor: '#7851da',
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