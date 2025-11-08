import React from "react";
import { Accordion, AccordionProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const StyledAccordion: React.FC<AccordionProps> = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Accordion
      sx={{
        mb: 3,
        borderRadius: "12px !important",
        border: `1px solid ${theme.palette.divider}`,
        "&:before": { display: "none" },
        boxShadow: "none",
      }}
      {...props}
    >
      {children}
    </Accordion>
  );
};

export default StyledAccordion;
