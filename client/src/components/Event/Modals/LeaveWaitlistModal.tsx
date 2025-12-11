"use client";

import { CustomModal } from '@/components/shared/modals';
import { Box, Typography } from '@mui/material';
import theme from "@/themes/lightTheme";
import { leaveWaitlist } from "@/services/waitlistService";
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface LeaveWaitlistModalProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onClose: () => void;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
  queuePosition?: number;
}

const LeaveWaitlistModal = ({ 
  eventId, 
  eventName, 
  open, 
  onClose, 
  setRefresh, 
  color = theme.palette.warning.main,
  queuePosition
}: LeaveWaitlistModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleLeaveWaitlist = async () => {
    setLoading(true);
    try {
      await leaveWaitlist(eventId);
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
      onClose();
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

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Leave Waitlist"
      modalType='warning'
      borderColor={theme.palette.warning.main}
      buttonOption1={{
        label: loading ? "Leaving..." : "Leave Waitlist",
        variant: "contained",
        color: "warning",
        onClick: loading ? undefined : handleLeaveWaitlist,
      }}
      buttonOption2={{
        label: "Stay on Waitlist",
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
        {queuePosition && (
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: color,
              mb: 2,
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            You are currently #{queuePosition} in line.
          </Typography>
        )}
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
