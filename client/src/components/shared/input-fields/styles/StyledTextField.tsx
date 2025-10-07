import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FieldType, StakeholderType } from '../types';
import theme from "@/themes/lightTheme";

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'fieldType' && prop !== 'neumorphicBox' && prop !== 'stakeholderType',
})<{ fieldType: FieldType, neumorphicBox?: boolean, stakeholderType?: StakeholderType }>(({ neumorphicBox, fieldType, stakeholderType }) => ({
  '& .MuiInput-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInputLabel-root': {
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fontWeight: 500,
    fontSize: '1rem',
    padding: '2px 8px 2px 0',
    width: 'fit-content',
    maxWidth: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    whiteSpace: 'nowrap',
    color: '#999',
    '& svg': {
      color: '#999',
      transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    '&.Mui-focused': {
      color: theme.palette.tertiary.main,
      '& svg': {
        color: theme.palette.tertiary.main,
      },
    },
    '&.MuiFormLabel-filled': {
      color: theme.palette.tertiary.main,
      '& svg': {
        color:theme.palette.tertiary.main,
      },
    },
    '& .MuiInputLabel-asterisk': {
      color: '#b81d1d',
      display: 'inline',
      marginLeft: '2px',
    },
    ...(neumorphicBox && {
      '&.MuiInputLabel-sizeSmall': {
        background: theme.palette.background.default,
      },
    }),
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.tertiary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 0px 12px 18px',
    fontSize: '1rem',
    fontWeight: 500,
    '&::placeholder': {
      color: '#999',
      opacity: 1,
      fontWeight: 500,
    },
    ...(fieldType === 'email' && ['student', 'staff', 'ta', 'professor', 'admin', 'events-office'].includes(stakeholderType as string) && {
      textAlign: 'right',
    }),
  },
  '& .MuiInput-input': {
    padding: '8px 16px',
    fontSize: '1rem',
    fontWeight: 500,
    '&::placeholder': {
      color: '#999',
      opacity: 1,
      fontWeight: 500,
    },
    ...(fieldType === 'email' && ['student', 'staff', 'ta', 'professor', 'admin', 'events-office'].includes(stakeholderType as string) && {
      textAlign: 'right',
    }),
  },
  '& .MuiInput-underline:before': {
    transition: 'border-bottom-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '& .MuiInput-underline:after': {
    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
}));
