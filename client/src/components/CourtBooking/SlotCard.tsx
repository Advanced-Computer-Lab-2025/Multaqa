"use client";

import React from 'react';
import { Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import { CourtSlot } from './types';
import { formatTimeRange } from './utils';
import CustomButton from "@/components/shared/Buttons/CustomButton";

interface Props {
  slot: CourtSlot;
  color: "primary" | "secondary" | "tertiary";
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
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette[color].light}`,
        background: (theme) => theme.palette.background.default,
        boxShadow:
          "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography fontWeight={600} sx={{ color: "text.primary" }}>
            {formatTimeRange(slot.start, slot.end)}
          </Typography>
          <Box
            sx={{
              backgroundColor: isYours
                ? "rgba(98, 153, 208, 0.1)"
                : isReserved
                ? "rgba(158, 158, 158, 0.1)"
                : theme.palette.primary.main + "90",
              color: isYours
                ? theme.palette.primary.main
                : isReserved
                ? "#9e9e9e"
                : "#fff",
              borderRadius: "16px",
              padding: "4px 12px",
              fontSize: "12px",
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
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Reserve
            </CustomButton>
          )}
          {isYours && (
            <CustomButton
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => onCancel?.(slot)}
              sx={{ borderRadius: '12px', fontWeight: 700 }}
            >
              Cancel
            </CustomButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SlotCard;
