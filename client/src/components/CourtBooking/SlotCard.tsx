"use client";

import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CourtSlot } from './types';
import { formatTimeRange } from './utils';
import CustomButton from "@/components/shared/Buttons/CustomButton";

interface Props {
  slot: CourtSlot;
  color: "primary" | "secondary" | "tertiary" | "warning";
  currentUser?: string;
  onReserve?: (slot: CourtSlot) => void;
  onCancel?: (slot: CourtSlot) => void;
}

const SlotCard: React.FC<Props> = ({
  slot,
  color,
  currentUser,
  onReserve,
  onCancel,
}) => {
  const theme = useTheme();
  const isYours =
    slot.status === "yours" ||
    (slot.reservedBy && slot.reservedBy === currentUser);
  const isReserved = slot.status === "reserved" && !isYours;
  const isAvailable = slot.status === "available";

  const label = isYours
    ? "Reserved by you"
    : isReserved
    ? "Reserved"
    : "Available";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1.75,
        border: (theme) => `1px solid ${theme.palette[color].light}`,
        background: (theme) => theme.palette.background.paper,
        boxShadow:
          "-4px -4px 8px 0 #FAFBFF, 4px 4px 8px 0 rgba(22, 27, 29, 0.1)",
      }}
    >
      <CardContent
        sx={{
          py: 1.5,
          px: 1.75,
          '&:last-child': { pb: 1.5 },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1.5}
        >
          <Typography fontWeight={700} sx={{ color: "text.primary", fontSize: 14 }}>
            {formatTimeRange(slot.start, slot.end)}
          </Typography>
          <Box
            sx={{
              backgroundColor: isYours
                ? "rgba(98, 153, 208, 0.1)"
                : isReserved
                ? "rgba(158, 158, 158, 0.1)"
                : theme.palette.success.main,
              color: isYours
                ? theme.palette.primary.main
                : isReserved
                ? "#6e6e6e"
                : "#fff",
              borderRadius: "14px",
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
            }}
          >
            {label}
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} mt={1}>
          {isAvailable && (
            <CustomButton
              size="small"
              variant="contained"
              color="primary"
              onClick={() => onReserve?.(slot)}
              label="Reserve"
            />
          )}
          {isYours && (
            <CustomButton
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onCancel?.(slot)}
              label="Cancel"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SlotCard;