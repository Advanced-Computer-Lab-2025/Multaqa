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
    background: "#e5e7eb",
    fontWeight: 500,
    padding: '2px 0px 0px 8px',
    transition: 'all 0.3s ease-out',
  },

}));



// Component wrapper
const SearchTextField: React.FC<TextFieldProps> = (props) => {
  return <StyledSearchField {...props}> </StyledSearchField>;
};

export default SearchTextField;

//id="standard-suffix-shrink" label="Search..." variant="standard"