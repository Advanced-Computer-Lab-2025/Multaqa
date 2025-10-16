import React from "react";
import { Tooltip } from "@mui/material";
import { boothProps } from "./types";
import { StyledBooth, BoothLabel } from "./styles";

const Booth: React.FC<boothProps> = ({
  id,
  isSelected = false,
  isAvailable = true,
  curvePosition = "upleft",
  onClick,
}) => {
  const handleClick = () => {
    if (isAvailable && onClick) {
      onClick(id);
    }
  };

  const getTooltipTitle = () => {
    if (!isAvailable) {
      return `Booth ${id} - Unavailable`;
    }
    if (isSelected) {
      return `Booth ${id} - Selected`;
    }
    return `Booth ${id} - Available`;
  };

  return (
    <Tooltip title={getTooltipTitle()} arrow placement="top">
      <StyledBooth
        isSelected={isSelected}
        isAvailable={isAvailable}
        curvePosition={curvePosition}
        onClick={handleClick}
        role="button"
        aria-label={`Booth ${id} ${isAvailable ? "available" : "unavailable"} ${
          isSelected ? "selected" : ""
        }`}
        tabIndex={isAvailable ? 0 : -1}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && isAvailable) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <BoothLabel >{id}</BoothLabel>
      </StyledBooth>
    </Tooltip>
  );
};

export default Booth;
