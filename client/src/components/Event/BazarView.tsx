"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BazarViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";

const BazarView: React.FC<BazarViewProps> = ({ details, name, description, user, registered}) => {
  const [expanded, setExpanded] = useState(false);

  const metaNodes = [
    <Typography key="datetime" variant="body2" sx={{ color: "#6b7280" }}> 
     Deadline: {details["Registration Deadline"] || "TBD"} 
   </Typography>,
    <Typography key="datetime" variant="caption" sx={{ color: "#6b7280" }}>
     {details["Start Date"] || "TBD"} - {details["End Date"] || "TBD"} 
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
     {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="vendors" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Vendor Count"] ? `${details["Vendor Count"]} vendors` : ""}
    </Typography>
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.secondary.dark, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
      )}

      {/* Event Details */}
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.secondary.dark, mb: 1 }}>
          Event Details
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
          label: "Bazaar", 
          sx: { bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.contrastText, fontWeight: 600 },
          size: "small" 
        }
      ]}
      metaNodes={metaNodes}
      rightSlot={
        !registered && (user=="vendor") &&(<CustomButton size="small" variant="contained" color="secondary" sx={{ borderRadius: 999}}>
          Apply
        </CustomButton>)
      }
      registered={registered}
      expanded={expanded}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.secondary.main}
      elevation="soft"
    />
  );
};

export default BazarView;