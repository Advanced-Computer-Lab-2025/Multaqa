"use client";
import React from "react";
import NeumorphicBox from "../containers/NeumorphicBox";
import {StyledIconButton, IconType } from "./styles/index"
import { CustomIconProps } from "./types";
import { iconComponents } from "./utils";

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  size = "small",
  containerType="inwards",
  ...props
}) => {
  // Look up the icon component from the map based on the prop
  const IconComponent = iconComponents[icon];

  // A fallback in case an invalid icon name is somehow passed
  if (!IconComponent) {
    return null;
  }

  // Determine container size based on icon size to create a perfect circle
  const getContainerSize = () => {
    switch (size) {
      case "small":
        return { size: "40px", padding: "8px" };
      case "medium":
        return { size: "48px", padding: "12px" };
      case "large":
        return { size: "56px", padding: "16px" };
      default:
        return { size: "40px", padding: "8px" };
    }
  };

  const { size: containerSize, padding } = getContainerSize();

  return (
    <NeumorphicBox
      containerType={containerType}
      width={containerSize}
      height={containerSize}
      padding="0px"
      borderRadius="50%"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50% !important",
        margin: "8px",
      }}
    >
      <StyledIconButton
        iconType={icon}
        {...props}
        sx={{
          padding: padding,
          minWidth: "unset",
          minHeight: "unset",
        }}
      >
        <IconComponent fontSize={size} />
      </StyledIconButton>
    </NeumorphicBox>
  );
};

export default CustomIcon;
