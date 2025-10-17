"use client";

import React, { useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import VendorItemCard from "./VendorItemCard";
import { VendorRequestItem } from "./types";
import theme from "@/themes/lightTheme";

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
  {
    id: "r2",
    title: "Library Booth",
    type: "PLATFORM_BOOTH",
    location: "Library Entrance",
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    setupDurationWeeks: 1,
    status: "ACCEPTED",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Capacity full for the requested dates.",
  },
];

export default function VendorRequestsList() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const renderDetails = (item: VendorRequestItem) => (
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
        {item.status === "PENDING"
          ? "Your request is under review. You will be notified once a decision is made."
          : item.status === "REJECTED"
          ? `Reason: ${item.notes ?? "Not provided."}`
          : "Approved. Please check Upcoming Participation for next steps."}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        Submitted: {new Date(item.submittedAt).toLocaleString()}
      </Typography>
    </Stack>
  );

  const statusChip = (status: VendorRequestItem["status"]) => {
    if (status === "PENDING") return <Chip size="small" label="Pending" color="warning" variant="outlined" />;
    if (status === "REJECTED") return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
    return <Chip size="small" label="Accepted" color="success" variant="outlined" />;
  };


  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
       <Box sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, textAlign: 'left', fontFamily:"var(--font-jost), system-ui, sans-serif", color:`${theme.palette.tertiary.dark}`}}>
           My Participation Requests
      </Typography>
        <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)",  mb: 4 }}>
        Review the status of your submissions for upcoming bazaars or booth setups.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {demoRequests.map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            expanded={openId === item.id}
            details={renderDetails(item)}
            rightSlot={
              <Stack direction="row" spacing={1} alignItems="center">
                {statusChip(item.status)}
                {/* <CustomButton
                  size="small"
                  variant={openId === item.id ? "outlined" : "contained"}
                  color="primary"
                  onClick={() => toggle(item.id)}
                  label={openId === item.id ? "Hide Details" : "View Details"}
                  width="auto"
                  height="32px"
                /> */}
              </Stack>
            }
          />
        ))}
      </Stack>
    </Box>
  );
}
