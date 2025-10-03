import React from "react";
import {  TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
export const StyledSearchField = styled(TextField)(({ theme }) => ({
  cursor:"pointer",
  '& .MuiOutlinedInput-root': {
     borderRadius: '50px',
     '&:hover fieldset': {
      borderColor: '#7C5CFF',
    },
  },
   '& .MuiOutlinedInput-input': {
    padding: '12px 18px',
    color: '#333',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    background: "#e5e7eb",
    fontWeight: 500,
    padding: '2px 5px 5px 8px',
    transition: 'all 0.3s ease-out',
  },

}));