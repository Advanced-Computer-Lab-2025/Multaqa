"use client";

import React, { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { usherTeams } from "./data/usherTeams";
import { interviewSlots } from "./data/interviewSlots";

import TeamSelector from "./TeamSelector";
import TimeSlotList from "./TimeSlotList";
import BookingDetailsView from "./BookingDetailsView";
import DetailEntryForm from "./DetailEntryForm";

import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import ContentWrapper from "../shared/containers/ContentWrapper";

import { InterviewSlot } from "./types";

const CUSTOM_BLUE = "#2563EB";

export default function InterviewBookingPage() {
  const [selectedTeamId, setSelectedTeamId] = useState(usherTeams[0].id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const [isDetailEntryActive, setIsDetailEntryActive] = useState(false);
  const [slotsData, setSlotsData] = useState<InterviewSlot[]>(interviewSlots);

  const [confirmedSlotId, setConfirmedSlotId] = useState<string | null>(null);

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
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [teamSlots]);

  const dateStr = selectedDate?.toLocaleDateString("en-CA") || "";

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

  const selectedSlot = slotsData.find((s) => s.id === selectedSlotId);
  const isBookedByOther =
    selectedSlot?.isBooked && selectedSlot?.reservedBy !== "currentUser";

  // ------------------------------------------------------------
  // LEFT PANEL LOCKING RULE
  // ------------------------------------------------------------
  const isLeftPanelDisabled = hasCurrentBooking || isDetailEntryActive;

  // ------------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------------
  return (
    <ContentWrapper
      title="Book Your Interview Slot"
      description="You can reserve your interview slot here."
    >
      <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          {/* Ensure left & right panels have SAME HEIGHT */}
          <Box sx={{ display: "flex", gap: 0, alignItems: "stretch" }}>
            {/* ---------------------------------------------------------------- */}
            {/* LEFT PANEL                                                      */}
            {/* ---------------------------------------------------------------- */}
            <Paper
              sx={{
                flex: 1,
                p: 4,
                position: "relative",
              }}
            >
              {/* OVERLAY to lock panel */}
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

              {/* TEAM SELECTOR */}
              <Box sx={{ mb: 4 }}>
                <TeamSelector
                  teams={usherTeams}
                  selectedTeamId={selectedTeamId}
                  onChange={!isLeftPanelDisabled ? setSelectedTeamId : () => {}}
                />
              </Box>

              <Divider sx={{ mb: 4 }} />

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
            {/* RIGHT PANEL                                                      */}
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
                {/* ------------------------------------------------------------ */}
                {/* STATE 1: USER ALREADY HAS A BOOKING                         */}
                {/* ONLY SHOW BOOKING DETAILS                                   */}
                {/* ------------------------------------------------------------ */}
                {hasCurrentBooking && currentBooking ? (
                  <BookingDetailsView
                    booking={currentBooking}
                    onCancel={() => handleCancel(currentBooking.id)}
                  />
                ) : isDetailEntryActive ? (
                  /* ------------------------------------------------------------ */
                  /* STATE 2: ENTERING DETAILS                                   */
                  /* ------------------------------------------------------------ */
                  <DetailEntryForm
                    slotId={selectedSlotId}
                    onFinalizeBooking={handleFinalizeBooking}
                    onBack={() => {
                      setIsDetailEntryActive(false);
                      setSelectedSlotId(null);
                    }}
                  />
                ) : (
                  /* ------------------------------------------------------------ */
                  /* STATE 3: PICKING A SLOT (only visible if no booking exists) */
                  /* ------------------------------------------------------------ */
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
                          slots={teamSlots}
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
