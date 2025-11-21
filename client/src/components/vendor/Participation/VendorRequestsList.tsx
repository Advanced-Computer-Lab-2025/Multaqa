"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Chip, Alert } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorRequestItem } from "./types";
import theme from "@/themes/lightTheme";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/shared/Buttons/CustomButton";

const STATUS_MAP: Record<string, VendorRequestItem["status"]> = {
  pending: "PENDING",
  approved: "ACCEPTED",
  rejected: "REJECTED",
};

const mapRequestedEventToVendorRequest = (item: any, vendorId: string): VendorRequestItem => {
  const eventValue = item?.event;
  const event = eventValue && typeof eventValue === "object" ? eventValue : {};
  const eventId = typeof eventValue === "string" ? eventValue : event?._id;
  const vendorEntry = Array.isArray(event?.vendors)
    ? event.vendors.find((vendor: any) => vendor?.vendor === vendorId)
    : undefined;

  const requestData = item?.RequestData ?? vendorEntry?.RequestData ?? {};
  const rawStatus = item?.status ?? requestData?.status ?? vendorEntry?.RequestData?.status ?? "pending";
  const statusKey = String(rawStatus ?? "").toLowerCase();
  const status = STATUS_MAP[statusKey] ?? "PENDING";

  const typeRaw = typeof event?.type === "string" ? event.type.toLowerCase() : "";
  const isBazaar = typeRaw === "bazaar";

  const rawSubmittedAt = item?.createdAt ?? requestData?.submittedAt ?? event?.registrationDeadline;
  const submittedAt = typeof rawSubmittedAt === "string" ? rawSubmittedAt : new Date().toISOString();

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

  const mapped: VendorRequestItem = {
    id,
    title,
    type: isBazaar ? "BAZAAR" : "PLATFORM_BOOTH",
    location,
    startDate,
    status,
    submittedAt,
  };

  if (isBazaar && endDate) {
    mapped.endDate = endDate;
  }

  if (!isBazaar && setupDurationWeeks !== undefined) {
    mapped.setupDurationWeeks = setupDurationWeeks;
  }

  return mapped;
};

export default function VendorRequestsList() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<VendorRequestItem[]>([]);

  useEffect(() => {
    let cancelled = false;

    const vendorId = user?._id;

    if (!vendorId) {
      setError("Unable to find vendor information. Please sign in again.");
      return;
    }

    const fetchRequests = async () => {
      setError(null);

      try {
        const response = await api.get(`/vendorEvents`);
        const requestedEventsRaw = response.data?.data || [];

        const mapped = (requestedEventsRaw as any[])
          .map((entry) => mapRequestedEventToVendorRequest(entry, vendorId as string))
          .filter((item) => item.status === "PENDING" || item.status === "REJECTED");

        if (!cancelled) {
          const unique = new Map<string, VendorRequestItem>();
          mapped.forEach((request) => {
            if (!unique.has(request.id)) {
              unique.set(request.id, request);
            }
          });
          setRequests(Array.from(unique.values()));
        }
      } catch (err: any) {
        if (cancelled) return;
        if (err?.response?.status === 404) {
          setRequests([]);
          setError(null);
          return;
        }
        const message = err?.response?.data?.message ?? err?.message ?? "Something went wrong";
        setError(message);
        setRequests([]);
      }
    };

    fetchRequests();

    return () => {
      cancelled = true;
    };
  }, [user]);

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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2}>
        {(requests.length ? requests : []).map((item) => (
          <VendorItemCard
            key={item.id}
            item={item}
            details={renderDetails(item)}
            rightSlot={
              <Stack direction="column" spacing={5} alignItems="center">
                {statusChip(item.status)}
                {item.status === "PENDING" && (
                  <CustomButton
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      backgroundColor: `${theme.palette.primary.main}10`,
                      color: theme.palette.primary.main,
                      borderColor: theme.palette.primary.main,
                      width: "fit-content",
                      fontSize: '0.5rem',
                    }}
                  >
                    Cancel Application
                  </CustomButton>
                )}
              </Stack>
            }
          />
        ))}
      </Stack>
    </Box>
  );
}
