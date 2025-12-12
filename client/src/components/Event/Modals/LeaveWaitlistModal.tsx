"use client";

import { CustomModal } from '@/components/shared/modals';
import { Box, Typography } from '@mui/material';
import theme from "@/themes/lightTheme";
import { api } from "@/api";
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface LeaveWaitlistModalProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeaveWaitlistModal = ({ 
  eventId, 
  eventName, 
  open, 
  onClose, 
  setRefresh
}: LeaveWaitlistModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleCallApi = async (eventId: string) => {
    setLoading(true);
    try {
      await api.delete("/waitlist/" + eventId);
      setRefresh((prev) => !prev);

      toast.success('Successfully left the waitlist.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || "Failed to leave waitlist. Please try again.";

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

  const handleLeaveWaitlist = async () => {
    await handleCallApi(eventId);
    onClose();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Leave Waitlist"
      modalType='warning'
      borderColor={theme.palette.warning.main}
      buttonOption1={{
        label: loading ? "Leaving..." : "Leave",
        variant: "contained",
        color: "warning",
        onClick: loading ? undefined : handleLeaveWaitlist,
      }}
      buttonOption2={{
        label: "Stay",
        variant: "outlined",
        color: "warning",
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
            color: theme.palette.warning.main,
            mb: 2,
            fontSize: "1rem",
            fontWeight: 500,
          }}
        >
          Are you sure you want to leave the waitlist?
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: "gray",
            fontSize: "0.9rem",
          }}
        >
          You will lose your position and will need to rejoin if you change your mind.
        </Typography>
      </Box>
    </CustomModal>
  );
};

export default LeaveWaitlistModal;
