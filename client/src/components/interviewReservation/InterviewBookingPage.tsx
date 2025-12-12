"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { UsheringTeam } from '../shared/UsheringTeamApplications/types';
import { getTeamColor, getTeamIcon } from '../shared/UsheringTeamApplications/utils';
import BookingSkeleton from "./BookingSkeleton";
import TeamSelector from "../shared/UsheringTeamApplications/TeamSelector";
import TimeSlotList from "./TimeSlotList";
import BookingDetailsView from "./BookingDetailsView";
import { InterviewSlot } from "./types";

import { Box, Typography, Paper, Button, Alert, CircularProgress } from "@mui/material";
import ContentWrapper from "../shared/containers/ContentWrapper";
import { api } from "@/api";
import { toast } from "react-toastify";

// Team name mapping based on index (backend doesn't have title)
const TEAM_NAMES = [
  'Graduates',
  'Parents',
  'Caps & Gowns',
  'Flow',
  'VIP',
  'HR',
  'Stage',
];

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

// Backend team structure
interface BackendTeam {
  _id?: string;
  id: string;
  title?: string;
  description: string;
  slots: RawSlot[];
}

// Backend ushering data structure
interface BackendUsheringData {
  id: string;
  teams: BackendTeam[];
  postTime?: {
    startDateTime: string;
    endDateTime: string;
  };
}

// Helper function: Check if booking is currently available based on postTime
const checkAvailabilityFromData = (usheringData: BackendUsheringData): boolean => {
  if (usheringData?.postTime) {
    const postDate = new Date(usheringData.postTime.startDateTime);
    const deletionDate = new Date(usheringData.postTime.endDateTime);
    const now = new Date();
    const isAvailable = now >= postDate && now <= deletionDate;
    console.log("Post Start Date:", postDate);
    console.log("Post End Date:", deletionDate);
    console.log("Is Available:", isAvailable);
    return isAvailable;
  }
  return false;
};

// Helper function: Transform backend teams to UsheringTeam format
const transformTeams = (backendTeams: BackendTeam[]): UsheringTeam[] => {
  return backendTeams.map((team, index) => {
    const title = team.title || TEAM_NAMES[index] || `Team ${index + 1}`;
    return {
      _id: team._id || team.id,
      id: team.id,
      title,
      description: team.description,
      color: getTeamColor(title),
      icon: getTeamIcon(title),
    };
  });
};

// Helper function: Process slots for a specific team from already-fetched data
const processSlotsForTeam = (teamsData: BackendTeam[], teamId: string): InterviewSlot[] => {
  if (!teamId || !teamsData || !Array.isArray(teamsData)) return [];

  const selectedTeam = teamsData.find((team: BackendTeam) => (team._id || team.id) === teamId);
  if (!selectedTeam) return [];

  const slots: RawSlot[] = selectedTeam.slots || [];
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
};

// Helper function: Find which team a slot belongs to
const findTeamIdForSlot = (teamsData: BackendTeam[], slotId: string): string => {
  if (!teamsData || !Array.isArray(teamsData)) return '';

  for (const team of teamsData) {
    const slotExists = team.slots?.some((slot: RawSlot) =>
      (slot._id === slotId || slot.id === slotId)
    );
    if (slotExists) {
      return team._id || team.id;
    }
  }
  return '';
};

export default function InterviewBookingPage() {
  // Ushering data from unified API call
  const [usheringId, setUsheringId] = useState<string>('');
  const [backendTeams, setBackendTeams] = useState<BackendTeam[]>([]);

  const [teams, setTeams] = useState<UsheringTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
  const [teamsError, setTeamsError] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [slotsData, setSlotsData] = useState<InterviewSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [confirmedSlotId, setConfirmedSlotId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<InterviewSlot | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  // UNIFIED API CALL: Fetch all ushering data on mount
  useEffect(() => {
    const fetchUsheringData = async () => {
      setTeamsLoading(true);
      setTeamsError(null);
      setLoading(true);

      try {
        const response = await api.get('/ushering/');
        const data: BackendUsheringData[] = response.data?.data;
        console.log("Ushering API Response:", data);

        if (data && data.length > 0) {
          const usheringData = data[0];

          // Store ushering ID for later API calls (booking/cancellation)
          setUsheringId(usheringData.id);
          console.log("Ushering ID:", usheringData.id);

          // Store raw backend teams for later processing
          setBackendTeams(usheringData.teams || []);

          // Check availability using postTime from the response
          const isAvailable = checkAvailabilityFromData(usheringData);
          setShow(isAvailable);

          // Transform teams to UsheringTeam format
          const transformedTeams = transformTeams(usheringData.teams || []);
          setTeams(transformedTeams);

          // Set first team as selected
          if (transformedTeams.length > 0) {
            setSelectedTeamId(transformedTeams[0]._id);
          }
        } else {
          setTeamsError("No ushering data available.");
        }
      } catch (error) {
        console.error("Failed to fetch ushering data:", error);
        setTeamsError("Failed to load ushering data. Please try again.");
      } finally {
        setTeamsLoading(false);
        setLoading(false);
      }
    };

    fetchUsheringData();
  }, []);

  // Fetch student booking after usheringId is available
  useEffect(() => {
    if (!usheringId || backendTeams.length === 0) return;
    setLoading(true);

    const fetchStudentBooking = async () => {
      try {
        console.log("[DEBUG] Fetching student booking with usheringId:", usheringId);
        const response = await api.get(`/ushering/${usheringId}/studentSlots`);
        console.log("[DEBUG] /studentSlots response:", response.data);

        const slotData = response.data?.data?.slot;
        if (slotData) {
          // Find which team this slot belongs to using already-fetched data
          const foundTeamId = findTeamIdForSlot(backendTeams, slotData._id || slotData.id);
          console.log("[DEBUG] Found teamId:", foundTeamId);

          const mappedSlot: InterviewSlot = {
            id: slotData.id || slotData._id,
            teamId: foundTeamId,
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
          setSelectedTeamId(foundTeamId);

          console.log("[DEBUG] Mapped booked slot:", mappedSlot);
        } else {
          setConfirmedSlotId(null);
          setBookingDetails(null);
        }
      } catch (error: any) {
        console.error("[DEBUG] Failed to fetch student booking:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchStudentBooking();
  }, [usheringId, backendTeams]);

  // Process slots when selected team changes (using already-fetched data)
  useEffect(() => {
    if (!selectedTeamId || bookingDetails || backendTeams.length === 0) return;

    setSlotsLoading(true);
    setSlotsError(null);
    setSlotsData([]);
    setSelectedDate(undefined);
    setSelectedSlotId(null);

    try {
      const processedSlots = processSlotsForTeam(backendTeams, selectedTeamId);
      setSlotsData(processedSlots);
    } catch (error: any) {
      console.error("Failed to process slots:", error);
      setSlotsError(error.message || "Failed to load interview slots for this team.");
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedTeamId, bookingDetails, backendTeams]);

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
    if (!selectedSlotId || !selectedTeamId || !usheringId) return;

    const slotToBook = slotsData.find(s => s.id === selectedSlotId);
    if (!slotToBook || !slotToBook.isAvailable) {
      setSlotsError("Selected slot is already taken or invalid.");
      return;
    }

    try {
      await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${selectedSlotId}/book`);
      toast.success("Interview Slot Booked Successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });

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
      toast.error(
        error.response.data.error ||
          "Failed to book interview slot . Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  const handleReserve = () => {
    if (!selectedSlotId || confirmedSlotId) return;
    handleFinalizeBookingAutomatic();
  };

  const handleCancel = async (slotId: string) => {
    if (!usheringId) return;

    try {
      await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${slotId}/cancel`, {});
      toast.success("Your reservation was successfully cancelled", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
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
            toast.error(
        error.response.data.error ||
          "Failed to cancel reservation. Please try again.",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
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

  if (loading) {
        return <BookingSkeleton />;
    }

  if (teamsError) {
    return (
      <ContentWrapper title="Booking Error" description="Failed to load necessary data.">
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{teamsError}</Alert>
        </Box>
      </ContentWrapper>
    );
  }

  if (teamsError) {
    return (
      <ContentWrapper title="Booking Error" description="Failed to load necessary data.">
        <Box sx={{ p: 4 }}>
          <Alert severity="error">{teamsError}</Alert>
        </Box>
      </ContentWrapper>
    );
  }

  // ✅ Add early return if booking is not available
  if (!show) {
    return (
      <ContentWrapper title="Booking Unavailable" description="Interview slot booking is currently unavailable.">
        <Box sx={{ p: 4 }}>
          <Alert severity="info">Interview slot booking is not available at this time. Please check back later.</Alert>
        </Box>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper title="Book Your Interview Slot" description="You can reserve your interview slot here.">
      <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          {!bookingDetails && (
            <Paper sx={{ p: 3, mb: 3 }}>
              {teamsLoading ? (
                <CircularProgress size={24} />
              ) : (
                <TeamSelector
                  teams={teams}
                  selectedTeamId={selectedTeamId}
                  onTeamSelect={!isTeamSelectorDisabled ? handleTeamSelect : () => { }}
                />
              )}
            </Paper>
          )}

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
                        sx={{ py: "14px", fontWeight: 600, fontSize: "1.1rem", borderRadius: "8px", width: '100%', backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1d4ed8' } }}
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
