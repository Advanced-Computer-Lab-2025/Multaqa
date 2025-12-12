import React from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { InterviewSlot } from "./types";

interface BookingDetailsViewProps {
  booking: InterviewSlot;
  onCancel: () => void;
}

const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({ booking, onCancel }) => {
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
      <Typography variant="h6" sx={{ mb: 3, color: "#2563eb", fontWeight: 600 }}>
        Interview Slot Details
      </Typography>

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
          Location:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#1e293b" }}>
          {booking.location || "TBD"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ color: "red", fontWeight: 500 }}>
          *You must cancel this slot before reserving another.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={onCancel}
        sx={{ py: 1.5, fontWeight: 600, fontSize: "1rem", borderRadius: 2,  width:"100%" }}
      >
        CANCEL SLOT
      </Button>
    </Paper>
  );
};

export default BookingDetailsView;
