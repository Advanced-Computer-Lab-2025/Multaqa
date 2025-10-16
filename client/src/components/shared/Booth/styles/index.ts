import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { BoothCurvePosition } from "../types";

export interface StyledBoothProps {
  isSelected: boolean;
  isAvailable: boolean;
  curvePosition: BoothCurvePosition;
}

const getBorderRadius = (curvePosition: BoothCurvePosition): string => {
  const regularRadius = "20%";
  const curvedRadius = "50%";

  switch (curvePosition) {
    case "upleft":
      return `${curvedRadius} ${regularRadius} ${regularRadius} ${regularRadius}`;
    case "upright":
      return `${regularRadius} ${curvedRadius} ${regularRadius} ${regularRadius}`;
    case "bottomleft":
      return `${regularRadius} ${regularRadius} ${regularRadius} ${curvedRadius}`;
    case "bottomright":
      return `${regularRadius} ${regularRadius} ${curvedRadius} ${regularRadius}`;
    default:
      return regularRadius;
  }
};

const getBoothColor = (isSelected: boolean, isAvailable: boolean): string => {
  if (!isAvailable) {
    return "#9E9E9E"; // Grey for unavailable
  }
  if (isSelected) {
    return "#1565C0"; // Darker blue for selected
  }
  return "#55aff8ff"; // Light blue for available
};

const getHoverColor = (isSelected: boolean, isAvailable: boolean): string => {
  if (!isAvailable) {
    return "#757575"; // Darker grey on hover for unavailable
  }
  if (isSelected) {
    return "#155cadff"; // Even darker blue for selected hover
  }
  return "#2284e7ff"; // Darker blue for available hover
};

export const StyledBooth = styled(Box)<StyledBoothProps>(
  ({ isSelected, isAvailable, curvePosition }) => ({
    width: `100%`,
    height: `100%`,
    backgroundColor: getBoothColor(isSelected, isAvailable),
    borderRadius: getBorderRadius(curvePosition),
    border: `2px solid ${isSelected ? "#0D47A1" : "transparent"}`,
    cursor: isAvailable ? "pointer" : "not-allowed",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: isSelected
      ? "0 4px 20px rgba(25, 118, 210, 0.4)"
      : "0 2px 8px rgba(0, 0, 0, 0.1)",

    "&:hover": {
      backgroundColor: getHoverColor(isSelected, isAvailable),
      transform: isAvailable ? "scale(1.05)" : "none",
      boxShadow: isAvailable
        ? isSelected
          ? "0 6px 24px rgba(25, 118, 210, 0.5)"
          : "0 4px 16px rgba(66, 165, 245, 0.3)"
        : "0 2px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
    },

    "&:active": {
      transform: isAvailable ? "scale(0.98)" : "none",
    },

    // Add a subtle inner glow for selected booths
    ...(isSelected && {
      "&::before": {
        content: '""',
        position: "absolute",
        top: "1px",
        left: "1px",
        right: "1px",
        bottom: "1px",
        borderRadius: getBorderRadius(curvePosition),
        background:
          "linear-gradient(130deg, rgba(255, 255, 255, 0.2), transparent)",
        pointerEvents: "none",
      },
    }),

    // Add a pattern for unavailable booths
    ...(!isAvailable && {
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: getBorderRadius(curvePosition),
        backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 4px,
        rgba(255, 255, 255, 0.1) 4px,
        rgba(255, 255, 255, 0.1) 8px
      )`,
        pointerEvents: "none",
      },
    }),
  })
);

export const BoothLabel = styled("div")(
  () => ({
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "center",
    userSelect: "none",
    zIndex: 1,
    position: "relative",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  })
);
