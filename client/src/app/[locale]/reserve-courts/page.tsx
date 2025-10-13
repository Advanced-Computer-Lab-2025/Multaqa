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

// Generate simple demo slots over 3 days
const today = new Date();
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const dayPlus = (n: number) => {
  const d = new Date(today);
  d.setDate(today.getDate() + n);
  return toISO(d);
};

const sampleSlots: CourtSlot[] = [
  // Basketball
  { id: 'b1', courtTypeId: 'basketball', day: dayPlus(0), start: '09:00', end: '10:00', status: 'available' },
  { id: 'b2', courtTypeId: 'basketball', day: dayPlus(0), start: '10:00', end: '11:00', status: 'reserved', reservedBy: 'John' },
  { id: 'b3', courtTypeId: 'basketball', day: dayPlus(1), start: '12:00', end: '13:00', status: 'available' },
  { id: 'b4', courtTypeId: 'basketball', day: dayPlus(2), start: '15:00', end: '16:00', status: 'available' },

  // Tennis
  { id: 't1', courtTypeId: 'tennis', day: dayPlus(0), start: '08:30', end: '09:30', status: 'available' },
  { id: 't2', courtTypeId: 'tennis', day: dayPlus(1), start: '10:30', end: '11:30', status: 'reserved', reservedBy: 'Mary' },
  { id: 't3', courtTypeId: 'tennis', day: dayPlus(1), start: '11:30', end: '12:30', status: 'available' },

  // Football
  { id: 'f1', courtTypeId: 'football', day: dayPlus(0), start: '17:00', end: '18:30', status: 'available' },
  { id: 'f2', courtTypeId: 'football', day: dayPlus(2), start: '19:00', end: '20:30', status: 'reserved', reservedBy: 'Ali' },
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
