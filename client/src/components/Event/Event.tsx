"use client";

import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, ButtonProps, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "@/themes/lightTheme";
import {resolveButtonPalette } from "../utils"

export type DescriptionAccordionProps = {
  name: string;
  description: React.ReactNode;
  accent?: ButtonProps["color"];
};

export const DescriptionAccordion: React.FC<DescriptionAccordionProps> = ({ name, description, accent }) => {
  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:theme.palette.tertiary.dark}}> {name} </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <Box sx={{
          borderRadius: 3,
          p: 2,
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          backgroundColor: "#ffffff"
        }}>
            <Typography variant="body1" sx={{fontWeight:600, mb:2, borderBottom:`3px solid ${resolveButtonPalette(theme, accent).dark} `, width:"90px", maxHeight:"120px", color: resolveButtonPalette(theme, accent).dark }}>Description</Typography>
          {typeof description === "string" ? (
            <Typography variant="body1">{description}</Typography>
          ) : (
            description
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export type DetailsAccordionProps = {
  title?: string;
  details: Record<string, React.ReactNode>;
};

export const DetailsAccordion: React.FC<DetailsAccordionProps> = ({ title = "Details", details }) => {
  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:`${theme.palette.tertiary.dark} `}}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <Box component="dl" sx={{ m: 0 }}>
          {Object.entries(details).map(([key, value]) => (
            <Box key={key} sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 3, alignItems: "start", mb: 2 }}>
              <Typography component="dt" variant="h6" fontWeight={700} sx={{ mr: 2 }}>
                {key}:
              </Typography>
              <Typography component="dd" variant="h6" sx={{ m: 0, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default {};


