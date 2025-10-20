"use client";

import React, { useEffect, useState } from "react";
import CourtBoard from "@/components/CourtBooking/CourtBoard";
import { CourtSlot, CourtType } from "@/components/CourtBooking/types";
import ContentWrapper from "@/components/shared/containers/ContentWrapper";
import { api } from "@/api";
import { CircularProgress, Box, Alert } from "@mui/material";

const courtTypeMap: Record<string, { name: string; colorKey: "primary" | "secondary" | "tertiary" }> = {
  basketball: { name: "Basketball", colorKey: "primary" },
  tennis: { name: "Tennis", colorKey: "tertiary" },
  football: { name: "Football", colorKey: "secondary" },
};

// All available time slots from backend constants
const ALL_TIME_SLOTS = [
  "08:00-08:30", "08:30-09:00", "09:00-09:30", "09:30-10:00",
  "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00",
  "12:00-12:30", "12:30-13:00", "13:00-13:30", "13:30-14:00",
  "14:00-14:30", "14:30-15:00", "15:00-15:30", "15:30-16:00",
  "16:00-16:30", "16:30-17:00", "17:00-17:30", "17:30-18:00",
  "18:00-18:30", "18:30-19:00", "19:00-19:30", "19:30-20:00"
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

export default function CourtsBookingContent() {
  const [courts, setCourts] = useState<CourtType[]>([]);
  const [slots, setSlots] = useState<CourtSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<BackendResponse>("/courts/all");
      const courtsWithAvailability = response.data.data;

      // Transform courts
      const transformedCourts: CourtType[] = courtsWithAvailability.map((item) => ({
        id: item.court._id,
        name: courtTypeMap[item.court.type]?.name || item.court.type,
        colorKey: courtTypeMap[item.court.type]?.colorKey || "primary",
      }));

      const allSlots: CourtSlot[] = [];

      courtsWithAvailability.forEach((item) => {
        const { court, availability, date } = item;
        
        // Use the date from backend response (already in YYYY-MM-DD format)
        const dateISO = date;
        
        // Create slots using the backend-provided date
        ALL_TIME_SLOTS.forEach((timeSlot) => {
          const [start, end] = timeSlot.split("-");
          const isReserved = availability.reservedSlots.includes(timeSlot);
          
          // Find the reservation details if it's reserved
          let reservedBy: string | undefined;
          if (isReserved) {
            const reservation = court.reservations.find((res) => {
              // Extract date from reservation (YYYY-MM-DD format)
              const resDateObj = new Date(res.date);
              const resYear = resDateObj.getFullYear();
              const resMonth = String(resDateObj.getMonth() + 1).padStart(2, '0');
              const resDay = String(resDateObj.getDate()).padStart(2, '0');
              const resDateString = `${resYear}-${resMonth}-${resDay}`;
              
              return resDateString === dateISO && res.slot === timeSlot;
            });
            reservedBy = reservation?.userId;
          }

          allSlots.push({
            id: `${court._id}-${dateISO}-${timeSlot}`,
            courtTypeId: court._id,
            day: dateISO,
            start,
            end,
            status: isReserved ? "reserved" : "available",
            reservedBy,
          });
        });
      });

      setCourts(transformedCourts);
      setSlots(allSlots);
    } catch (err: any) {
      console.error("Error fetching courts:", err);
      setError(err.response?.data?.message || "Failed to fetch courts");
    } finally {
      setLoading(false);
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
      <CourtBoard
        courts={courts}
        slots={slots}
        currentUser="You"
        embedded
      />
    </ContentWrapper>
  );
}
