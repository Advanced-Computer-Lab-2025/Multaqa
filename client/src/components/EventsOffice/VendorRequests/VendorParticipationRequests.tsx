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
import { alpha } from "@mui/material/styles";
import { RefreshCw } from "lucide-react";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import { api } from "@/api";
import VendorRequestCard from "./VendorRequestCard";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import EmptyState from "@/components/shared/states/EmptyState";
import ErrorState from "@/components/shared/states/ErrorState";
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
  { key: "ALL", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const typeFilters: Array<{ key: TypeFilter; label: string }> = [
  { key: "ALL", label: "All" },
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

function mapRequest(
  entry: RawVendorRequest
): VendorParticipationRequest | null {
  const vendorRaw = entry.vendor ?? entry.vendor?.vendor;
  const vendorObject =
    typeof vendorRaw === "object" && vendorRaw !== null ? vendorRaw : undefined;
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
  const startDate = ensureString(
    eventRaw?.startDate ?? eventRaw?.eventStartDate
  );
  const endDate = ensureString(eventRaw?.endDate ?? eventRaw?.eventEndDate);
  const location = (eventRaw?.location as string | undefined) ?? undefined;

  const boothSize = requestData?.boothSize as string | undefined;
  const boothLocation = requestData?.boothLocation as string | undefined;
  const boothSetupDurationWeeks = toNumber(requestData?.boothSetupDuration);
  // Normalize attendees from multiple possible shapes/fields
  const collectArrays = (...candidates: unknown[]) =>
    candidates.filter(Array.isArray) as any[][];

  const candidateArrays = collectArrays(
    (requestData as any)?.bazaarAttendees,
    (requestData as any)?.boothAttendees,
    (requestData as any)?.attendees,
    (requestData as any)?.value?.bazaarAttendees,
    (requestData as any)?.value?.boothAttendees,
    (requestData as any)?.value?.attendees,
    (eventRaw as any)?.RequestData?.boothAttendees,
    (eventRaw as any)?.RequestData?.attendees,
    (eventRaw as any)?.attendees,
    (entry as any)?.attendees
  );

  const flattened = candidateArrays.flat();

  const parseContact = (val: any) => {
    if (typeof val === "string") {
      const str = val.trim();
      // Basic email detection in string
      if (str.includes("@")) {
        return { name: undefined, email: str };
      }
      return { name: str || undefined, email: undefined };
    }
    if (val && typeof val === "object") {
      const firstName = (val.firstName as string | undefined) ?? undefined;
      const lastName = (val.lastName as string | undefined) ?? undefined;
      const composed = [firstName, lastName].filter(Boolean).join(" ");
      const name = (val.name as string | undefined) ?? (composed || undefined);
      const email =
        (val.email as string | undefined) ??
        (val.mail as string | undefined) ??
        (val.contactEmail as string | undefined) ??
        undefined;
      if (name || email) return { name, email };
    }
    return undefined;
  };

  const deduped: { name?: string; email?: string }[] = [];
  const seen = new Set<string>();
  for (const item of flattened) {
    const contact = parseContact(item);
    if (!contact) continue;
    const key = contact.email
      ? `e:${contact.email.toLowerCase()}`
      : contact.name
      ? `n:${contact.name.toLowerCase()}`
      : null;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    deduped.push(contact);
  }
  const attendees = deduped;
  const status = normalizeStatus(requestData?.status);
  const submittedAt = ensureString(
    requestData?.submittedAt ?? requestData?.createdAt
  );
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
  const [responding, setResponding] = useState<
    Record<string, VendorRequestStatus | null>
  >({});
  const [refresh, setRefresh] = useState(false);

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
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to load vendor requests.";
      setError(message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, refresh]);

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
    const groups = new Map<
      string,
      { label: string; dateOrder: number; items: VendorParticipationRequest[] }
    >();

    filteredRequests.forEach((request) => {
      const dateValue = request.startDate ? new Date(request.startDate) : null;
      const isValidDate = dateValue && !Number.isNaN(dateValue.getTime());
      const dayKey = isValidDate
        ? new Date(
            dateValue!.getFullYear(),
            dateValue!.getMonth(),
            dateValue!.getDate()
          ).toISOString()
        : "unscheduled";
      const label = isValidDate
        ? new Intl.DateTimeFormat(undefined, { dateStyle: "full" }).format(
            dateValue!
          )
        : "Date To Be Determined";
      const dateOrder = isValidDate
        ? dateValue!.getTime()
        : Number.POSITIVE_INFINITY;
      const existing = groups.get(dayKey);
      if (existing) {
        existing.items.push(request);
      } else {
        groups.set(dayKey, { label, dateOrder, items: [request] });
      }
    });

    const sorted = Array.from(groups.values()).sort(
      (a, b) => a.dateOrder - b.dateOrder
    );
    sorted.forEach((group) => {
      group.items.sort((a, b) => {
        const aTime = a.startDate
          ? new Date(a.startDate).getTime()
          : Number.MAX_SAFE_INTEGER;
        const bTime = b.startDate
          ? new Date(b.startDate).getTime()
          : Number.MAX_SAFE_INTEGER;
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
      await api.patch(
        `/vendorEvents/${request.eventId}/vendor-requests/${request.vendorId}`,
        { status },
        { headers: { "Content-Type": "application/json" } }
      );

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
            : `${request.vendorName}&apos;s request has been rejected.`,
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        "Unable to update vendor request.";
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
        <ErrorState
          title="Failed to load vendor requests"
          description={error}
          onCtaClick={fetchRequests}
        />
      );
    }

    if (filteredRequests.length === 0) {
      return (
        <EmptyState
          title="No vendor requests match the selected filters"
          description="Adjust your filters or refresh to check for new submissions."
        />
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
                  setRefresh={setRefresh}
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    );
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ContentWrapper
        title="Vendor Participation Requests"
        description="Review pending vendor applications for bazaars and platform booths."
        headerMarginBottom={3}
      >
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
            mt: 2,
            mb: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {statusFilters.map(({ key, label }) => {
              const isActive = statusFilter === key;
              // Color coding: All (blue), Pending (orange), Approved (green), Rejected (red)
              const baseColor =
                key === "ALL"
                  ? "#6299d0" // Blue for All
                  : key === "pending"
                  ? "#f59e0b" // Orange/Amber for Pending
                  : key === "approved"
                  ? "#10b981" // Green for Approved
                  : "#ef4444"; // Red for Rejected

              return (
                <Chip
                  key={key}
                  label={label}
                  size="medium"
                  onClick={() => setStatusFilter(key)}
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
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {typeFilters.map(({ key, label }) => {
              const isActive = typeFilter === key;
              // Color coding: All (blue), Bazaar (purple), Platform Booth (blue)
              const baseColor =
                key === "ALL"
                  ? "#6299d0" // Blue for All
                  : key === "bazaar"
                  ? "#5b21b6" // Purple for Bazaar (matches VendorRequestCard)
                  : "#1d4ed8"; // Blue for Platform Booth (matches VendorRequestCard)

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

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>{content()}</Box>
      </ContentWrapper>
    </Box>
  );
}
