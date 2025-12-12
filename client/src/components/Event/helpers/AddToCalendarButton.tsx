"use client";
import React, { useState } from "react";
import { IconButton, Tooltip, CircularProgress, Typography } from "@mui/material";
import { CalendarPlus } from "lucide-react";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { toast } from "react-toastify";
import { CustomModal } from "@/components/shared/modals";

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
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  eventId,
  eventDetails,
  color = "#6366F1",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [pendingCalendarEvent, setPendingCalendarEvent] = useState<any>(null);
  const { isConnected, ensureCalendarConnected, addEventToCalendar } = useGoogleCalendar();

  // Format datetime to full ISO 8601 format
  const formatDateTime = (dateStr: string, timeStr?: string) => {
    if (!dateStr) {
      throw new Error("Missing date");
    }
    const dateTimeStr = timeStr ? `${dateStr}T${timeStr}` : dateStr;
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return date.toISOString();
  };

  const handleAddToCalendar = async (forceAdd: boolean = false) => {
    setIsLoading(true);
    try {
      // Validate required date fields
      if (!eventDetails.startDate || !eventDetails.startTime) {
        toast.error("Event is missing required date/time information", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
        setIsLoading(false);
        return;
      }

      // Ensure connected first
      if (!isConnected) {
        const connected = await ensureCalendarConnected();
        if (!connected) {
          setIsLoading(false);
          return;
        }
      }

      const calendarEvent = {
        eventId: eventId,
        title: eventDetails.name,
        description: eventDetails.description || "",
        startISO: formatDateTime(eventDetails.startDate, eventDetails.startTime),
        endISO: formatDateTime(
          eventDetails.endDate || eventDetails.startDate,
          eventDetails.endTime || eventDetails.startTime
        ),
        forceAdd: forceAdd,
      };

      const result = await addEventToCalendar(calendarEvent);
      
      // If event already exists and we're not forcing, show the confirmation modal
      if (result?.alreadyAdded && !forceAdd) {
        setPendingCalendarEvent(calendarEvent);
        setShowDuplicateModal(true);
      }
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

  const handleConfirmDuplicate = async () => {
    setShowDuplicateModal(false);
    if (pendingCalendarEvent) {
      await handleAddToCalendar(true);
    }
    setPendingCalendarEvent(null);
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
    setPendingCalendarEvent(null);
  };

  return (
    <>
      <Tooltip title="Add to Google Calendar" arrow>
        <IconButton
          onClick={() => handleAddToCalendar(false)}
          disabled={isLoading}
          size="medium"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            color: "text.primary",
            "&:hover": {
              backgroundColor: `${color}15`,
              borderColor: color,
              color: color,
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={18} sx={{ color: "text.primary" }} />
          ) : (
            <CalendarPlus size={18} />
          )}
        </IconButton>
      </Tooltip>

      <CustomModal
        open={showDuplicateModal}
        onClose={handleCloseDuplicateModal}
        title="Event Already in Calendar"
        modalType="info"
        buttonOption1={{
          label: "Add Anyway",
          variant: "contained",
          color: "primary",
          onClick: handleConfirmDuplicate,
        }}
        buttonOption2={{
          label: "Cancel",
          variant: "outlined",
          color: "primary",
          onClick: handleCloseDuplicateModal,
        }}
      >
        <Typography>
          This event is already in your Google Calendar. Would you like to add it again?
        </Typography>
      </CustomModal>
    </>
  );
};

export default AddToCalendarButton;
