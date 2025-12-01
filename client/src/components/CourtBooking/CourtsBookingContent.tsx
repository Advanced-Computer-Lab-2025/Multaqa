"use client";

import React, { useEffect, useState } from "react";
import CourtBoard from "@/components/CourtBooking/CourtBoard";
import { CourtSlot, CourtType } from "@/components/CourtBooking/types";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import { api } from "@/api";
import { CircularProgress, Box, Alert } from "@mui/material";
import { toast } from "react-toastify";

const courtTypeMap: Record<string, { name: string; colorKey: "primary" | "secondary" | "tertiary" | "warning" }> = {
  basketball: { name: "Basketball", colorKey: "warning" },
  tennis: { name: "Tennis", colorKey: "secondary" },
  football: { name: "Football", colorKey: "tertiary" },
};

// All available time slots from backend constants
const ALL_TIME_SLOTS = [
  "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00",
  "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00"
];

interface Court {
  _id: string;
  type: string;
  reservations: Array<{
    userId: string;
    date: string;
    slot: string;
    _id: string;
  }>;
}

interface Availability {
  availableSlots: string[];
  reservedSlots: string[];
  totalAvailable: number;
  totalReserved: number;
}

interface CourtWithAvailability {
  court: Court;
  availability: Availability;
  date: string; // YYYY-MM-DD format from backend
}

interface BackendResponse {
  success: boolean;
  data: CourtWithAvailability[];
  message: string;
}

interface SingleCourtAvailabilityResponse {
  success: boolean;
  data: Availability;
  message: string;
}

const toISODate = (value: string | Date) => {
  const dateObj = new Date(value);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTodayISO = () => toISODate(new Date());

const buildSlotsForCourt = (
  court: Court,
  availability: Availability,
  dateISO: string
): CourtSlot[] => {
  return ALL_TIME_SLOTS.map((timeSlot) => {
    const [start, end] = timeSlot.split("-");
    const isReserved = availability.reservedSlots.includes(timeSlot);

    let reservedBy: string | undefined;
    if (isReserved) {
      const reservation = court.reservations.find((res) => {
        return toISODate(res.date) === dateISO && res.slot === timeSlot;
      });
      reservedBy = reservation?.userId;
    }

    return {
      id: `${court._id}-${dateISO}-${timeSlot}`,
      courtTypeId: court._id,
      day: dateISO,
      start,
      end,
      status: isReserved ? "reserved" : "available",
      reservedBy,
    };
  });
};

export default function CourtsBookingContent() {
  const [courts, setCourts] = useState<CourtType[]>([]);
  const [slots, setSlots] = useState<CourtSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [courtDetails, setCourtDetails] = useState<Record<string, Court>>({});
  const [loadingCourtId, setLoadingCourtId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<BackendResponse>("/courts/all");
      const courtsWithAvailability = response.data.data;

      const transformedCourts: CourtType[] = courtsWithAvailability.map(
        (item) => ({
          id: item.court._id,
          name: courtTypeMap[item.court.type]?.name || item.court.type,
          colorKey: courtTypeMap[item.court.type]?.colorKey || "primary",
        })
      );

      const detailsMap: Record<string, Court> = {};
      courtsWithAvailability.forEach((item) => {
        detailsMap[item.court._id] = item.court;
      });

      const allSlots: CourtSlot[] = courtsWithAvailability.flatMap((item) =>
        buildSlotsForCourt(item.court, item.availability, item.date)
      );

      setCourts(transformedCourts);
      setCourtDetails(detailsMap);
      setSlots(allSlots);
      setInlineError(null);
    } catch (err: unknown) {
      console.error("Error fetching courts:", err);

      let message = "Failed to fetch courts";
      if (typeof err === "object" && err !== null) {
        const maybeResponse = (err as { response?: { data?: { message?: string } } }).response;
        if (maybeResponse?.data?.message) {
          message = maybeResponse.data.message;
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCourtDate = async (courtId: string, nextDate: string | null) => {
    const court = courtDetails[courtId];
    if (!court) {
      console.warn("Unknown court id", courtId);
      return;
    }

    const targetDate = nextDate ?? getTodayISO();

    try {
      setLoadingCourtId(courtId);
      setInlineError(null);
      const response = await api.get<SingleCourtAvailabilityResponse>(
        `/courts/${courtId}/available-slots`,
        { params: { date: targetDate } }
      );

      const updatedSlots = buildSlotsForCourt(
        court,
        response.data.data,
        targetDate
      );

      setSlots((prev) => {
        const otherCourts = prev.filter((slot) => slot.courtTypeId !== courtId);
        return [...otherCourts, ...updatedSlots];
      });
    } catch (err) {
      console.error("Error loading court slots for date", err);
      setInlineError(
        "We couldn't load that day's slots. Please try another date or refresh."
      );
    } finally {
      setLoadingCourtId(null);
    }
  };

  const handleReserve = async (slot: CourtSlot) => {
    try {
      setLoadingCourtId(slot.courtTypeId);
      setInlineError(null);
      
      await api.post(`/courts/${slot.courtTypeId}/reserve`, {
        date: slot.day,
        slot: `${slot.start}-${slot.end}`
      });

      // Update the slot status locally
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id
            ? { ...s, status: "yours" as const, reservedBy: "You" }
            : s
        )
      );

      toast.success("Court slot reserved successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err: unknown) {
      console.error("Error reserving court slot:", err);
      
      let message = "Failed to reserve court slot";
      if (typeof err === "object" && err !== null) {
        const maybeResponse = (err as { response?: { data?: { message?: string } } }).response;
        if (maybeResponse?.data?.message) {
          message = maybeResponse.data.message;
        }
      }
      
      toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setInlineError(message);
    } finally {
      setLoadingCourtId(null);
    }
  };

  if (loading) {
    return (
      <ContentWrapper
        title="Reserve Courts"
        description="Pick a time slot from a court column. Slots are grouped by day. Click Reserve to book."
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </ContentWrapper>
    );
  }

  if (error) {
    return (
      <ContentWrapper
        title="Reserve Courts"
        description="Pick a time slot from a court column. Slots are grouped by day. Click Reserve to book."
      >
        <Alert severity="error">{error}</Alert>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper
      title="Reserve Courts"
      description="Pick a time slot from a court column. Slots are grouped by day. Click Reserve to book."
    >
      {inlineError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {inlineError}
        </Alert>
      )}
      <CourtBoard
        courts={courts}
        slots={slots}
        currentUser="You"
        embedded
        onChangeCourtDate={handleChangeCourtDate}
        onReserve={handleReserve}
        loadingCourtId={loadingCourtId}
      />
    </ContentWrapper>
  );
}
