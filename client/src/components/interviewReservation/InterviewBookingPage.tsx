"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Assuming these imports are correct based on your file structure
import { interviewSlots } from "./data/interviewSlots"; 
import { UsheringTeam } from '../shared/UsheringTeamApplications/types';
import { fetchTeams } from '../shared/UsheringTeamApplications/utils';
import TeamSelector from "../shared/UsheringTeamApplications/TeamSelector"; 
import TimeSlotList from "./TimeSlotList";
import BookingDetailsView from "./BookingDetailsView";
import DetailEntryForm from "./DetailEntryForm";
import { InterviewSlot } from "./types";

import { Box, Typography, Paper, Button,Alert, CircularProgress } from "@mui/material";
import ContentWrapper from "../shared/containers/ContentWrapper";

const CUSTOM_BLUE = "#2563EB";

export default function InterviewBookingPage() {
    // ------------------------------------------------------------
    // NEW/UPDATED STATE FOR TEAM DATA
    // ------------------------------------------------------------
    const [teams, setTeams] = useState<UsheringTeam[]>([]);
    const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
    const [teamsError, setTeamsError] = useState<string | null>(null);

    const [selectedTeamId, setSelectedTeamId] = useState<string>(''); // Initialized to empty string
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const [isDetailEntryActive, setIsDetailEntryActive] = useState(false);
    const [slotsData, setSlotsData] = useState<InterviewSlot[]>(interviewSlots);

    const [confirmedSlotId, setConfirmedSlotId] = useState<string | null>(null);

    // ------------------------------------------------------------
    // FETCH TEAMS ON MOUNT
    // ------------------------------------------------------------
    useEffect(() => {
        const loadTeams = async () => {
            setTeamsLoading(true);
            setTeamsError(null);
            try {
                // Assuming the imported fetchTeams is structured like: fetchTeams(setLoading)
                const fetchedTeams = await fetchTeams(() => {}); 

                setTeams(fetchedTeams);
                // Set the default selected team ID to the first fetched team
                if (fetchedTeams.length > 0) {
                    setSelectedTeamId(fetchedTeams[0]._id); // Assuming team objects have a _id or id property
                }
            } catch (error) {
                console.error("Failed to fetch teams:", error);
                setTeamsError("Failed to load ushering teams. Please try again.");
            } finally {
                setTeamsLoading(false);
            }
        };

        loadTeams();
    }, []);
    
    // ------------------------------------------------------------
    // CURRENT BOOKING LOGIC
    // ------------------------------------------------------------
    const currentBooking = slotsData.find(
        (s) => s.id === confirmedSlotId && s.reservedBy === "currentUser"
    );

    const hasCurrentBooking = !!currentBooking;

    // ------------------------------------------------------------
    // TEAM SLOTS + DATE LIST LOGIC
    // ------------------------------------------------------------
    const teamSlots = useMemo(() => {
        if (!hasCurrentBooking && !isDetailEntryActive) {
            setSelectedSlotId(null);
        }
        return slotsData.filter((slot) => slot.teamId === selectedTeamId);
    }, [selectedTeamId, slotsData, hasCurrentBooking, isDetailEntryActive]);

    const availableDates = useMemo(() => {
        const dates = new Set<string>();
        teamSlots.forEach((slot) => dates.add(slot.date));

        return Array.from(dates).map((d) => {
            const dateParts = d.split("-").map(Number);
            return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
        });
    }, [teamSlots]);

    const dateStr = selectedDate
        ? selectedDate.toLocaleDateString("en-CA", { timeZone: 'UTC' })
        : "";

    const slotsForDate = useMemo(() => {
        if (!selectedDate) return [];
        return teamSlots.filter((slot) => slot.date === dateStr);
    }, [selectedDate, teamSlots, dateStr]);

    // ------------------------------------------------------------
    // HANDLERS
    // ------------------------------------------------------------
    const handleReserve = () => {
        if (!selectedSlotId || hasCurrentBooking) return;
        setIsDetailEntryActive(true);
    };

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlotId(slotId);
    };

    const handleFinalizeBooking = (studentDetails: {
        email: string;
        id: string;
        firstName: string;
        lastName: string;
    }) => {
        if (!selectedSlotId) return;

        setSlotsData((prev) =>
            prev.map((slot) =>
                slot.id === selectedSlotId
                    ? {
                          ...slot,
                          isBooked: true,
                          reservedBy: "currentUser",
                          studentEmail: studentDetails.email,
                          studentId: studentDetails.id,
                      }
                    : slot
            )
        );

        setConfirmedSlotId(selectedSlotId);
        setSelectedSlotId(null);
        setIsDetailEntryActive(false);
    };

    const handleCancel = (slotId: string) => {
        setSlotsData((prev) =>
            prev.map((slot) =>
                slot.id === slotId
                    ? {
                          ...slot,
                          isBooked: false,
                          reservedBy: null,
                          studentEmail: null,
                          studentId: null,
                      }
                    : slot
            )
        );

        // Reset state after cancel
        setConfirmedSlotId(null);
        setSelectedSlotId(null);
    };

    const handleTeamSelect = useCallback((teamId: string) => {
        setSelectedTeamId(teamId);
        // Reset date/slot when team changes to prevent confusion
        setSelectedDate(undefined);
        setSelectedSlotId(null);
    }, []);


    const selectedSlot = slotsData.find((s) => s.id === selectedSlotId);
    const isBookedByOther =
        selectedSlot?.isBooked && selectedSlot?.reservedBy !== "currentUser";

    // ------------------------------------------------------------
    // LEFT PANEL LOCKING RULE
    // ------------------------------------------------------------
    // The TeamSelector is no longer in the left panel, but the left panel still controls date selection.
    const isLeftPanelDisabled = hasCurrentBooking || isDetailEntryActive;
    
    // The TeamSelector should also be disabled if a booking is active (to prevent changing teams mid-process)
    const isTeamSelectorDisabled = hasCurrentBooking || isDetailEntryActive;

    // ------------------------------------------------------------
    // UI RENDER
    // ------------------------------------------------------------

    // Render error state globally if teams failed to load
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
        <ContentWrapper
            title="Book Your Interview Slot"
            description="You can reserve your interview slot here."
        >
            <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
                <Box sx={{ maxWidth: 1000, mx: "auto" }}>
                    
                    {/* ---------------------------------------------------------------- */}
                    {/* TOP BAR: TEAM SELECTOR (MOVED HERE)                               */}
                    {/* ---------------------------------------------------------------- */}
                    <Paper sx={{mb: 3 }}>
                        {teamsLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <TeamSelector
                                teams={teams}
                                selectedTeamId={selectedTeamId}
                                onTeamSelect={
                                    !isTeamSelectorDisabled ? handleTeamSelect : () => {}
                                }
                            />
                        )}
                    </Paper>
                    {/* Left & Right Panels Container */}
                    <Box sx={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                        {/* ---------------------------------------------------------------- */}
                        {/* LEFT PANEL (DATE PICKER)                                            */}
                        {/* ---------------------------------------------------------------- */}
                        <Paper
                            sx={{
                                flex: 1,
                                p: 4,
                                position: "relative",
                            }}
                        >
                            {/* OVERLAY to lock panel (for date selection) */}
                            {isLeftPanelDisabled && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        zIndex: 10,
                                        backgroundColor: "rgba(255,255,255,0.7)",
                                        backdropFilter: "blur(1px)",
                                        cursor: "not-allowed",
                                    }}
                                />
                            )}

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Select a Date
                            </Typography>
                            
                            {/* DATE PICKER */}
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={
                                    !isLeftPanelDisabled ? setSelectedDate : undefined
                                }
                                modifiers={{ available: availableDates }}
                                modifiersClassNames={{
                                    available:
                                        "bg-blue-100 text-blue-700 font-semibold rounded-full",
                                }}
                            />
                        </Paper>

                        {/* ---------------------------------------------------------------- */}
                        {/* RIGHT PANEL (SLOTS/BOOKING DETAILS)                                              */}
                        {/* ---------------------------------------------------------------- */}
                        <Paper
                            sx={{
                                flex: 1,
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                minHeight: "100%",
                            }}
                        >
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* STATE 1: USER ALREADY HAS A BOOKING */}
                                {hasCurrentBooking && currentBooking ? (
                                    <BookingDetailsView
                                        booking={currentBooking}
                                        onCancel={() => handleCancel(currentBooking.id)}
                                    />
                                ) : isDetailEntryActive ? (
                                    /* STATE 2: ENTERING DETAILS */
                                    <DetailEntryForm
                                        slotId={selectedSlotId}
                                        onFinalizeBooking={handleFinalizeBooking}
                                        onBack={() => {
                                            setIsDetailEntryActive(false);
                                            setSelectedSlotId(null);
                                        }}
                                    />
                                ) : (
                                    /* STATE 3: PICKING A SLOT */
                                    <>
                                        {/* DATE HEADER */}
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 500,
                                                color: "text.primary",
                                            }}
                                        >
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString("en-US", {
                                                      weekday: "long",
                                                      month: "long",
                                                      day: "numeric",
                                                  })
                                                : "Select a date"}
                                        </Typography>

                                        {/* TIME SLOTS */}
                                        <Box sx={{ flexGrow: 1, mb: 4 }}>
                                            {selectedDate ? (
                                                <TimeSlotList
                                                    date={dateStr}
                                                    slots={slotsForDate}
                                                    selectedSlotId={selectedSlotId}
                                                    onSelectSlot={handleSlotSelect}
                                                />
                                            ) : (
                                                <Typography color="text.secondary">
                                                    Select a date to view available time slots
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* RESERVE BUTTON */}
                                        {selectedDate && slotsForDate.length > 0 && (
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={handleReserve}
                                                disabled={!selectedSlotId || isBookedByOther}
                                                sx={{
                                                    py: "14px",
                                                    fontWeight: 600,
                                                    fontSize: "1.1rem",
                                                    width: "100%",
                                                    borderRadius: "8px",
                                                    backgroundColor: CUSTOM_BLUE,
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#1D4ED8" },
                                                }}
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