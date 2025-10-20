"use client";

import React, { forwardRef } from "react";
import { TextFieldProps } from "@mui/material";
import { StyledSearchField } from "./styles/index";

// Component wrapper with ref forwarding
const SearchTextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => {
    return <StyledSearchField {...props} ref={ref} />;
  }
);

SearchTextField.displayName = "SearchTextField";

export default SearchTextField;
