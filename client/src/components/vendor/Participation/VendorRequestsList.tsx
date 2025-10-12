"use client";

import React from "react";
import { Box, Typography, Stack, Chip, Button } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorRequestItem } from "./types";

const demoRequests: VendorRequestItem[] = [
  {
    id: "r1",
    title: "Autumn Bazaar",
    type: "BAZAAR",
    location: "Sports Complex",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  },
  {
    id: "r2",
    title: "Library Booth",
    type: "PLATFORM_BOOTH",
    location: "Library Entrance",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    setupDurationWeeks: 1,
    status: "REJECTED",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Capacity full for the requested dates.",
  },
];

export default function VendorRequestsList() {
  const statusChip = (status: VendorRequestItem["status"]) => {
    if (status === "PENDING") return <Chip size="small" label="Pending" color="warning" variant="outlined" />;
    if (status === "REJECTED") return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
    return <Chip size="small" label="Approved" color="success" variant="outlined" />;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          sx={{ fontFamily: "var(--font-jost)", fontWeight: 700, color: "#1E1E1E" }}
        >
          My Requests
        </Typography>
        <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)" }}>
          Review the status of your submissions for upcoming bazaars or booth setups.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {demoRequests.map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            rightSlot={
              <Stack direction="row" spacing={1} alignItems="center">
                {statusChip(item.status)}
                <Button size="small" variant="outlined" color="primary">Details</Button>
              </Stack>
            }
          />
        ))}
      </Stack>
    </Box>
  );
}
