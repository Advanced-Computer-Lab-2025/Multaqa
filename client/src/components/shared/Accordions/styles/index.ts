"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "& + &": {
    marginTop: theme.spacing(2),
  },
}));

export const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2.5, 3),
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: theme.palette.primary.main,
    transition: "transform 0.32s ease",
    "&.Mui-expanded": {
      transform: "rotate(180deg)",
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const SummaryContent = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 4,
}));

export const SummaryTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "var(--font-jost), system-ui, sans-serif",
  fontWeight: 600,
  fontSize: "1.05rem",
  color: theme.palette.text.primary,
}));

export const SummaryDescription = styled(Typography)(({ theme }) => ({
  fontSize: "0.92rem",
  color: theme.palette.text.secondary,
}));

export const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(3, 3.5, 3.75),
  color: theme.palette.text.secondary,
  fontSize: "0.95rem",
  lineHeight: 1.6,
}));


