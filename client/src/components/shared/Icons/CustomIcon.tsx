"use client";
import React from "react";
import NeumorphicBox from "../containers/NeumorphicBox";
import { StyledIconButton } from "./styles/index";
import { CustomIconProps } from "./types";
import { iconComponents } from "./utils";

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  size = "small",
  containerType = "inwards",
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
        return { size: "42px", padding: "9px" };
      case "medium":
        return { size: "50px", padding: "10px" };
      case "large":
        return { size: "58ypx", padding: "12px" };
      default:
        return { size: "42px", padding: "9px" };
    }
  };

  const { size: containerSize, padding } = getContainerSize();

  return (
    <NeumorphicBox
      containerType={containerType}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: containerSize,
        height: containerSize,
        padding: "2px",
      }}
    >
      <StyledIconButton
        iconType={icon}
        aria-label={icon}
        size={size}
        {...props}
        sx={{
          padding: padding,
          border: "1px solid #b6b7ba",
          "&:hover": {
            borderColor: "#7950db",
            borderWidth: "2px",
            transition: "all 0.3 ease-in-out",
          },
          ...props.sx,
        }}
      >
        <IconComponent fontSize="inherit" color="primary" />
      </StyledIconButton>
    </NeumorphicBox>
  );
};

export default CustomIcon;
