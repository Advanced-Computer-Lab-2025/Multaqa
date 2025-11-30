"use client";

import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";
import { alpha } from "@mui/material/styles";
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

  // Auto-load today's date if no date is selected
  const todayIso = React.useMemo(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }, []);

  const activeDay = selectedDate ?? todayIso;
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
      sx={(t) => {
        const courtColor = t.palette[court.colorKey].main;
        return {
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: { xs: 2, md: 3 },
          borderRadius: "16px",
          position: "relative",
          backgroundColor: alpha(courtColor, 0.075),
          border: `1px solid ${alpha(courtColor, 0.35)}`,
          boxShadow: `0 0 0 1px ${alpha(courtColor, 0.35)}, 0 4px 14px ${alpha(
            courtColor,
            0.2
          )}, 0 0 22px ${alpha(courtColor, 0.18)}`,
          transition:
            "box-shadow 0.35s ease, transform 0.35s ease, background-color 0.35s ease",
          // Use viewport height to constrain the column height
          // Subtract approximate header/navigation height (adjust as needed)
          maxHeight: "calc(100vh - 320px)",
          minHeight: "calc(100vh - 320px)",
          overflow: "hidden",
          "&:hover": {
            backgroundColor: alpha(courtColor, 0.1),
            boxShadow: `0 0 0 2px ${alpha(courtColor, 0.55)}, 0 6px 18px ${alpha(
              courtColor,
              0.28
            )}, 0 0 28px ${alpha(courtColor, 0.28)}`,
            transform: "translateY(-3px)",
          },
        };
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
        sx={(t) => {
          const accent = t.palette[court.colorKey].main;
          return {
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(accent, 0.45)} transparent`,
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-track": {
              background: alpha(accent, 0.08),
              borderRadius: 0,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(accent, 0.45),
              borderRadius: 0,
              "&:hover": {
                backgroundColor: alpha(accent, 0.65),
              },
            },
          };
        }}
      >
        <Box display="flex" flexDirection="column" gap={1.25}>
          <Typography
            variant="body2"
            sx={{
              color: (t) => t.palette[court.colorKey].main,
              fontWeight: 600,
            }}
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
            <Stack spacing={1} sx={{ py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                No time slots available for this date.
              </Typography>
              {uniqueDays.length > 0 && (
                <Typography variant="caption" color="text.disabled" sx={{ textAlign: "center" }}>
                  Try: {formatDayLabel(uniqueDays[0])}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourtColumn;
