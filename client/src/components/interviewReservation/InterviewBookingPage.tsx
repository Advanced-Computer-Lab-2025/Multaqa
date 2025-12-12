"use client";

import React, { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { usherTeams } from "./data/usherTeams";
import { interviewSlots } from "./data/interviewSlots";
import TeamSelector from "./TeamSelector";
import TimeSlotList from "./TimeSlotList";
import { Box, Typography, Paper, Button } from "@mui/material"; // Button is back
import ContentWrapper from "../shared/containers/ContentWrapper";
import { InterviewSlot } from "./types"; 

export default function InterviewBookingPage() {
  const [selectedTeamId, setSelectedTeamId] = useState(usherTeams[0].id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  const [slotsData, setSlotsData] = useState<InterviewSlot[]>(interviewSlots);

  const teamSlots = useMemo(() => {
    setSelectedSlotId(null);
    return slotsData.filter((slot) => slot.teamId === selectedTeamId);
  }, [selectedTeamId, slotsData]);

  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    teamSlots.forEach((slot) => dates.add(slot.date));

    return Array.from(dates).map((d) => {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day);
    });
  }, [teamSlots]);

  const dateStr = selectedDate?.toLocaleDateString("en-CA") || '';

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    return teamSlots.filter((slot) => slot.date === dateStr);
  }, [selectedDate, teamSlots, dateStr]);

const handleReserve = () => {
    if (!selectedSlotId) return;

    setSlotsData((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === selectedSlotId
          // FIX 1: Apply state update logic AND TypeScript cast
          ? { ...slot, isBooked: true, reservedBy: 'currentUser' } as unknown as InterviewSlot
          : slot
      )
    );
    setSelectedSlotId(null);
  };

  const handleCancel = () => {
    if (!selectedSlotId) return;
    
    // FIX 2: Restore full state update logic for cancellation
    setSlotsData((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === selectedSlotId
          // FIX 3: Set isBooked to false, reservedBy to '' (or null/undefined depending on your type) and apply TypeScript cast
          ? { ...slot, isBooked: false, reservedBy: '' } as unknown as InterviewSlot
          : slot
      )
    );
    setSelectedSlotId(null);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };
  
  const selectedSlot = slotsData.find(s => s.id === selectedSlotId);
  const isReservedByCurrentUser = selectedSlot?.isBooked && selectedSlot?.reservedBy === 'currentUser';

  const isBookedByOther = selectedSlot?.isBooked && selectedSlot?.reservedBy !== 'currentUser';

  return (
    <ContentWrapper title={"Book Your Interview Slot"} description="You can reserve your interview slot here.">
      <Box sx={{ minHeight: "100vh", py: 4, px: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Box sx={{ display: "flex", gap: 0 }}>
            
            {/* Calendar and Team Selector Panel (left) */}
            <Paper sx={{ flex: 1, p: 4 }}>
              <Box sx={{ mb: 4 }}>
                    <TeamSelector
                        teams={usherTeams}
                        selectedTeamId={selectedTeamId}
                        onChange={setSelectedTeamId}
                    />
                </Box>
              
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={{ available: availableDates }}
                modifiersClassNames={{
                  available: "bg-blue-100 text-blue-700 font-semibold rounded-full"
                }}
              />
            </Paper>

            {/* Time Slots Panel (right) */}
            <Paper sx={{ flex: 1, p: 4, display: 'flex', flexDirection: 'column' }}>
              
              {/* Date Header */}
              <Typography 
                variant="subtitle1" 
                sx={{ mb: 2, fontWeight: 500, color: 'text.primary', fontSize: { xs: '1rem', md: '1.05rem' } }}
              >
                {selectedDate
                  ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  : "Select a date"}
              </Typography>

              {/* Time Slots List */}
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

              {/* UPDATED: ACTION BUTTON (MUI Button, full-width, centered) */}
              {selectedDate && slotsForDate.length > 0 && (
                <Box sx={{ 
                    mx: 'auto' // Center the box
                }}>
                <Button
                    variant="contained" 
                    color={isReservedByCurrentUser ? 'error' : 'primary'} // Red for Cancel, Blue for Reserve
                    fullWidth // Use fullWidth instead of w-fit
                    onClick={isReservedByCurrentUser ? handleCancel : handleReserve}
                    disabled={!selectedSlotId || isBookedByOther}
                    sx={{ 
                        py: '14px', // Fine-tune padding to closely match the 3.5 Tailwind slot padding
                        fontWeight: 600, // Make the text bold
                        fontSize: '1.1rem',
                        width: '100%', // Full width of the container box
                        borderRadius: '8px', // Rounded corners
                        // --- START: ONLY BUTTON STYLING UPDATES ---
                        ...(isReservedByCurrentUser ? {} : { 
                           backgroundColor: '#2563EB', 
                           color: 'white',
                           '&:hover': {
                               backgroundColor: '#1D4ED8',
                           },
                        })
                    }}
                  >
                    {isReservedByCurrentUser ? 'Cancel Slot' : 'Reserve Slot'}
                  </Button>
                </Box>
              )}

            </Paper>
          </Box>
        </Box>
      </Box>
    </ContentWrapper>
  );
}