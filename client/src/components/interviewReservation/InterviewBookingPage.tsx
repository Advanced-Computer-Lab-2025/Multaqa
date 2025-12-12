"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { UsheringTeam } from '../shared/UsheringTeamApplications/types';
import { fetchTeams } from '../shared/UsheringTeamApplications/utils'; 
import TeamSelector from "../shared/UsheringTeamApplications/TeamSelector"; 
import TimeSlotList from "./TimeSlotList";
import BookingDetailsView from "./BookingDetailsView";
import { InterviewSlot } from "./types";

import { Box, Typography, Paper, Button, Alert, CircularProgress } from "@mui/material";
import ContentWrapper from "../shared/containers/ContentWrapper";
import { api } from "@/api";

const USHERING_ID = "693c2e8750e8f6aa33bd9c93";

// Raw slot structure from API
interface RawSlot {
  _id: string;
  id?: string;
  StartDateTime: string;
  EndDateTime: string;
  isAvailable: boolean;
  reservedBy?: { studentId: string; reservedAt: string };
  location?: string;
}

const fetchTeamSlots = async (teamId: string): Promise<InterviewSlot[]> => {
  if (!teamId) return [];

  try {
    const response = await api.get(`/ushering/`);
    const teamsData = response.data?.data?.[0]?.teams;
    if (!teamsData || !Array.isArray(teamsData)) return [];

    const selectedTeam = teamsData.find((team: any) => team._id === teamId);
    if (!selectedTeam) return [];

    const slots: RawSlot[] = selectedTeam.slots;
    const mappedSlots: InterviewSlot[] = slots
      .map((slot: RawSlot, index: number) => {
        if (!slot.StartDateTime || !slot.EndDateTime) return null;

        const startDate = new Date(slot.StartDateTime);
        const endDate = new Date(slot.EndDateTime);
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

        return {
          id: slot.id || slot._id || `${teamId}-${index}`,
          teamId,
          startDateTime: slot.StartDateTime,
          endDateTime: slot.EndDateTime,
          isAvailable: slot.isAvailable,
          reservedBy: slot.reservedBy ?? null,
          studentId: slot.reservedBy?.studentId ?? null,
          studentEmail: slot.reservedBy?.studentId
            ? `${slot.reservedBy.studentId}@university.edu`
            : null,
          location: slot.location || "TBD",
        } as InterviewSlot;
      })
      .filter((slot): slot is InterviewSlot => slot !== null);

    return mappedSlots;

  } catch (error: any) {
    console.error("Failed to fetch slots:", error);
    const statusText = error.response?.statusText || "Unknown Error";
    throw new Error(`Failed to fetch slots for team ${teamId}: ${statusText}`);
  }
};

export default function InterviewBookingPage() {
  const [teams, setTeams] = useState<UsheringTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<string>(''); 
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [slotsData, setSlotsData] = useState<InterviewSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [confirmedSlotId, setConfirmedSlotId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<InterviewSlot | null>(null);

  // Fetch teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      setTeamsError(null);
      try {
        const fetchedTeams = await fetchTeams(setTeamsLoading);
        setTeams(fetchedTeams);
        if (fetchedTeams.length > 0) setSelectedTeamId(fetchedTeams[0].id);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setTeamsError("Failed to load ushering teams. Please try again.");
      }
    };
    loadTeams();
  }, []);

  // Fetch student booking on mount
useEffect(() => {
  const fetchStudentBooking = async () => {
    try {
      console.log("[DEBUG] Fetching student booking...");
      const response = await api.get(`/ushering/${USHERING_ID}/studentSlots`);
      console.log("[DEBUG] /studentSlots response:", response.data);

      const slotData = response.data?.data?.slot;
      if (slotData) {
        const mappedSlot: InterviewSlot = {
          id: slotData.id || slotData._id,
          teamId: "", // optional if needed
          startDateTime: slotData.StartDateTime,
          endDateTime: slotData.EndDateTime,
          isAvailable: slotData.isAvailable,
          reservedBy: slotData.reservedBy,
          studentId: slotData.reservedBy?.studentId?._id || null,
          studentEmail: slotData.reservedBy?.studentId?.email || null,
          location: slotData.location || "TBD",
        };

        setConfirmedSlotId(mappedSlot.id);
        setBookingDetails(mappedSlot);

        console.log("[DEBUG] Mapped booked slot:", mappedSlot);
      } else {
        setConfirmedSlotId(null);
        setBookingDetails(null);
      }
    } catch (error: any) {
      console.error("[DEBUG] Failed to fetch student booking:", error);
    }
  };

  fetchStudentBooking();
}, []);
;

  // Fetch slots when selected team changes
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedTeamId || bookingDetails) return; // skip if user has a booking

      setSlotsLoading(true);
      setSlotsError(null);
      setSlotsData([]);
      setSelectedDate(undefined);
      setSelectedSlotId(null);

      try {
        const fetchedSlots = await fetchTeamSlots(selectedTeamId);
        setSlotsData(fetchedSlots);
      } catch (error: any) {
        console.error("Failed to fetch slots:", error);
        setSlotsError(error.message || "Failed to load interview slots for this team.");
      } finally {
        setSlotsLoading(false);
      }
    };
    loadSlots();
  }, [selectedTeamId, bookingDetails]);

  const teamSlots = useMemo(() => slotsData, [slotsData]);

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    teamSlots.forEach(slot => {
      const slotDate = new Date(slot.startDateTime);
      // Use local time for date extraction to match calendar display
      const dateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, "0")}-${String(slotDate.getDate()).padStart(2, "0")}`;
      if (slot.isAvailable) dates.add(dateStr);
    });
    return Array.from(dates).map(d => {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day); // Use local date, not UTC
    });
  }, [teamSlots]);

  const dateStr = useMemo(() => {
    if (!selectedDate) return "";
    // Use local time for consistency with calendar selection
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
  }, [selectedDate]);

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return teamSlots.filter(slot => {
      const slotDate = new Date(slot.startDateTime);
      // Use local time for filtering to match dateStr
      const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, "0")}-${String(slotDate.getDate()).padStart(2, "0")}`;
      return slotDateStr === dateStr;
    });
  }, [selectedDate, teamSlots, dateStr]);

  const selectedSlot = slotsData.find(s => s.id === selectedSlotId);
  const isBookedByOther = selectedSlot && !selectedSlot.isAvailable && selectedSlot.reservedBy?.studentId !== "currentUser";

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setSlotsError(null);
  };

  const handleFinalizeBookingAutomatic = async () => {
    if (!selectedSlotId || !selectedTeamId) return;

    const slotToBook = slotsData.find(s => s.id === selectedSlotId);
    if (!slotToBook || !slotToBook.isAvailable) {
      setSlotsError("Selected slot is already taken or invalid.");
      return;
    }

    try {
      await api.post(`/ushering/${USHERING_ID}/teams/${selectedTeamId}/slots/${selectedSlotId}/book`);

      const updatedSlot = {
        ...slotToBook,
        isAvailable: false,
        reservedBy: { studentId: "currentUser", reservedAt: new Date().toISOString() },
        studentId: "currentUser",
      };

      setSlotsData(prev =>
        prev.map(slot => (slot.id === selectedSlotId ? updatedSlot : slot))
      );

      setConfirmedSlotId(selectedSlotId);
      setBookingDetails(updatedSlot);
      setSelectedSlotId(null);
      setSlotsError(null);

    } catch (error: any) {
      console.error("Booking Error:", error);
      setSlotsError(error.message || "An unknown error occurred during booking.");
    }
  };

  const handleReserve = () => {
    if (!selectedSlotId || confirmedSlotId) return;
    handleFinalizeBookingAutomatic();
  };

  const handleCancel = async (slotId: string) => {
    try {
      await api.post(`/ushering/${USHERING_ID}/teams/${selectedTeamId}/slots/${slotId}/cancel`,{});

      setSlotsData(prev =>
        prev.map(slot =>
          slot.id === slotId
            ? { ...slot, isAvailable: true, reservedBy: null, studentId: null, studentEmail: null }
            : slot
        )
      );

      setConfirmedSlotId(null);
      setBookingDetails(null);
      setSelectedSlotId(null);
      setSelectedDate(undefined);

    } catch (error: any) {
      console.error("Cancel Error:", error);
      setSlotsError(error.message || "An unknown error occurred during cancellation.");
    }
  };

  const handleTeamSelect = useCallback((teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedDate(undefined);
    setSelectedSlotId(null);
    setConfirmedSlotId(null);
    setBookingDetails(null);
  }, []);

  const isLeftPanelDisabled = !!confirmedSlotId || slotsLoading;
  const isTeamSelectorDisabled = !!confirmedSlotId;

  if (teamsError) {
    return (
      <ContentWrapper title="Booking Error" description="Failed to load necessary data.">
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{teamsError}</Alert>
        </Box>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="Book Your Interview Slot" description="You can reserve your interview slot here.">
      <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {teamsLoading ? (
              <CircularProgress size={24} />
            ) : (
              <TeamSelector
                teams={teams}
                selectedTeamId={selectedTeamId}
                onTeamSelect={!isTeamSelectorDisabled ? handleTeamSelect : () => {}}
              />
            )}
          </Paper>

          {slotsError && <Alert severity="error" sx={{ mb: 3 }}>{slotsError}</Alert>}

          <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
            {!bookingDetails && (
              <Paper sx={{ flex: 1, p: 4, position: "relative" }}>
                {isLeftPanelDisabled && (
                  <Box sx={{ position: "absolute", inset: 0, zIndex: 10, backgroundColor: "rgba(255,255,255,0.7)", backdropFilter: "blur(1px)", cursor: "not-allowed" }} />
                )}
                <Typography variant="h6" sx={{ mb: 2 }}>Select a Date</Typography>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={!isLeftPanelDisabled ? setSelectedDate : undefined}
                  modifiers={{ available: availableDates }}
                  modifiersClassNames={{
                    available: "bg-blue-100 text-blue-700 font-semibold rounded-full",
                  }}
                />
              </Paper>
            )}

            <Paper sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column", minHeight: "100%" }}>
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {bookingDetails ? (
                  <BookingDetailsView
                    booking={bookingDetails}
                    onCancel={() => handleCancel(bookingDetails.id)}
                  />
                ) : (
                  <>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.primary" }}>
                      {selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "Select a date"}
                    </Typography>

                    <Box sx={{ flexGrow: 1, mb: 4 }}>
                      {slotsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : (
                        selectedDate ? (
                          slotsForDate.length > 0 ? (
                            <TimeSlotList
                              date={dateStr}
                              slots={slotsForDate}
                              selectedSlotId={selectedSlotId}
                              onSelectSlot={handleSlotSelect}
                            />
                          ) : (
                            <Typography color="error">No available slots for the selected date.</Typography>
                          )
                        ) : (
                          <Typography color="text.secondary">Select a date to view available time slots</Typography>
                        )
                      )}
                    </Box>

                    {selectedDate && slotsForDate.length > 0 && !slotsLoading && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleReserve} 
                        disabled={!selectedSlotId || isBookedByOther}
                        sx={{ py: "14px", fontWeight: 600, fontSize: "1.1rem", borderRadius: "8px" , width: '100%', backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1d4ed8' } }}
                      >
                        Reserve Slot
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ContentWrapper>
  );
}
