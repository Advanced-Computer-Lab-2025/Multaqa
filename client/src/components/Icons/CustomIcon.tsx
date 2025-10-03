"use client";

import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import NeumorphicBox from "../shared/containers/NeumorphicBox";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PublishIcon from "@mui/icons-material/Publish";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

const StyledIconButton = styled(IconButton)<{ iconType: IconType }>(
  ({ theme, iconType }) => ({
    cursor: "pointer",
    borderRadius: "50%",
    padding: theme.spacing(1),
    color:
      iconType === "delete"
        ? theme.palette.error.main
        : theme.palette.primary.main,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.05)",
    },
  })
);

type IconType = "close" | "delete" | "edit" | "add" | "save" | "submit" | "bookmark";

const iconComponents: Record<IconType, React.ElementType> = {
  close: CloseIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  add: AddIcon,
  save: SaveIcon,
  submit: PublishIcon,
  bookmark: BookmarkBorderIcon,
};

interface CustomIconProps extends IconButtonProps {
  icon: IconType;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  icon,
  size = "small",
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
      containerType="outwards"
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
