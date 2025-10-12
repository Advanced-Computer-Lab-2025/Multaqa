"use client";

import React from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorParticipationItem } from "./types";

const demoData: VendorParticipationItem[] = [
  {
    id: "e1",
    title: "Spring Campus Bazaar",
    type: "BAZAAR",
    location: "Main Courtyard",
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "e2",
    title: "Tech Hall Booth Setup",
    type: "PLATFORM_BOOTH",
    location: "Tech Hall A3",
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    setupDurationWeeks: 2,
  },
];

export default function VendorUpcomingParticipation() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: "var(--font-jost)", fontWeight: 700, color: "#1E1E1E" }}
        >
          Upcoming Participation
        </Typography>
        <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)" }}>
          These are accepted bazaars or platform booths you’re participating in.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {demoData.map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            rightSlot={<Button size="small" variant="contained" color="primary">View Details</Button>}
          />
        ))}
      </Stack>
    </Box>
  );
}
