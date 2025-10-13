"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";

const TripView: React.FC<BazarViewProps> = ({ details, name, description }) => {
  const [expanded, setExpanded] = useState(false);
  // Format key details for display
  const formatDateTime = () => {
    const departureTime = details["Departure Time"];
    const returnTime = details["Return Time"];
    
    if ( departureTime && returnTime) {
      return ` ${departureTime} - ${returnTime}`;
    } 
    return "";
  };

  const metaNodes = [
    <Typography key="datetime" variant="body2" sx={{ color: "#6b7280" }}>
    Deadline: {details["Registration Deadline"] || "TBD"}
   </Typography>,
    <Typography key="datetime" variant="caption" sx={{ color: "#6b7280" }}>
    {details["Start Date"] === details["End Date"]
    ? (details["Start Date"] || "TBD") // If dates are the same, show just one date
    : `${details["Start Date"] || "TBD"} - ${details["End Date"] || "TBD"}` // If different, show the range
  }
    </Typography>,
      <Typography key="transportation" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="cost" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Cost"] || "TBD"}
    </Typography>
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.error.dark, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
      )}

      {/* Trip Details */}
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.error.dark, mb: 1 }}>
          Trip Details
        </Typography>
        {Object.entries(details)
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
          label: "Trip", 
          sx: { bgcolor: theme.palette.error.light, color: theme.palette.error.contrastText, fontWeight: 600 },
          size: "small" 
        }
      ]}
      metaNodes={metaNodes}
      rightSlot={
        <CustomButton size="small" variant="contained" color="error" sx={{ borderRadius: 999}}>
          Register
        </CustomButton>
      }
      expanded={expanded}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.error.main}
      elevation="soft"
    />
  );
};

export default TripView;


