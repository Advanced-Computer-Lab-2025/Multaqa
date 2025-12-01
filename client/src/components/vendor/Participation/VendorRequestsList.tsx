"use client";

import React, { useState, useEffect } from "react";
import { Typography, Stack, Chip, Alert } from "@mui/material";
import VendorItemCard from "./VendorItemCard";
import { VendorRequestItem } from "./types";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import CancelApplicationVendor from "@/components/Event/Modals/CancelApplicationVendor";
import VendorPaymentDrawer from "@/components/Event/helpers/VendorPaymentDrawer";
import ContentWrapper from "../../shared/containers/ContentWrapper";
import theme from "@/themes/lightTheme";

const STATUS_MAP: Record<string, VendorRequestItem["status"]> = {
  pending: "PENDING",
  approved: "ACCEPTED",
  rejected: "REJECTED",
};

interface ExtendedVendorRequest extends VendorRequestItem {
  hasPaid?: boolean;
  participationFee?: number;
  rawStatus?: string;
}

const mapRequestedEventToVendorRequest = (
  item: any,
  vendorId: string
): ExtendedVendorRequest => {
  const eventValue = item?.event;
  const event = eventValue && typeof eventValue === "object" ? eventValue : {};
  const eventId = typeof eventValue === "string" ? eventValue : event?._id;
  const vendorEntry = Array.isArray(event?.vendors)
    ? event.vendors.find((vendor: any) => vendor?.vendor === vendorId)
    : undefined;

  const requestData = item?.RequestData ?? vendorEntry?.RequestData ?? {};
  const rawStatus =
    item?.status ??
    requestData?.status ??
    vendorEntry?.RequestData?.status ??
    "pending";
  const statusKey = String(rawStatus ?? "").toLowerCase();
  const status = STATUS_MAP[statusKey] ?? "PENDING";

  // Get hasPaid and participationFee from the item (top-level vendorEvent)
  console.log("Item:", item);
  const hasPaid = item?.hasPaid ?? false;
  const participationFee = item?.participationFee ?? 0;

  const typeRaw =
    typeof event?.type === "string" ? event.type.toLowerCase() : "";
  const isBazaar = typeRaw === "bazaar";

  const rawSubmittedAt =
    item?.createdAt ?? requestData?.submittedAt ?? event?.registrationDeadline;
  const submittedAt =
    typeof rawSubmittedAt === "string"
      ? rawSubmittedAt
      : new Date().toISOString();

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

  const mapped: ExtendedVendorRequest = {
    id,
    title,
    type: isBazaar ? "BAZAAR" : "PLATFORM_BOOTH",
    location,
    startDate,
    status,
    submittedAt,
    eventId,
    hasPaid,
    participationFee,
    rawStatus: statusKey,
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
  const [requests, setRequests] = useState<ExtendedVendorRequest[]>([]);
  const [cancelApplication, setCancelApplication] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  // track which request (vendorEvent) was selected
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedParticipationFee, setSelectedParticipationFee] = useState<number>(0);
  
  // toggle to trigger refetch after cancel or payment
  const [refreshToggle, setRefreshToggle] = useState(false);

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
        console.log("Fetched vendor events:", requestedEventsRaw);

        const mapped = (requestedEventsRaw as any[])
          .map((entry) =>
            mapRequestedEventToVendorRequest(entry, vendorId as string)
          )
          .filter(
            (item) => !item.hasPaid && (item.status === "PENDING" || item.status === "REJECTED" || item.status === "ACCEPTED")
          );

        if (!cancelled) {
          const unique = new Map<string, ExtendedVendorRequest>();
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
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Something went wrong";
        setError(message);
        setRequests([]);
      }
    };

    fetchRequests();

    return () => {
      cancelled = true;
    };
   // refetch when user or refreshToggle change
  }, [user, refreshToggle]);

  const renderDetails = (item: ExtendedVendorRequest) => (
    <Stack spacing={1}>
      <Typography variant="body2" sx={{ color: "#1E1E1E" }}>
        {item.status === "PENDING"
          ? "Your request is under review. You will be notified once a decision is made."
          : item.status === "REJECTED"
          ? `Reason: ${item.notes ?? "Not provided."}`
          : item.status === "ACCEPTED" && !item.hasPaid
          ? "Approved! Please complete payment to confirm your participation."
          : item.status === "ACCEPTED" && item.hasPaid
          ? "Payment completed. Thank you!"
          : ""}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        Submitted: {new Date(item.submittedAt).toLocaleString()}
      </Typography>
      {item.status === "ACCEPTED" && item.participationFee && (
        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 600 }}>
          Participation Fee: EGP {item.participationFee.toFixed(2)}
        </Typography>
      )}
    </Stack>
  );

  const statusChip = (item: ExtendedVendorRequest) => {
    if (item.status === "PENDING")
      return (
        <Chip size="small" label="Pending" color="warning" variant="outlined" />
      );
    if (item.status === "REJECTED")
      return (
        <Chip size="small" label="Rejected" color="error" variant="outlined" />
      );
    // If approved but not paid, show "Pending Payment"
    if (item.rawStatus === "approved" && !item.hasPaid)
      return (
        <Chip size="small" label="Pending Payment" color="info" variant="outlined" />
      );
    return (
      <Chip size="small" label="Accepted" color="success" variant="outlined" />
    );
  };

  const renderActionButton = (item: ExtendedVendorRequest) => {
    // If approved and not paid -> show Pay button
    if (item.rawStatus === "approved" && !item.hasPaid) {
      return (
        <CustomButton
          size="small"
          variant="contained"
          sx={{
            borderRadius: 999,
            border: `1px solid ${theme.palette.success.dark}`,
            backgroundColor: `${theme.palette.success.main}`,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            px: 3,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
          }}
          onClick={() => {
            setSelectedEventId(item.eventId ?? null);
            setSelectedParticipationFee(item.participationFee ?? 0);
            setPaymentDrawerOpen(true);
          }}
        >
          Pay
        </CustomButton>
      );
    }

    // If pending (not approved) and not paid -> show Cancel Application
    if (item.status === "PENDING" && !item.hasPaid) {
      return (
        <CustomButton
          size="small"
          variant="outlined"
          sx={{
            borderRadius: 999,
            border: `1px solid ${theme.palette.error.dark}`,
            backgroundColor: `${theme.palette.error.main}`,
            color: "background.paper",
            fontWeight: 600,
            px: 3,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
            },
            width: 'fit-content'
          }}
          onClick={() => {
            setSelectedEventId(item.eventId ?? null);
            setCancelApplication(true);
          }}
        >
          Cancel Application
        </CustomButton>
      );
    }

    // If paid or rejected, render nothing
    return null;
  };

  return (
    <ContentWrapper
      title="My Participation Requests"
      description="Review the status of your submissions for upcoming bazaars or booth setups."
    >
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
              <Stack direction="column" spacing={2} alignItems="center">
                {statusChip(item)}
                {renderActionButton(item)}
              </Stack>
            }
          />
        ))}
        <CancelApplicationVendor
          eventId={selectedEventId ?? ""}
          open={cancelApplication}
          onClose={() => {
            setCancelApplication(false);
            setSelectedEventId(null);
          }}
          setRefresh={setRefreshToggle}
        />
        <VendorPaymentDrawer
          open={paymentDrawerOpen}
          onClose={() => {
            setPaymentDrawerOpen(false);
            setSelectedEventId(null);
          }}
          eventId={selectedEventId ?? ""}
          totalAmount={selectedParticipationFee}
          email={user?.email ?? ""}
        />
      </Stack>
    </ContentWrapper>
  );
}
