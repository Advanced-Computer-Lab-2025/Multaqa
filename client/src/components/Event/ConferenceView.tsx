"use client";

import React, { useState } from "react";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { ConferenceViewProps } from "./types";
import theme from "@/themes/lightTheme";
import { CheckIcon } from "lucide-react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { Copy, Check } from "lucide-react";

const ConferenceView: React.FC<ConferenceViewProps> = ({ details, name, description, agenda, user, registered }) => {

  const [expanded, setExpanded] = useState(false);
  // Format key details for display
  const formatDateRange = () => {
    const startDate = details["Start Date"];
    const endDate = details["End Date"];
    const startTime = details["Start Time"];
    const endTime = details["End Time"];
    
    if (startDate && endDate) {
      const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;
      const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "";
      return timeRange ? `${dateRange}, ${timeRange}` : dateRange;
    }
    return "";
  };

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyLink = () => {
    const link = details["Link"] || "";
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };
  
  const metaNodes = [
    <Typography key="date" variant="body2" sx={{ color: "#6b7280" }}>
      {formatDateRange()}
    </Typography>,
    <Typography key="budget" variant="caption" sx={{ color: "#6b7280" }}>
      Budget: {details["Required Budget"] || "TBD"}
    </Typography>,
    ...(details["Link"] ? [
      <Box 
        key="link" 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 0.5,
          cursor: "pointer"
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: theme.palette.primary.main,
            textDecoration: "underline",
            "&:hover": {
              color: theme.palette.primary.dark,
            }
          }}
          onClick={() => window.open(details["Link"], "_blank")}
        >
          {details["Link"]}
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleCopyLink}
          sx={{ 
            padding: 0.25,
            "&:hover": {
              backgroundColor: theme.palette.primary.light + "20"
            }
          }}
        >
          {copySuccess ? (
            <Check size={14} color="green" />
          ) : (
            <Copy size={14} color="#6b7280" />
          )}
        </IconButton>
      </Box>
    ] : [])
  ];
  
  const detailsContent = (
    <Box>
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.warning.dark, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
      )}

      {/* Agenda */}
      {agenda && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.warning.dark, mb: 1 }}>
            Full Agenda
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {agenda}
          </Typography>
        </Box>
      )}

      {/* Other Details */}
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.warning.dark, mb: 1 }}>
          Additional Details
        </Typography>
        {Object.entries(details)
          .filter(([key]) => !["Start Date", "End Date", "Start Time", "End Time"].includes(key))
          .map(([key, value]) => (
            <Box key={key} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {key}:
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                {value}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );

  return (
    <ActionCard
      title={name}
      tags={[
        { 
          label: "Conference", 
          sx: { bgcolor: theme.palette.warning.light, color: theme.palette.warning.contrastText, fontWeight: 600 },
          size: "small" 
        }
      ]}
      metaNodes={metaNodes}
      registered={registered}
      expanded={expanded}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.warning.main}
      elevation="soft"
    />
  );
};

export default ConferenceView;


