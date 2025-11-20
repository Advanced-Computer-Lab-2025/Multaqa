"use client";

import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SlotCard from "./SlotCard";
import { CourtSlot, CourtType } from "./types";
import { groupSlotsByDay, formatDayLabel } from "./utils";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

interface Props {
  court: CourtType;
  slots: CourtSlot[];
  currentUser?: string;
  onReserve?: (slot: CourtSlot) => void;
  onCancel?: (slot: CourtSlot) => void;
  onSelectDate?: (courtId: string) => void;
  selectedDate?: string | null;
}

const CourtColumn: React.FC<Props> = ({
  court,
  slots,
  currentUser,
  onReserve,
  onCancel,
  onSelectDate,
  selectedDate,
}) => {
  const grouped = groupSlotsByDay(slots);
  const uniqueDays = React.useMemo(
    () => Array.from(grouped.keys()).sort(),
    [grouped]
  );
  const activeDay = selectedDate ?? null;
  const filteredSlots = React.useMemo(() => {
    if (!activeDay) return [];
    return grouped.get(activeDay) ?? [];
  }, [grouped, activeDay]);

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
        gap: 1.5,
        p: 2,
        borderRadius: 3,
        background: "#ffffffcc",
        border: (t) => `2px solid ${t.palette[court.colorKey].light}`,
        boxShadow:
          "-8px -8px 16px 0 #FAFBFF, 8px 8px 16px 0 rgba(22, 27, 29, 0.15)",
        maxHeight: { xs: 520, sm: 560, md: 600 },
        minHeight: { xs: 520, sm: 560, md: 600 },
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
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

        <CustomButton
          onClick={() => onSelectDate?.(court.id)}
          variant="outlined"
          sx={{
            minWidth: "auto",
            width: 40,
            height: 40,
            padding: 0,
            borderRadius: "50%",
            color: (t) => t.palette[court.colorKey].main,
            borderColor: (t) => t.palette[court.colorKey].main,
            "&:hover": {
              borderColor: (t) => t.palette[court.colorKey].dark,
              backgroundColor: (t) => `${t.palette[court.colorKey].light}33`,
            },
          }}
        >
          <CalendarMonthIcon fontSize="small" />
        </CustomButton>
      </Stack>

      <Divider
        sx={{
          borderColor: (t) => t.palette[court.colorKey].light,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          pr: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: (t) => t.palette[court.colorKey].light,
            borderRadius: 8,
          },
        }}
      >
        {activeDay ? (
          <Box display="flex" flexDirection="column" gap={1.25}>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {formatDayLabel(activeDay)}
            </Typography>
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  color={court.colorKey}
                  currentUser={currentUser}
                  onReserve={onReserve}
                  onCancel={onCancel}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No time slots available for this date yet.
              </Typography>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" sx={{ color: "black" }}>
              Select a date to view available slots.
            </Typography>
            {uniqueDays.length > 0 && (
              <Typography variant="caption" color="text.disabled">
                Next available: {formatDayLabel(uniqueDays[0])}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CourtColumn;
