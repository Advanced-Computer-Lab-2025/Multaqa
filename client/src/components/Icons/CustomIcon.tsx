"use client";

import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import { styled} from "@mui/material/styles";

// 1. Import all the icons you plan to use
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";


const StyledIconButton = styled(IconButton)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: "50px",
  padding: "8px 20px",
  "&.MuiButton-outlined": {
    borderWidth: "2px",
    borderStyle: "solid",
  },
}));

type IconType = "close" | "delete" | "edit" | "add";


const iconComponents: Record<IconType, React.ElementType> = {
  close: CloseIcon,
  delete: DeleteIcon,
  edit: EditIcon,
  add: AddIcon,
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

  return (
    <StyledIconButton size={size} {...props}>
      <IconComponent fontSize={size} />
    </StyledIconButton>
  );
};

export default CustomIcon;
