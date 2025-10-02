"use client";

import React from "react";
import {  TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// styled wrapper for MUI Button
const StyledSearchField = styled(TextField)(({ theme }) => ({
  cursor:"pointer",
  '& .MuiOutlinedInput-root': {
     borderRadius: '50px',
     
       '&:hover fieldset': {
      borderColor: '#7C5CFF',
    },

  },
   '& .MuiOutlinedInput-input': {
    padding: '14px 18px',
    color: '#333',
    fontWeight: 500,
  },
  '& .MuiInputLabel-root': {
    // color:"#7482aa",
    fontSize: '14px',
    fontWeight: 500,
    transform: 'translate(24px, 14px) scale(1)', 
    
    '&.MuiInputLabel-shrink': {
      transform: 'translate(10px, -9px) scale(0.8)',
      background: '#E7E7E7',
      padding: '0 8px',
    },
  },
    
}));



// Component wrapper
const SearchTextField: React.FC<TextFieldProps> = (props) => {
  return <StyledSearchField {...props}> </StyledSearchField>;
};

export default SearchTextField;

//id="standard-suffix-shrink" label="Search..." variant="standard"