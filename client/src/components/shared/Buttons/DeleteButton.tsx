"use client";
import React from "react";
import { StyledDeleteButton } from "./styles/index";
import { CustomButtonProps } from "./types/index";

const DeleteButton: React.FC<CustomButtonProps> = ({ label="Delete", children, ...props }) => {
  return <StyledDeleteButton {...props} loadingPosition="start">{label || children}</StyledDeleteButton>;
};

export default DeleteButton;
