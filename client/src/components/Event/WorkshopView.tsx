"use client";
import React, { useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import ActionCard from "../shared/cards/ActionCard";
import CustomButton from "../shared/Buttons/CustomButton";
import { WorkshopViewProps } from "./types";
import theme from "@/themes/lightTheme";

const WorkshopView: React.FC<WorkshopViewProps> = ({ details, name, description, agenda, user, registered }) => {
  const [expanded, setExpanded] = useState(false);
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

  // Parse professors string into array
  const professorString = details["Professors Participating"] || "";
  const professors = professorString
    .split(",")
    .map((prof) => prof.trim())
    .filter((prof) => prof.length > 0);

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

  const metaNodes = [
    <Typography key="date" variant="body2" sx={{ color: "#6b7280" }}>
      {formatDateRange()}
    </Typography>,
    <Typography key="location" variant="caption" sx={{ color: "#6b7280" }}>
      {details["Location"] || "TBD"}
    </Typography>,
    <Typography key="capacity" variant="caption" sx={{ color: "#6b7280" }}>
      Capacity: {details["Capacity"] || "TBD"}
    </Typography>
  ];

  const detailsContent = (
    <Box>
      {/* Description */}
      {description && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.tertiary.dark, mb: 1 }}>
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
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.tertiary.dark, mb: 1 }}>
            Full Agenda
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {agenda}
          </Typography>
        </Box>
      )}

      {/* Professors */}
      {professors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.tertiary.dark, mb: 1 }}>
            Professors Participating
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {professors.map((professor, index) => (
              <Box
                key={index}
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
                    backgroundColor: getAvatarColor(professor),
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(professor)}
                </Avatar>
                <Typography variant="caption" sx={{ fontSize: "12px", color: "text.primary" }}>
                  {professor}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Other Details */}
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ color: theme.palette.tertiary.dark, mb: 1 }}>
          Additional Details
        </Typography>
        {Object.entries(details)
          .filter(([key]) => !["Start Date", "End Date", "Start Time", "End Time", "Professors Participating"].includes(key))
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
          label: "Workshop", 
          sx: { bgcolor: theme.palette.tertiary.main, color: theme.palette.tertiary.contrastText, fontWeight: 600 },
          size: "small" 
        }
      ]}
      metaNodes={metaNodes}
      rightSlot={
        !registered && (user=="staff"||user=="student"||user=="ta"||user=="professor") &&(<CustomButton size="small" variant="contained" color="tertiary" sx={{ borderRadius: 999}}>
          Register
        </CustomButton>)
      }
      registered={registered || !(user=="staff"||user=="student"||user=="ta"||user=="professor")}
      expanded={expanded}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.tertiary.main}
      elevation="soft"
    />
  );
};

export default WorkshopView;


