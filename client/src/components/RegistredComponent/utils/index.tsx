import { TruncatedTextProps } from "../types";
import { Tooltip, Typography } from "@mui/material";

export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  maxChars = 40,
  fontSize,
  fontWeight = "600",
}) => {
  const size: number = children.length;
  const textComponent = (
    <Typography
      variant="body2"
      onPointerDown={(e) => {
        // This stops the drag event from being triggered when clicking on the text,
        // allowing mouse hover events for the tooltip to work correctly.
        e.stopPropagation();
      }}
      sx={{
        color: "#1A1A1A",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        fontSize: fontSize,
        fontWeight: fontWeight,
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
        cursor: "default", // Explicitly set cursor to default for text
      }}
    >
      {children}
    </Typography>
  );
  if (size > maxChars) {
    return (
      <Tooltip title={children} arrow placement="top">
        {textComponent}
      </Tooltip>
    );
  }

  // If the text is short, return the Typography component alone
  return textComponent;
};
