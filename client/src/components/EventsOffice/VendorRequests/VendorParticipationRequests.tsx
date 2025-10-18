"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { RefreshCw } from "lucide-react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { api } from "@/api";
import VendorRequestCard from "./VendorRequestCard";
import {
  StatusFilter,
  TypeFilter,
  VendorParticipationRequest,
  VendorRequestStatus,
  VendorEventKind,
} from "./types";

type Feedback = { type: "success" | "error"; message: string } | null;

type RawVendorRequest = {
  vendor?: any;
  RequestData?: any;
  event?: any;
};

const statusFilters: Array<{ key: StatusFilter; label: string }> = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "ALL", label: "All" },
];

const typeFilters: Array<{ key: TypeFilter; label: string }> = [
  { key: "ALL", label: "All Types" },
  { key: "bazaar", label: "Bazaars" },
  { key: "platform_booth", label: "Platform Booths" },
];

function ensureString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value && typeof (value as any).toString === "function") {
    return (value as any).toString();
  }
  return undefined;
}

function normalizeStatus(value: unknown): VendorRequestStatus {
  const normalized = String(value ?? "pending").toLowerCase();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return "pending";
}

function normalizeEventType(value: unknown): VendorEventKind {
  const normalized = String(value ?? "unknown").toLowerCase();
  if (normalized === "bazaar") return "bazaar";
  if (normalized === "platform_booth") return "platform_booth";
  return "unknown";
}

function toNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function mapRequest(entry: RawVendorRequest): VendorParticipationRequest | null {
  const vendorRaw = entry.vendor ?? entry.vendor?.vendor;
  const vendorObject = typeof vendorRaw === "object" && vendorRaw !== null ? vendorRaw : undefined;
  const vendorId = ensureString(vendorObject?._id ?? vendorRaw);
  const vendorName =
    (vendorObject?.companyName as string | undefined) ??
    (vendorObject?.name as string | undefined) ??
    "Unknown Vendor";
  const vendorRole = vendorObject?.role as string | undefined;
  const vendorLogo = vendorObject?.logo as string | undefined;

  const requestData = entry.RequestData ?? {};
  const eventRaw = entry.event ?? {};
  const eventId = ensureString(eventRaw?._id ?? eventRaw?.id);
  const eventName =
    (eventRaw?.name as string | undefined) ??
    (eventRaw?.eventName as string | undefined) ??
    "Untitled Event";
  const eventType = normalizeEventType(
    requestData?.eventType ?? eventRaw?.type ?? "unknown"
  );
  const startDate = ensureString(eventRaw?.startDate ?? eventRaw?.eventStartDate);
  const endDate = ensureString(eventRaw?.endDate ?? eventRaw?.eventEndDate);
  const location = (eventRaw?.location as string | undefined) ?? undefined;

  const boothSize = requestData?.boothSize as string | undefined;
  const boothLocation = requestData?.boothLocation as string | undefined;
  const boothSetupDurationWeeks = toNumber(requestData?.boothSetupDuration);
  const attendeesRaw = Array.isArray(requestData?.bazaarAttendees)
    ? requestData.bazaarAttendees
    : [];
  const attendees = attendeesRaw.map((att: any) => ({
    name: att?.name ?? undefined,
    email: att?.email ?? undefined,
  }));
  const status = normalizeStatus(requestData?.status);
  const submittedAt = ensureString(requestData?.submittedAt ?? requestData?.createdAt);
  const notes =
    (requestData?.notes as string | undefined) ??
    (requestData?.comment as string | undefined) ??
    undefined;

  if (!vendorId || !eventId) {
    return null;
  }

  return {
    id: `${eventId}-${vendorId}`,
    vendorId,
    vendorName,
    vendorLogo,
    vendorRole,
    eventId,
    eventName,
    eventType,
    location,
    startDate,
    endDate,
    status,
    boothSize,
    boothLocation,
    boothSetupDurationWeeks,
    attendees,
    submittedAt,
    notes,
    raw: entry,
  };
}

export default function VendorParticipationRequests() {
  const [requests, setRequests] = useState<VendorParticipationRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [responding, setResponding] = useState<Record<string, VendorRequestStatus | null>>({});

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await api.get("/vendorEvents/vendor-requests");
      const payload = response.data?.data ?? response.data ?? [];
      const mapped = (Array.isArray(payload) ? payload : [])
        .map((entry) => mapRequest(entry as RawVendorRequest))
        .filter((entry): entry is VendorParticipationRequest => Boolean(entry));

      setRequests(mapped);
      if (mapped.length === 0) {
        setFeedback({
          type: "success",
          message: "No pending vendor participation requests at the moment.",
        });
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Unable to load vendor requests.";
      setError(message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const statusMatch =
        statusFilter === "ALL" || request.status === statusFilter;
      const typeMatch =
        typeFilter === "ALL" || request.eventType === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [requests, statusFilter, typeFilter]);

  const groupedByDay = useMemo(() => {
    const groups = new Map<string, { label: string; dateOrder: number; items: VendorParticipationRequest[] }>();

    filteredRequests.forEach((request) => {
      const dateValue = request.startDate ? new Date(request.startDate) : null;
      const isValidDate = dateValue && !Number.isNaN(dateValue.getTime());
      const dayKey = isValidDate
        ? new Date(dateValue!.getFullYear(), dateValue!.getMonth(), dateValue!.getDate()).toISOString()
        : "unscheduled";
      const label = isValidDate
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(dateValue!)
        : "Date To Be Determined";
      const dateOrder = isValidDate ? dateValue!.getTime() : Number.POSITIVE_INFINITY;
      const existing = groups.get(dayKey);
      if (existing) {
        existing.items.push(request);
      } else {
        groups.set(dayKey, { label, dateOrder, items: [request] });
      }
    });

    const sorted = Array.from(groups.values()).sort((a, b) => a.dateOrder - b.dateOrder);
    sorted.forEach((group) => {
      group.items.sort((a, b) => {
        const aTime = a.startDate ? new Date(a.startDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.startDate ? new Date(b.startDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      });
    });

    return sorted;
  }, [filteredRequests]);

  const handleRespond = async (
    request: VendorParticipationRequest,
    status: Extract<VendorRequestStatus, "approved" | "rejected">
  ) => {
    setResponding((prev) => ({ ...prev, [request.id]: status }));
    setFeedback(null);
    setError(null);

    try {
      await api.patch(`/vendor-events/${request.eventId}/vendor-requests/${request.vendorId}`, {
        status: status === "approved" ? "approved" : "rejected",
      });

      setRequests((prev) =>
        prev.map((item) =>
          item.id === request.id
            ? {
                ...item,
                status,
              }
            : item
        )
      );
      setFeedback({
        type: "success",
        message:
          status === "approved"
            ? `${request.vendorName} has been approved for ${request.eventName}.`
            : `${request.vendorName}'s request has been rejected.`,
      });
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? "Unable to update vendor request.";
      setError(message);
    } finally {
      setResponding((prev) => ({ ...prev, [request.id]: null }));
    }
  };

  const content = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={32} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#4b5563" }}>
            No vendor requests match the selected filters.
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 1 }}>
            Adjust your filters or refresh to check for new submissions.
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={3}>
        {groupedByDay.map((group) => (
          <Box key={group.label}>
            <Typography
              variant="subtitle2"
              sx={{ color: "#6299d0", fontWeight: 700, mb: 1.5 }}
            >
              {group.label}
            </Typography>
            <Stack spacing={2.5}>
              {group.items.map((request) => (
                <VendorRequestCard
                  key={request.id}
                  request={request}
                  onRespond={(status) => handleRespond(request, status)}
                  disabled={Boolean(responding[request.id])}
                  loadingStatus={responding[request.id] ?? null}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: "var(--font-jost)", fontWeight: 700, color: "#1E1E1E" }}
          >
            Vendor Participation Requests
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#757575", fontFamily: "var(--font-poppins)" }}
          >
            Review pending vendor applications for bazaars and platform booths.
          </Typography>
        </Box>

        <CustomButton
          variant="outlined"
          color="primary"
          onClick={fetchRequests}
          startIcon={<RefreshCw size={16} />}
        >
          Refresh
        </CustomButton>
      </Box>

      {feedback ? (
        <Alert
          severity={feedback.type}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setFeedback(null)}
        >
          {feedback.message}
        </Alert>
      ) : null}

      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {statusFilters.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              size="small"
              variant={statusFilter === key ? "filled" : "outlined"}
              color={statusFilter === key ? "primary" : "default"}
              onClick={() => setStatusFilter(key)}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {typeFilters.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              size="small"
              variant={typeFilter === key ? "filled" : "outlined"}
              color={typeFilter === key ? "primary" : "default"}
              onClick={() => setTypeFilter(key)}
            />
          ))}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>{content()}</Box>
    </Box>
  );
}
