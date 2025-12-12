"use client";

import { CustomModal } from "@/components/shared/modals";
import { Box, Typography } from "@mui/material";
import theme from "@/themes/lightTheme";
import { api } from "@/api";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface JoinWaitlistModalProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
}

const JoinWaitlistModal = ({
  eventId,
  eventName,
  open,
  onClose,
  setRefresh,
  color = theme.palette.primary.main,
}: JoinWaitlistModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleCallApi = async (eventId: string) => {
    setLoading(true);
    try {
      await api.post("/waitlist/" + eventId);
      setRefresh((prev) => !prev);

      toast.success(
        "Successfully joined the waitlist! You will be notified when a spot becomes available.",
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to join waitlist. Please try again.";

      toast.error(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWaitlist = async () => {
    await handleCallApi(eventId);
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Join Waitlist"
      modalType="info"
      borderColor={color}
      buttonOption1={{
        label: loading ? "Joining..." : "Join",
        variant: "contained",
        color: "primary",
        onClick: loading ? undefined : handleJoinWaitlist,
      }}
      buttonOption2={{
        label: "Cancel",
        variant: "outlined",
        color: "primary",
        onClick: onClose,
      }}
    >
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: "text.primary",
            mb: 2,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          {eventName}
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: color,
            mb: 2,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          This event is currently full.
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: "gray",
            mb: 1,
            fontSize: "0.95rem",
          }}
        >
          Would you like to join the waitlist? You will be automatically
          notified when a spot becomes available.
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: "gray",
            fontSize: "0.85rem",
            fontStyle: "italic",
          }}
        >
          You will have 3 days to complete payment once a spot opens.
        </Typography>
      </Box>
    </CustomModal>
  );
};

export default JoinWaitlistModal;
