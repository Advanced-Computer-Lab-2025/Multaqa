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
import { IStudent } from "../../../../backend/interfaces/models/student.interface";

import { Box, Typography, Paper, Button, Alert, CircularProgress } from "@mui/material";
import ContentWrapper from "../shared/containers/ContentWrapper";
import { api } from "@/api";
import { useAuth } from "@/context/AuthContext";

// Define the raw API slot structure
interface RawSlot {
  _id: string;
  id?: string;
  StartDateTime: string;
  EndDateTime: string;
  isAvailable: boolean;
  reservedBy?: { studentId: string; reservedAt: string };
  location?: string;
}

export default function InterviewBookingPage() {
    const { user } = useAuth();
    const [teams, setTeams] = useState<UsheringTeam[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);
    const [usheringId, setUsheringId] = useState<string | null>(null);
    const [bookingInProgress, setBookingInProgress] = useState(false);

    // Fetch slots for a specific team
    const fetchTeamSlots = useCallback(async (teamId: string): Promise<InterviewSlot[]> => {
      if (!teamId) return [];

      try {
        console.log("[DEBUG] Fetching slots for team:", teamId);

        const response = await api.get(`/ushering/`);
        console.log("[DEBUG] API response:", response.data);
        const usheringData = response.data?.data[0];
        
        // Store ushering ID for booking operations
        if (usheringData?._id) {
          setUsheringId(usheringData._id);
        }
        
        const teamsData = usheringData?.teams;
        console.log("[DEBUG] Teams data extracted:", teamsData);

        if (!teamsData || !Array.isArray(teamsData)) {
          console.error("[DEBUG] Invalid teams structure:", teamsData);
          return [];
        }

        const selectedTeam = teamsData.find((team: any) => team._id === teamId);
        console.log("[DEBUG] Selected team:", selectedTeam);

        if (!selectedTeam) {
          console.warn(`[DEBUG] Team ID ${teamId} not found in API response`);
          return [];
        }

        const slots: RawSlot[] = selectedTeam.slots;
        console.log("[DEBUG] Raw slots fetched:", slots);

        const mappedSlots: InterviewSlot[] = slots
          .map((slot: RawSlot, index: number) => {
            if (!slot.StartDateTime || !slot.EndDateTime) {
              console.warn(`[DEBUG] Slot missing StartDateTime or EndDateTime`, slot);
              return null;
            }

            const startDate = new Date(slot.StartDateTime);
            const endDate = new Date(slot.EndDateTime);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              console.warn(`[DEBUG] Invalid dates for slot`, slot);
              return null;
            }

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

        console.log("[DEBUG] Mapped slots:", mappedSlots);
        return mappedSlots;

      } catch (error: any) {
        console.error("[DEBUG] Failed to fetch slots:", error);
        const statusText = error.response?.statusText || "Unknown Error";
        throw new Error(`Failed to fetch slots for team ${teamId}: ${statusText}`);
      }
    }, []);

    const [selectedTeamId, setSelectedTeamId] = useState<string>(''); 
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const [slotsData, setSlotsData] = useState<InterviewSlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
    const [slotsError, setSlotsError] = useState<string | null>(null);

    const [confirmedSlotId, setConfirmedSlotId] = useState<string | null>(null);

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

    // Fetch slots when selected team changes
    useEffect(() => {
        const loadSlots = async () => {
            if (!selectedTeamId) return setSlotsData([]);

            setSlotsLoading(true);
            setSlotsError(null);
            setSlotsData([]);
            setSelectedDate(undefined);
            setSelectedSlotId(null);
            setConfirmedSlotId(null);

            try {
                const fetchedSlots = await fetchTeamSlots(selectedTeamId);
                setSlotsData(fetchedSlots);

                const student = user as IStudent | null;
                const existingBooking = fetchedSlots.find(
                    (slot) => slot.reservedBy?.studentId === student?.gucId
                );
                if (existingBooking) setConfirmedSlotId(existingBooking.id);

            } catch (error: any) {
                console.error("Failed to fetch slots:", error);
                setSlotsError(error.message || "Failed to load interview slots for this team.");
            } finally {
                setSlotsLoading(false);
            }
        };

        loadSlots();
    }, [selectedTeamId, fetchTeamSlots, user]);

    const teamSlots = useMemo(() => slotsData, [slotsData]);

    // ------------------------------------------------------------
const availableDates = useMemo(() => {
    const dates = new Set<string>();

    const student = user as IStudent | null;
    teamSlots.forEach((slot) => {
        const slotDate = new Date(slot.startDateTime);
        const yyyy = slotDate.getUTCFullYear();
        const mm = String(slotDate.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(slotDate.getUTCDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;

        // Include the slot if available or reserved by current user
        if (slot.isAvailable || slot.reservedBy?.studentId === student?.gucId) {
            dates.add(dateStr);
        }
    });

    return Array.from(dates).map((d) => {
        const [year, month, day] = d.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    });
}, [teamSlots, user]);

// ------------------------------------------------------------
// 2. Selected date string in YYYY-MM-DD for filtering
// ------------------------------------------------------------
const dateStr = useMemo(() => {
    if (!selectedDate) return "";
    const year = selectedDate.getUTCFullYear();
    const month = String(selectedDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}, [selectedDate]);

// ------------------------------------------------------------
// 3. Slots for the selected date
// ------------------------------------------------------------
const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];

    const filteredSlots = teamSlots.filter((slot) => {
        const slotDate = new Date(slot.startDateTime);
        const yyyy = slotDate.getUTCFullYear();
        const mm = String(slotDate.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(slotDate.getUTCDate()).padStart(2, "0");
        const slotDateStr = `${yyyy}-${mm}-${dd}`;

        return slotDateStr === dateStr;
    });

    console.log("Slots for selected date:", dateStr, filteredSlots);
    return filteredSlots;
}, [selectedDate, teamSlots, dateStr]);

    // ------------------------------------------------------------
    // Check if user has a current booking
    // ------------------------------------------------------------
    const hasCurrentBooking = useMemo(
        () => {
            const student = user as IStudent | null;
            return slotsData.some(
                (slot) => slot.reservedBy?.studentId === student?.gucId
            );
        },
        [slotsData, user]
    );

    const currentBooking = useMemo(() => {
        const student = user as IStudent | null;
        return slotsData.find(
        (s) => s.reservedBy?.studentId === student?.gucId
        );
    }, [slotsData, user]);

    const selectedSlot = slotsData.find((s) => s.id === selectedSlotId);
    const student = user as IStudent | null;
    const isBookedByOther = selectedSlot && !selectedSlot.isAvailable && selectedSlot.reservedBy?.studentId !== student?.gucId;

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlotId(slotId);
        setSlotsError(null);
    };

    const handleFinalizeBookingAutomatic = async () => {
        if (!selectedSlotId || !selectedTeamId || !usheringId || !user) {
            setSlotsError("Missing required information for booking.");
            return;
        }

        const student = user as IStudent;

        const slotToBook = slotsData.find(s => s.id === selectedSlotId);
        if (!slotToBook || !slotToBook.isAvailable) {
            setSlotsError("Selected slot is already taken or invalid.");
            return;
        }

        setBookingInProgress(true);
        const previousSlotsData = [...slotsData];

        // Optimistic update
        setSlotsData(prev =>
            prev.map(slot =>
                slot.id === selectedSlotId
                    ? {
                        ...slot,
                        isAvailable: false,
                        reservedBy: { studentId: student.gucId, reservedAt: new Date().toISOString() },
                        studentEmail: student.email,
                        studentId: student.gucId,
                    }
                    : slot
            )
        );

        try {
            await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${selectedSlotId}/book`, {
                studentId: student.gucId,
                studentEmail: student.email,
                firstName: student.firstName,
                lastName: student.lastName,
            });

            setConfirmedSlotId(selectedSlotId);
            setSelectedSlotId(null);
            setSlotsError(null);

        } catch (error: any) {
            console.error("Booking Finalization Error:", error);
            
            // Rollback optimistic update
            setSlotsData(previousSlotsData);
            
            // Handle specific error cases
            if (error.response?.status === 400 && error.response?.data?.message?.includes('already booked')) {
                setSlotsError("You have already booked a slot for this event.");
            } else if (error.response?.status === 409) {
                setSlotsError("This slot was just taken by another user. Please select a different slot.");
                // Refresh slots to get latest state
                if (selectedTeamId) {
                    const refreshedSlots = await fetchTeamSlots(selectedTeamId);
                    setSlotsData(refreshedSlots);
                }
            } else {
                setSlotsError(error.response?.data?.message || error.message || "An unknown error occurred during booking.");
            }
        } finally {
            setBookingInProgress(false);
        }
    };

    const handleReserve = () => {
        if (!selectedSlotId || hasCurrentBooking || bookingInProgress) return;
        handleFinalizeBookingAutomatic();
    };

    const handleCancel = async (slotId: string) => {
        if (!usheringId || !selectedTeamId || !user) {
            setSlotsError("Missing required information for cancellation.");
            return;
        }

        const student = user as IStudent;
        setBookingInProgress(true);
        const previousSlotsData = [...slotsData];

        // Optimistic update
        setSlotsData(prev =>
            prev.map(slot =>
                slot.id === slotId
                    ? {
                        ...slot,
                        isAvailable: true,
                        reservedBy: null,
                        studentEmail: null,
                        studentId: null,
                    }
                    : slot
            )
        );

        try {
            await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${slotId}/cancel`, {
                studentId: student.gucId,
            });

            setConfirmedSlotId(null);
            setSelectedSlotId(null);
            setSlotsError(null);

        } catch (error: any) {
            console.error("Cancellation Error:", error);
            
            // Rollback optimistic update
            setSlotsData(previousSlotsData);
            
            setSlotsError(error.response?.data?.message || error.message || "An unknown error occurred during cancellation.");
            
            // Refresh slots to get latest state
            if (selectedTeamId) {
                const refreshedSlots = await fetchTeamSlots(selectedTeamId);
                setSlotsData(refreshedSlots);
            }
        } finally {
            setBookingInProgress(false);
        }
    };

    const handleTeamSelect = useCallback((teamId: string) => {
        setSelectedTeamId(teamId);
        setSelectedDate(undefined);
        setSelectedSlotId(null);
        setConfirmedSlotId(null);
    }, []);

    const isLeftPanelDisabled = hasCurrentBooking || slotsLoading; 
    const isTeamSelectorDisabled = hasCurrentBooking;

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
                        <Typography variant="h6" gutterBottom>Select Your Ushering Team</Typography>
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

                    {slotsError && (
                        <Alert severity="error" sx={{ mb: 3 }}>{slotsError}</Alert>
                    )}

                    <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>

                        <Paper sx={{ flex: 1, p: 4, position: "relative" }}>
                            {isLeftPanelDisabled && (
                                <Box sx={{
                                    position: "absolute", inset: 0, zIndex: 10,
                                    backgroundColor: "rgba(255,255,255,0.7)",
                                    backdropFilter: "blur(1px)", cursor: "not-allowed"
                                }} />
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

                        <Paper sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column", minHeight: "100%" }}>
                            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>

                                {hasCurrentBooking && currentBooking ? (
                                    <BookingDetailsView
                                        booking={{
                                            ...currentBooking,
                                            date: currentBooking.startDateTime,
                                            start: new Date(currentBooking.startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                                            end: new Date(currentBooking.endDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                                        } as any}
                                        onCancel={() => handleCancel(currentBooking.id)}
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
                                                disabled={!selectedSlotId || isBookedByOther || bookingInProgress}
                                                sx={{ py: "14px", fontWeight: 600, fontSize: "1.1rem", borderRadius: "8px" , width: '100%', backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1d4ed8' } }}
                                            >
                                                {bookingInProgress ? (
                                                    <>
                                                        <CircularProgress size={20} sx={{ mr: 1 }} />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    "Reserve Slot"
                                                )}
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
