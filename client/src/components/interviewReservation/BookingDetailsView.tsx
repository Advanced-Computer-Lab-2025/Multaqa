import React from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { InterviewSlot } from "./types";
import AddToCalendarButton from "../Event/helpers/AddToCalendarButton";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

interface BookingDetailsViewProps {
  booking: InterviewSlot;
  teamTitle?: string;
  onCancel: () => void;
}

const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({
  booking,
  teamTitle = "Team Interview",
  onCancel
}) => {
  const { removeEventFromCalendar } = useGoogleCalendar();

  const start = new Date(booking.startDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const end = new Date(booking.endDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = new Date(booking.startDateTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Format dates for AddToCalendarButton
  const startDate = booking.startDateTime.split('T')[0];
  const endDate = booking.endDateTime.split('T')[0];
  const startTime = new Date(booking.startDateTime).toTimeString().slice(0, 5);
  const endTime = new Date(booking.endDateTime).toTimeString().slice(0, 5);

  const handleCancel = async () => {
    // Remove from calendar before cancelling (silent fail if not in calendar)
    await removeEventFromCalendar(booking.id);
    onCancel();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: "center",
        backgroundColor: "#f9fafb",
        border: "1px solid #cbd5e1",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ color: "#2563eb", fontWeight: 600 }}>
          Interview Slot Details
        </Typography>
        <AddToCalendarButton
          eventId={booking.id}
          eventDetails={{
            name: `GUC Interview - ${teamTitle}`,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            description: `Interview slot for ${teamTitle}. Location: ${booking.location || 'TBD'}`,
            location: booking.location,
          }}
          color="#2563eb"
        />
      </Box>

      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Date:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#1e293b" }}>
          {dateStr}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" color="textSecondary">
          Time:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#1e293b" }}>
          {start} - {end}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle2" color="textSecondary">
          Your Details:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#1e293b" }}>
          {booking.studentEmail || "N/A"}
        </Typography>

        <Typography variant="caption" sx={{ color: "red", fontWeight: 500 }}>
          *You must cancel this slot before reserving another.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleCancel}
        sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem", borderRadius: 2, width: "100%" }}
      >
        CANCEL SLOT
      </Button>
    </Paper>
  );
};

export default BookingDetailsView;
