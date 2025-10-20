"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Alert } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorParticipationItem } from "./types";
import theme from "@/themes/lightTheme";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_MAP: Record<string, string> = {
  pending: "PENDING",
  approved: "ACCEPTED",
  rejected: "REJECTED",
};

const mapRequestedEventToVendorParticipation = (item: any, vendorId: string): VendorParticipationItem => {
  const eventValue = item?.event;
  const event = eventValue && typeof eventValue === "object" ? eventValue : {};
  const eventId = typeof eventValue === "string" ? eventValue : event?._id;
  const vendorEntry = Array.isArray(event?.vendors)
    ? event.vendors.find((vendor: any) => vendor?.vendor === vendorId)
    : undefined;

  const requestData = item?.RequestData ?? vendorEntry?.RequestData ?? {};

  const typeRaw = typeof event?.type === "string" ? event.type.toLowerCase() : "";
  const isBazaar = typeRaw === "bazaar";

  const rawStartDate = event?.eventStartDate;
  const startDate = typeof rawStartDate === "string" ? rawStartDate : new Date().toISOString();

  const rawEndDate = event?.eventEndDate;
  const endDate = typeof rawEndDate === "string" ? rawEndDate : undefined;

  const rawDuration =
    requestData?.boothSetupDuration ??
    requestData?.value?.boothSetupDuration ??
    vendorEntry?.RequestData?.boothSetupDuration;
  let setupDurationWeeks: number | undefined;
  if (rawDuration !== undefined) {
    const numeric = Number(rawDuration);
    if (!Number.isNaN(numeric)) {
      setupDurationWeeks = numeric;
    }
  }

  const rawId = item?._id ?? eventId ?? Math.random().toString(36).slice(2);
  const id = typeof rawId === "string" ? rawId : String(rawId);

  const title = typeof event?.eventName === "string" ? event.eventName : "";
  const location = typeof event?.location === "string" ? event.location : "";

  const mapped: VendorParticipationItem = {
    id,
    title,
    type: isBazaar ? "BAZAAR" : "PLATFORM_BOOTH",
    location,
    startDate,
  };

  if (isBazaar && endDate) {
    mapped.endDate = endDate;
  }

  if (!isBazaar && setupDurationWeeks !== undefined) {
    mapped.setupDurationWeeks = setupDurationWeeks;
  }

  return mapped;
};

export default function VendorUpcomingParticipation() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [participations, setParticipations] = useState<VendorParticipationItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  useEffect(() => {
    let cancelled = false;

    const vendorId = user?._id;

    if (!vendorId) {
      setError("Unable to find vendor information. Please sign in again.");
      return;
    }

    const fetchParticipations = async () => {
      setError(null);

      try {
        const response = await api.get(`/vendorEvents/${vendorId}`);
        const requestedEventsRaw = response.data?.data || [];

        const mapped = (requestedEventsRaw as any[])
          .map((entry) => mapRequestedEventToVendorParticipation(entry, vendorId as string))
          .filter((item: any) => {
            const eventValue = (requestedEventsRaw.find((e: any) => e._id === item.id || e.event?._id === item.id));
            const rawStatus = eventValue?.status ?? eventValue?.RequestData?.status ?? "pending";
            const statusKey = String(rawStatus ?? "").toLowerCase();
            const status = STATUS_MAP[statusKey] ?? "PENDING";
            return status === "ACCEPTED";
          });

        if (!cancelled) {
          const unique = new Map<string, VendorParticipationItem>();
          mapped.forEach((participation: VendorParticipationItem) => {
            if (!unique.has(participation.id)) {
              unique.set(participation.id, participation);
            }
          });
          setParticipations(Array.from(unique.values()));
        }
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setParticipations([]);
          setError(null);
          return;
        }
        const message = err?.response?.data?.message ?? err?.message ?? "Something went wrong";
        setError(message);
        setParticipations([]);
      }
    };

    fetchParticipations();

    return () => {
      cancelled = true;
    };
  }, [user]);
  
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {participations.map((item) => (
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
