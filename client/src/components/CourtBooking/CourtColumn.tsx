"use client";

import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SlotCard from "./SlotCard";
import { CourtSlot, CourtType } from "./types";
import { groupSlotsByDay, formatDayLabel } from "./utils";

interface Props {
  court: CourtType;
  slots: CourtSlot[];
  currentUser?: string;
  onReserve?: (slot: CourtSlot) => void;
  onCancel?: (slot: CourtSlot) => void;
}

const CourtColumn: React.FC<Props> = ({
  court,
  slots,
  currentUser,
  onReserve,
  onCancel,
}) => {
  const grouped = groupSlotsByDay(slots);

  // Get sport icon based on court name
  const getSportIcon = () => {
    const iconProps = { sx: { fontSize: 20 } };

    switch (court.name.toLowerCase()) {
      case "basketball":
        return <SportsBasketballIcon {...iconProps} />;
      case "tennis":
        return <SportsTennisIcon {...iconProps} />;
      case "football":
      case "soccer":
        return <SportsSoccerIcon {...iconProps} />;
      default:
        return court.name.charAt(0); // Fallback to first letter
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2.5,
        borderRadius: 3,
        background: "#ffffffaa",
        border: (t) => `2px solid ${t.palette[court.colorKey].light}`,
        boxShadow:
          "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.15)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            bgcolor: (t) => t.palette[court.colorKey].main,
            width: 32,
            height: 32,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {getSportIcon()}
        </Box>
        <Typography
          fontWeight={700}
          sx={{ color: (t) => t.palette[court.colorKey].dark }}
        >
          {court.name}
        </Typography>
      </Stack>

      <Divider
        sx={{
          borderColor: (t) => t.palette[court.colorKey].light,
          opacity: 0.6,
        }}
      />

      {[...grouped.entries()].map(([day, daySlots]) => (
        <Box key={day}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1, fontWeight: 600 }}
          >
            {formatDayLabel(day)}
          </Typography>
          <Stack gap={1.25}>
            {daySlots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                color={court.colorKey}
                currentUser={currentUser}
                onReserve={onReserve}
                onCancel={onCancel}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
};

export default CourtColumn;
