import React from "react";
import {  TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
export const StyledSearchField = styled(TextField)(({ theme }) => ({
  color:theme.palette.primary.main,
  cursor:"pointer",
  '& .MuiOutlinedInput-root': {
     borderRadius: '50px',
     '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
   '& .MuiOutlinedInput-input': {
    padding: '12px 18px',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    fontWeight: 600,
    fontSize:"16px",
    padding:"3px 0px",
    transition: 'all 0.3s ease-out',
  },

}));