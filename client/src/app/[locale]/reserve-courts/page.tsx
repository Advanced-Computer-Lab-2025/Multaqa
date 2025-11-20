"use client";

import React from 'react';
import { ThemeProvider, CssBaseline, Typography, Stack } from '@mui/material';
import theme from '@/themes/lightTheme';
import CourtBoard from '@/components/CourtBooking/CourtBoard';
import { CourtSlot, CourtType } from '@/components/CourtBooking/types';

const courts: CourtType[] = [
  { id: 'basketball', name: 'Basketball', colorKey: 'primary' },
  { id: 'tennis', name: 'Tennis', colorKey: 'tertiary' },
  { id: 'football', name: 'Football', colorKey: 'secondary' },
];

// Generate demo slots over 7 days
const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const dayPlus = (n: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + n);
  return toISO(d);
};

const sampleSlots: CourtSlot[] = [
  // Basketball - multiple days
  { id: 'b1', courtTypeId: 'basketball', day: dayPlus(0), start: '08:00', end: '08:30', status: 'available' },
  { id: 'b2', courtTypeId: 'basketball', day: dayPlus(0), start: '08:30', end: '09:00', status: 'available' },
  { id: 'b3', courtTypeId: 'basketball', day: dayPlus(0), start: '09:00', end: '09:30', status: 'available' },
  { id: 'b4', courtTypeId: 'basketball', day: dayPlus(0), start: '09:30', end: '10:00', status: 'available' },
  { id: 'b5', courtTypeId: 'basketball', day: dayPlus(0), start: '10:00', end: '10:30', status: 'yours', reservedBy: 'You' },
  { id: 'b6', courtTypeId: 'basketball', day: dayPlus(0), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 'b7', courtTypeId: 'basketball', day: dayPlus(1), start: '08:00', end: '08:30', status: 'available' },
  { id: 'b8', courtTypeId: 'basketball', day: dayPlus(1), start: '08:30', end: '09:00', status: 'available' },
  { id: 'b9', courtTypeId: 'basketball', day: dayPlus(1), start: '09:00', end: '09:30', status: 'reserved', reservedBy: 'John' },
  { id: 'b10', courtTypeId: 'basketball', day: dayPlus(1), start: '09:30', end: '10:00', status: 'available' },
  { id: 'b11', courtTypeId: 'basketball', day: dayPlus(1), start: '10:00', end: '10:30', status: 'available' },
  { id: 'b12', courtTypeId: 'basketball', day: dayPlus(1), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 'b13', courtTypeId: 'basketball', day: dayPlus(2), start: '09:00', end: '09:30', status: 'available' },
  { id: 'b14', courtTypeId: 'basketball', day: dayPlus(2), start: '10:00', end: '10:30', status: 'available' },
  
  { id: 'b15', courtTypeId: 'basketball', day: dayPlus(3), start: '08:00', end: '08:30', status: 'available' },
  { id: 'b16', courtTypeId: 'basketball', day: dayPlus(3), start: '09:00', end: '09:30', status: 'available' },
  
  { id: 'b17', courtTypeId: 'basketball', day: dayPlus(5), start: '10:00', end: '10:30', status: 'available' },
  { id: 'b18', courtTypeId: 'basketball', day: dayPlus(6), start: '08:00', end: '08:30', status: 'available' },

  // Tennis - multiple days
  { id: 't1', courtTypeId: 'tennis', day: dayPlus(0), start: '08:00', end: '08:30', status: 'available' },
  { id: 't2', courtTypeId: 'tennis', day: dayPlus(0), start: '08:30', end: '09:00', status: 'available' },
  { id: 't3', courtTypeId: 'tennis', day: dayPlus(0), start: '09:00', end: '09:30', status: 'available' },
  { id: 't4', courtTypeId: 'tennis', day: dayPlus(0), start: '09:30', end: '10:00', status: 'available' },
  { id: 't5', courtTypeId: 'tennis', day: dayPlus(0), start: '10:00', end: '10:30', status: 'available' },
  { id: 't6', courtTypeId: 'tennis', day: dayPlus(0), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 't7', courtTypeId: 'tennis', day: dayPlus(1), start: '08:00', end: '08:30', status: 'available' },
  { id: 't8', courtTypeId: 'tennis', day: dayPlus(1), start: '08:30', end: '09:00', status: 'available' },
  { id: 't9', courtTypeId: 'tennis', day: dayPlus(1), start: '09:00', end: '09:30', status: 'available' },
  { id: 't10', courtTypeId: 'tennis', day: dayPlus(1), start: '09:30', end: '10:00', status: 'available' },
  { id: 't11', courtTypeId: 'tennis', day: dayPlus(1), start: '10:00', end: '10:30', status: 'reserved', reservedBy: 'Mary' },
  { id: 't12', courtTypeId: 'tennis', day: dayPlus(1), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 't13', courtTypeId: 'tennis', day: dayPlus(2), start: '09:00', end: '09:30', status: 'available' },
  { id: 't14', courtTypeId: 'tennis', day: dayPlus(4), start: '10:00', end: '10:30', status: 'available' },

  // Football - multiple days
  { id: 'f1', courtTypeId: 'football', day: dayPlus(0), start: '08:00', end: '08:30', status: 'available' },
  { id: 'f2', courtTypeId: 'football', day: dayPlus(0), start: '08:30', end: '09:00', status: 'available' },
  { id: 'f3', courtTypeId: 'football', day: dayPlus(0), start: '09:00', end: '09:30', status: 'available' },
  { id: 'f4', courtTypeId: 'football', day: dayPlus(0), start: '09:30', end: '10:00', status: 'available' },
  { id: 'f5', courtTypeId: 'football', day: dayPlus(0), start: '10:00', end: '10:30', status: 'available' },
  { id: 'f6', courtTypeId: 'football', day: dayPlus(0), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 'f7', courtTypeId: 'football', day: dayPlus(1), start: '08:00', end: '08:30', status: 'available' },
  { id: 'f8', courtTypeId: 'football', day: dayPlus(1), start: '08:30', end: '09:00', status: 'available' },
  { id: 'f9', courtTypeId: 'football', day: dayPlus(1), start: '09:00', end: '09:30', status: 'available' },
  { id: 'f10', courtTypeId: 'football', day: dayPlus(1), start: '09:30', end: '10:00', status: 'available' },
  { id: 'f11', courtTypeId: 'football', day: dayPlus(1), start: '10:00', end: '10:30', status: 'available' },
  { id: 'f12', courtTypeId: 'football', day: dayPlus(1), start: '10:30', end: '11:00', status: 'available' },
  
  { id: 'f13', courtTypeId: 'football', day: dayPlus(2), start: '09:00', end: '09:30', status: 'reserved', reservedBy: 'Ali' },
  { id: 'f14', courtTypeId: 'football', day: dayPlus(3), start: '10:00', end: '10:30', status: 'available' },
];

export default function ReserveCourtsPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack sx={{ px: { xs: 2, md: 6 }, pt: 4, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          Reserve Courts
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Pick a time slot from a court column. Slots are grouped by day. Click Reserve to book.
        </Typography>
      </Stack>
      <CourtBoard courts={courts} slots={sampleSlots} currentUser="You" />
    </ThemeProvider>
  );
}
