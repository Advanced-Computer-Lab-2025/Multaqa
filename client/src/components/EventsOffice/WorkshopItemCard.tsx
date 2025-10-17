"use client";

import React, { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import ActionCard from "@/components/shared/cards/ActionCard";
import { WorkshopViewProps } from "../Event/types";
import theme from "@/themes/lightTheme";

type Props = {
  id: string;
  item: WorkshopViewProps;
  rightSlot?: React.ReactNode;
  expanded?: boolean;
  userId?:string;
};


  // Helper function to get a color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };


export default function WorkshopItemCard({ item, rightSlot, expanded = false , userId}: Props) {

  // Parse professors string into array
 const professors = item.professors;
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

  const detailsContent = (
    <Box>
      {/* Description */}
      {item.description && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
            Description
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", lineHeight: 1.5 }}
          >
            {item.description}
          </Typography>
        </Box>
      )}

      {/* Agenda */}
      {item.agenda && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
            Full Agenda
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "14px", lineHeight: 1.5, whiteSpace: "pre-line" }}
          >
            {item.agenda}
          </Typography>
        </Box>
      )}

      {/* Professors */}
      {professors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
          >
            Professors Participating
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {professors.map((professor:string, index:number) => (
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
                <Typography
                  variant="caption"
                  sx={{ fontSize: "12px", color: "text.primary" }}
                >
                  {professor}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Other Details */}
      <Box>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: theme.palette.tertiary.dark, mb: 1 }}
        >
          Additional Details
        </Typography>
        {Object.entries(item.details)
          .filter(
            ([key]) =>{            // Base fields to always exclude
            const baseExcluded = [
            "Created By"
            ];
          return !baseExcluded.includes(key);
        }
          )
          .map(([key, value]) => (
            <Box
              key={key}
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
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
  const [expandedd, setExpanded] = useState(expanded);

  const dateRange = item.details.endDate
    ? `${new Date(item.details["Start Date"] ).toLocaleDateString()} - ${new Date(item.details["End Date"] ).toLocaleDateString()}`
    : new Date(item.details["Start Date"] ).toLocaleString();

  return (
    <ActionCard
      title={item.name}
      type="vendor"
      tags={[
        {
          label: "Workshop",
          sx: {
            bgcolor: theme.palette.tertiary.main,
            color: theme.palette.tertiary.contrastText,
            fontWeight: 600,
          },
          size: "small",
        },
      ]}
      subtitleNode={<Typography variant="body2" sx={{ color: "#575d69" }}>{item.details["Location"] }</Typography>}
      metaNodes={[
        <Typography key="range" variant="body2" sx={{ color: "#6b7280" }}>{dateRange}</Typography>,
        "status" in item ? (
          <Typography key="submitted" variant="caption" sx={{ color: "#6b7280" }}>
            Submitted: {new Date(item.details.submittedAt).toLocaleString()}
          </Typography>
        ) : null,
      ].filter(Boolean) as React.ReactNode[]}
      rightSlot={rightSlot}
      expanded={expandedd}
      onExpandChange={setExpanded}
      details={detailsContent}
      borderColor={theme.palette.tertiary.main}
    />
  );
}
