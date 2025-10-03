"use client";
import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { StyledDeleteButton } from "./styles/index";
import { CustomButtonProps } from "./types/index";
import { styled } from "@mui/material/styles";

const DeleteButton: React.FC<CustomButtonProps> = ({ label="Delete", children, ...props }) => {
  return <StyledDeleteButton {...props} loadingPosition="start">{label || children}</StyledDeleteButton>;
};

export default DeleteButton;
