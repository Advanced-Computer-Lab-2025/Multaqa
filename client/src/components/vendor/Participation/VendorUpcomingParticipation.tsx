"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Alert } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorParticipationItem } from "./types";
import theme from "@/themes/lightTheme";
import { api } from "@/api";

// Zero-fallback policy: do not generate client-side IDs. If the server
// doesn't provide an identifier for the participation (event._id or item._id),
// we skip the item entirely. This ensures the UI does not rely on client IDs
// and surfaces backend contract problems early.



// Map simple event types to participation items
const mapRequestedEventToParticipation = (item: any, vendorId: string): VendorParticipationItem | null => {
  const event = item?.event ?? {};
  const typeRaw = typeof event?.type === "string" ? event.type.toLowerCase() : "";
  const isBazaar = typeRaw === "bazaar";

  // Determine the status (top-level or nested RequestData)
  const rawStatus = item?.status ?? item?.RequestData?.status ?? item?.RequestData?.value?.status ?? "pending";
  const status = String(rawStatus).toLowerCase();
  if (status !== "approved" && status !== "accepted") return null; // only upcoming participations

  const startDate = typeof event?.eventStartDate === "string" ? event.eventStartDate : new Date().toISOString();
  const endDate = typeof event?.eventEndDate === "string" ? event.eventEndDate : undefined;

  // Enforce zero-fallback: require server-provided id
  const serverId = event?._id ?? item?._id;
  if (!serverId) return null;
  const id = String(serverId);
  const title = event?.eventName ?? "";
  const location = event?.location ?? "";

  const participation: VendorParticipationItem = {
    id: String(id),
    title,
    type: isBazaar ? "BAZAAR" : "PLATFORM_BOOTH",
    location,
    startDate,
  };

  if (isBazaar && endDate) participation.endDate = endDate;

  if (!isBazaar) {
    const rawDuration = item?.RequestData?.boothSetupDuration ?? item?.RequestData?.value?.boothSetupDuration;
    const numeric = Number(rawDuration);
    if (!Number.isNaN(numeric)) participation.setupDurationWeeks = numeric;
  }

  return participation;
};

export default function VendorUpcomingParticipation() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [items, setItems] = useState<VendorParticipationItem[]>([]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const renderDetails = (item: VendorParticipationItem) => (
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
        {item.type === "BAZAAR"
          ? "You’re accepted for this bazaar. Prepare your booth, inventory, and team."
          : `Setup duration: ${item.setupDurationWeeks ?? 1} week(s). Coordinate with venue staff for access.`}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        Contact: events-office@guc.edu.eg
      </Typography>
    </Stack>
  );

  // Shared presentation (type chips, location, date range) handled by VendorItemCard

  useEffect(() => {
    let cancelled = false;
    const vendorId = "68f17b38fae011215b7cf682"; // TODO: replace with localStorage retrieval when available
    if (!vendorId) return;

    const fetchUpcoming = async () => {
      setError(null);
      try {
        const res = await api.get(`/users/${vendorId}`);
        const payloadRoot = res.data?.data ?? res.data;
        const requested = payloadRoot?.requestedEvents ?? [];
        const mapped = (Array.isArray(requested) ? requested : []).map((r: any) => mapRequestedEventToParticipation(r, vendorId)).filter(Boolean) as VendorParticipationItem[];

        if (!cancelled) {
          const unique = new Map<string, VendorParticipationItem>();
          mapped.forEach((p) => {
            if (!unique.has(p.id)) unique.set(p.id, p);
          });
          setItems(Array.from(unique.values()));
        }
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setItems([]);
          setError(null);
          return;
        }
        setError(err?.response?.data?.message ?? err?.message ?? "Failed to load upcoming participations");
        setItems([]);
      }
    };


    fetchUpcoming();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, textAlign: 'left', fontFamily:"var(--font-jost), system-ui, sans-serif", color:`${theme.palette.tertiary.dark}`}}>
       My Upcoming Participations
      </Typography>
        <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)",  mb: 4 }}>
          Here are the bazaars or platform booths you’re participating in.
        </Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Stack spacing={2}>
        {(items.length ? items : []).map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            expanded={openId === item.id}
            details={renderDetails(item)}
          />
        ))}
      </Stack>
    </Box>
  );
}
