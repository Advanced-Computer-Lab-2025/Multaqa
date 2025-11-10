import React from "react";
import { AccordionSummary, AccordionSummaryProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const StyledAccordionSummary: React.FC<AccordionSummaryProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <AccordionSummary
      sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: "12px",
        minHeight: "68px",
        "&.Mui-expanded": {
          minHeight: "68px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      }}
      {...props}
    >
      {children}
    </AccordionSummary>
  );
};

export default StyledAccordionSummary;