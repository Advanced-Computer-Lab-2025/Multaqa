"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Typography, Stack, Alert, Chip, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import VendorItemCard from "./VendorItemCard";
import { VendorParticipationItem } from "./types";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";
import ContentWrapper from "../../shared/containers/ContentWrapper";

const STATUS_MAP: Record<string, string> = {
  pending: "PENDING",
  approved: "ACCEPTED",
  rejected: "REJECTED",
};

const mapRequestedEventToVendorParticipation = (
  item: any,
  vendorId: string
): VendorParticipationItem => {
  const eventValue = item?.event;
  const event = eventValue && typeof eventValue === "object" ? eventValue : {};
  const eventId = typeof eventValue === "string" ? eventValue : event?._id;
  const vendorEntry = Array.isArray(event?.vendors)
    ? event.vendors.find((vendor: any) => vendor?.vendor === vendorId)
    : undefined;
  const requestData = item?.RequestData ?? vendorEntry?.RequestData ?? {};

  const typeRaw =
    typeof event?.type === "string" ? event.type.toLowerCase() : "";
  const isBazaar = typeRaw === "bazaar";

  const rawStartDate = event?.eventStartDate;
  const startDate =
    typeof rawStartDate === "string" ? rawStartDate : new Date().toISOString();

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
  const [participations, setParticipations] = useState<
    VendorParticipationItem[]
  >([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "BAZAAR" | "PLATFORM_BOOTH"
  >("ALL");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  const typeFilters: Array<{
    key: "ALL" | "BAZAAR" | "PLATFORM_BOOTH";
    label: string;
  }> = [
    { key: "ALL", label: "All Types" },
    { key: "BAZAAR", label: "Bazaars" },
    { key: "PLATFORM_BOOTH", label: "Platform Booths" },
  ];

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
        const response = await api.get(`/vendorEvents`);
        const requestedEventsRaw = response.data?.data || [];
        console.log(requestedEventsRaw);
        const mapped = (requestedEventsRaw as any[])
          .map((entry) =>
            mapRequestedEventToVendorParticipation(entry, vendorId as string)
          )
          .filter((item: any) => {
            const eventValue = requestedEventsRaw.find(
              (e: any) => e._id === item.id || e.event?._id === item.id
            );
            const rawStatus =
              eventValue?.status ??
              eventValue?.RequestData?.status ??
              "pending";
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
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Something went wrong";
        setError(message);
        setParticipations([]);
      }
    };

    fetchParticipations();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const filteredParticipations = useMemo(() => {
    if (typeFilter === "ALL") return participations;
    return participations.filter((item) => item.type === typeFilter);
  }, [participations, typeFilter]);

  const renderDetails = (item: VendorParticipationItem) => (
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
        {item.type === "BAZAAR"
          ? "You're accepted for this bazaar. Prepare your booth, inventory, and team."
          : `Setup duration: ${
              item.setupDurationWeeks ?? 1
            } week(s). Coordinate with venue staff for access.`}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        Contact: events-office@guc.edu.eg
      </Typography>
    </Stack>
  );

  // Shared presentation (type chips, location, date range) handled by VendorItemCard

  return (
    <ContentWrapper
      title="My Upcoming Participations"
      description="Here are the bazaars or platform booths you're participating in."
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filter Pills */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {typeFilters.map(({ key, label }) => {
            const isActive = typeFilter === key;
            // Color coding: All (blue), Bazaar (pink/magenta), Platform Booth (light blue)
            const baseColor =
              key === "ALL"
                ? "#6299d0" // Blue for All
                : key === "BAZAAR"
                ? "#e91e63" // Pink/Magenta for Bazaar (matches EventColor)
                : "#2196f3"; // Light Blue for Platform Booth

            return (
              <Chip
                key={key}
                label={label}
                size="medium"
                onClick={() => setTypeFilter(key)}
                variant="outlined"
                sx={{
                  fontFamily: "var(--font-poppins)",
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  borderRadius: "28px",
                  px: 1.75,
                  height: 28,
                  borderWidth: isActive ? 3 : 1,
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: alpha(baseColor, isActive ? 0.12 : 0.08),
                  boxShadow: isActive
                    ? `0 6px 16px ${alpha(baseColor, 0.28)}`
                    : `0 1px 3px ${alpha(baseColor, 0.18)}`,
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease",
                  transform: isActive ? "translateY(-1px)" : "none",
                  "&:hover": {
                    backgroundColor: alpha(baseColor, 0.16),
                    borderWidth: isActive ? 3 : 2,
                    transform: "translateY(-1px)",
                  },
                }}
              />
            );
          })}
        </Stack>
      </Box>

      <Stack spacing={2}>
        {filteredParticipations.map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            expanded={openId === item.id}
            details={renderDetails(item)}
          />
        ))}
      </Stack>
    </ContentWrapper>
  );
}
