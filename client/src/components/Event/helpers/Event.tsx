"use client";

import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, ButtonProps, Typography, IconButton, Avatar } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import theme from "@/themes/lightTheme";
import {resolveButtonPalette } from "../../utils"
import { BoothViewProps, WorkshopViewProps } from "../types/index";
import {ContentCopy as ContentCopyIcon } from "@mui/icons-material";

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
        <Typography variant="h5" fontWeight={600} sx={{ color:`${accent=="secondary"?"#a9ae65":resolveButtonPalette(theme, accent).dark}`,  fontSize:"16px"}}> {name} </Typography>
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
            {name!=="Full Agenda"?(<Typography variant="body1" sx={{ maxHeight: isExpanded ? "none" : "50px",fontWeight:600,fontStyle:"italic", fontSize:"14px", mb:2, borderBottom:`3px solid ${accent=="secondary"?"#a9ae65":resolveButtonPalette(theme, accent).dark} `, width:"80px", color: accent=="secondary"?"#a9ae65":resolveButtonPalette(theme, accent).dark}}>Description</Typography>): <></>}
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
        <Typography variant="h5" fontWeight={600} sx={{ color:`${accent=="secondary"?"#a9ae65":resolveButtonPalette(theme, accent).dark}`,  fontSize:"16px"}}>{title}</Typography>
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



export const BoothData: React.FC<BoothViewProps> = ({ company, people="", details }) => {
  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:theme.palette.warning.dark,  fontSize:"16px"}}>{company}</Typography>
      </AccordionSummary>
    <AccordionDetails sx={{ px: 0 }}>
    {/* People Section*/}
    { people!=""?(
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ fontSize: "12px", mb: 1.5 }}>
        People
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          p: 2,
        }}
      >
        {Object.entries(people).map(([key, person], index) => (
          <Box key={person.id}>
            <Box sx={{ mb: index !== Object.entries(people).length - 1 ? 2 : 0 }}>
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: "12px" }}>
                {person.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", color: "text.warning" }}>
                {person.email}
              </Typography>
            </Box>
            {index !== Object.entries(people).length - 1 && (
              <Box sx={{ borderBottom: "1px solid", borderColor: "divider", my: 2 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box> ):<></>}

    {/* Other Details Section */}
    <Box component="dl" sx={{ m: 0 }}>
      {Object.entries(details)
        .filter(([key]) => key !== "people")
        .map(([key, value]) => (
          <Box key={key} sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 3, alignItems: "start", mb: 2 }}>
            <Typography component="dt" variant="h6" fontWeight={700} sx={{ mr: 2, fontSize: "12px" }}>
              {key}:
            </Typography>
            <Typography component="dd" variant="h6" sx={{ m: 0, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px" }}>
              {value}
            </Typography>
          </Box>
        ))}
    </Box>
  </AccordionDetails>
  </Accordion>
  );
};



export interface ConferenceViewProps {
  details: Record<string, any>;
}

export const ConferenceData: React.FC<ConferenceViewProps> = ({ details }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = details["Conference Link"];
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const conferenceLink = details["Conference Link"];

  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.primary.dark, fontSize: "16px" }}>
          Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        {/* Conference Link Section */}
        {conferenceLink && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1.5 }}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "12px", mb: 1, color: "text.primary" }}>
              Conference Link
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                {conferenceLink}
              </Typography>
              <IconButton
                size="small"
                onClick={handleCopyLink}
                sx={{
                  ml: 1,
                  color: theme.palette.primary.main,
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            {copied && (
              <Typography variant="caption" sx={{ fontSize: "11px", color: "success.main", mt: 0.5, display: "block" }}>
                Copied to clipboard!
              </Typography>
            )}
          </Box>
        )}

        {/* Other Details Section */}
        <Box component="dl" sx={{ m: 0 }}>
          {Object.entries(details)
            .filter(([key]) => key !== "Conference Link" && key !== "people")
            .map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 3, alignItems: "start", mb: 2 }}
              >
                <Typography component="dt" variant="h6" fontWeight={700} sx={{ mr: 2, fontSize: "12px" }}>
                  {key}:
                </Typography>
                <Typography
                  component="dd"
                  variant="h6"
                  sx={{
                    m: 0,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
// Helper function to extract initials from professor name
const getInitials = (name: string) => {
  let cleanName = name.trim();
  
  // Remove title (Dr., Eng., Prof., etc.) if present
  if (cleanName.includes(".")) {
    const dotIndex = cleanName.indexOf(".");
    cleanName = cleanName.substring(dotIndex + 1).trim();
  }
  
  const parts = cleanName.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return cleanName[0].toUpperCase();
};

// Helper function to get a color based on name
const getAvatarColor = (name: string) => {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export const WorkshopData: React.FC<WorkshopViewProps> = ({ details }) => {
  // Parse professors string into array
  const professorString = details["Professors Participating"] || "";
  const professors = professorString
    .split(",")
    .map((prof) => prof.trim())
    .filter((prof) => prof.length > 0);

  return (
    <Accordion defaultExpanded sx={{ boxShadow: "none", background: "transparent" }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ color:"#a9ae65", fontSize: "16px" }}>
          Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        {/* Professors Section */}
        {professors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: "12px", mb: 1.5, color: "text.primary" }}>
              Professors Participating
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {professors.map((professor, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1.5,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: getAvatarColor(professor),
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    {getInitials(professor)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: "12px", color: "text.primary" }}>
                      {professor}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "11px",
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  >
                    Professor
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Other Details Section */}
        <Box component="dl" sx={{ m: 0 }}>
          {Object.entries(details)
            .filter(([key]) => key !== "Professors Participating" && key !== "people")
            .map(([key, value]) => (
              <Box
                key={key}
                sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 3, alignItems: "start", mb: 2 }}
              >
                <Typography component="dt" variant="h6" fontWeight={700} sx={{ mr: 2, fontSize: "12px" }}>
                  {key}:
                </Typography>
                <Typography
                  component="dd"
                  variant="h6"
                  sx={{
                    m: 0,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
                  }}
                >
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


