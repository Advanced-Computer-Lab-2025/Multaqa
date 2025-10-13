"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import { BoothViewProps } from "./types";
import theme from "@/themes/lightTheme";
import CustomButton from "../shared/Buttons/CustomButton";

const BoothView: React.FC<BoothViewProps> = ({ company, people, details, user , registered}) => {
  const [expanded, setExpanded] = useState(false);
  // Helper function to extract initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Helper function to get a color based on name
  const getAvatarColor = (name: string) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const metaNodes = [
    <Typography key="duration" variant="body2" sx={{ color: "#6b7280" }}>
    {details["Duration"] || "TBD"}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
   {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="booth-size" variant="caption" sx={{ color: "#6b7280" }}>
      Size: {details["Booth Size"] || "TBD"}
    </Typography>
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {details["Description"] && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.primary.dark, mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5 }}>
            {details["Description"]}
          </Typography>
        </Box>
      )}

      {/* People Section */}
      {people && Object.keys(people).length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.primary.dark, mb: 1 }}>
            Representatives
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {Object.entries(people).map(([key, person]) => (
              <Box
                key={person.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1,
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: getAvatarColor(person.name),
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(person.name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: "12px", color: "text.primary", fontWeight: 500 }}>
                    {person.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: "11px", color: "text.secondary", display: "block" }}>
                    {person.email}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Other Details */}
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.primary.dark, mb: 1 }}>
          Booth Details
        </Typography>
        {Object.entries(details)
          .filter(([key]) => !["Description", "people"].includes(key))
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
      title={company}
      tags={[
        { 
          label: "Booth", 
          sx: { bgcolor:"#b2cee2", color: "#1E1E1E", fontWeight: 600 },
          size: "small" 
        }
      ]}
      metaNodes={metaNodes}
      rightSlot={
        !registered && (user=="vendor") &&(<CustomButton size="small" variant="contained" color="primary" sx={{ borderRadius: 999}}>
          Apply
        </CustomButton>)
      }
      registered={registered}
       // only in case of vendor
      expanded={expanded}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.primary.main}
      elevation="soft"
    />
  );
};

export default BoothView;


