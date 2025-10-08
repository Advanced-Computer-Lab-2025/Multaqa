"use client";

import React from "react";
import { TextFieldProps } from "@mui/material";
import { StyledSearchField } from "./styles/index";

// Component wrapper
const SearchTextField: React.FC<TextFieldProps> = (props) => {
  return <StyledSearchField {...props}> </StyledSearchField>;
};

export default SearchTextField;
