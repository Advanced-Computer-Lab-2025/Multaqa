"use client";
import React, { useState } from "react";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import { CalendarPlus } from "lucide-react";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { toast } from "react-toastify";

interface AddToCalendarButtonProps {
  eventId: string;
  eventDetails: {
    name: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    description?: string;
    location?: string;
  };
  color?: string;
  size?: "small" | "medium";
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  eventId,
  eventDetails,
  color = "#6366F1",
  size = "small",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, ensureCalendarConnected, addEventToCalendar } = useGoogleCalendar();

  const handleAddToCalendar = async () => {
    setIsLoading(true);
    try {
      // Ensure connected first
      if (!isConnected) {
        const connected = await ensureCalendarConnected();
        if (!connected) {
          setIsLoading(false);
          return;
        }
      }

      // Format datetime to full ISO 8601 format
      const formatDateTime = (dateStr: string, timeStr?: string) => {
        const dateTimeStr = timeStr ? `${dateStr}T${timeStr}` : dateStr;
        return new Date(dateTimeStr).toISOString();
      };

      const calendarEvent = {
        eventId: eventId,
        title: eventDetails.name,
        description: eventDetails.description || "",
        startISO: formatDateTime(eventDetails.startDate, eventDetails.startTime),
        endISO: formatDateTime(
          eventDetails.endDate || eventDetails.startDate,
          eventDetails.endTime || eventDetails.startTime
        ),
      };

      await addEventToCalendar(calendarEvent);
    } catch (error) {
      console.error("Failed to add event to calendar:", error);
      toast.error("Failed to add event to calendar", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip title="Add to Google Calendar" arrow>
      <IconButton
        onClick={handleAddToCalendar}
        disabled={isLoading}
        size={size}
        sx={{
          color: color,
          backgroundColor: `${color}15`,
          border: `1px solid ${color}30`,
          "&:hover": {
            backgroundColor: `${color}25`,
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease",
        }}
      >
        {isLoading ? (
          <CircularProgress size={size === "small" ? 16 : 20} sx={{ color }} />
        ) : (
          <CalendarPlus size={size === "small" ? 16 : 20} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default AddToCalendarButton;
