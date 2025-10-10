"use client";

import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, ButtonProps, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import theme from "@/themes/lightTheme";
import {resolveButtonPalette } from "../utils"

export type DescriptionAccordionProps = {
  name: string;
  description: string;
  accent: ButtonProps["color"];
};

export const DescriptionAccordion: React.FC<DescriptionAccordionProps> = ({ name, description, accent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHARACTER_LIMIT = 100;

  const isLongText = typeof description === "string" && description.length > CHARACTER_LIMIT;

  const displayedText = isExpanded
    ? description
    : description?.slice(0, CHARACTER_LIMIT) + (isLongText ? "..." : "");

  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:`${resolveButtonPalette(theme, accent).dark}`,  fontSize:"16px"}}> {name} </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <Box sx={{
          borderRadius: 3,
          padding:"10px 10px 5px 10px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          position: "relative",
        }}>
            <Typography variant="body1" sx={{ maxHeight: isExpanded ? "none" : "50px",fontWeight:600,fontStyle:"italic", fontSize:"14px", mb:2, borderBottom:`3px solid ${resolveButtonPalette(theme, accent).dark} `, width:"80px", color: resolveButtonPalette(theme, accent).dark}}>Description</Typography>
            <>
              <Typography variant="body1" sx={{ 
                maxHeight: isExpanded ? "none" : "40px",
                overflow: isExpanded ? "visible" : "hidden",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                fontSize:"12px",
                transition: "max-height 0.3s ease",
              }}>{displayedText}</Typography>
            </>
          
          <Box sx={{ display: "flex", justifyContent: "center", mt:1 }}>
            {isLongText && (
            <IconButton
              size="small"
              onClick={() => setIsExpanded((prev) => !prev)}
              sx={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          )}
              </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export type DetailsAccordionProps = {
  title?: string;
  details: Record<string, React.ReactNode>;
  accent: ButtonProps["color"];
};

export const DetailsAccordion: React.FC<DetailsAccordionProps> = ({ title = "Details", details , accent}) => {
  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:`${resolveButtonPalette(theme, accent).dark}`,  fontSize:"16px"}}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <Box component="dl" sx={{ m: 0 }}>
          {Object.entries(details).map(([key, value]) => (
            <Box key={key} sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 3, alignItems: "start", mb: 2 }}>
              <Typography component="dt" variant="h6" fontWeight={700} sx={{ mr: 2 , fontSize:"12px"}}>
                {key}:
              </Typography>
              <Typography component="dd" variant="h6" sx={{ m: 0, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize:"12px"}}>
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


