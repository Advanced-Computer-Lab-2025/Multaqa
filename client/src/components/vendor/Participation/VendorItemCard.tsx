"use client";

import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { VendorParticipationItem, VendorRequestItem } from "./types";

type Props = {
  item: VendorParticipationItem | VendorRequestItem;
  rightSlot?: React.ReactNode;
};

const typeColor: Record<string, { bg: string; fg: string }> = {
  BAZAAR: { bg: "#e5ed6f", fg: "#13233d" },
  PLATFORM_BOOTH: { bg: "#b2cee2", fg: "#1E1E1E" },
};

export default function VendorItemCard({ item, rightSlot }: Props) {
  const t = item.type;
  const color = typeColor[t] ?? { bg: "#b2cee2", fg: "#1E1E1E" };

  const dateRange = item.endDate
    ? `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`
    : new Date(item.startDate).toLocaleString();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        background: "#ffffffaa",
        border: `1px solid ${color.bg}`,
        boxShadow: "-5px -5px 10px 0 #FAFBFF, 5px 5px 10px 0 rgba(22, 27, 29, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Stack spacing={0.5}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 700, color: "#1E1E1E" }}>{item.title}</Typography>
          <Chip
            size="small"
            label={t === "BAZAAR" ? "Bazaar" : "Platform Booth"}
            sx={{ bgcolor: color.bg, color: color.fg, fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: "#6299d0" }}>{item.location}</Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>{dateRange}</Typography>
        {"status" in item && (
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            Submitted: {new Date(item.submittedAt).toLocaleString()}
          </Typography>
        )}
      </Stack>
      {rightSlot}
    </Box>
  );
}
