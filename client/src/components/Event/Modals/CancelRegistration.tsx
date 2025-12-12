import { CustomModal } from '@/components/shared/modals'
import { Box, Typography } from '@mui/material'
import theme from "@/themes/lightTheme";
import { api } from "../../../api";
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface CancelEventRegisterationProps {
  eventId: string;
  open: boolean;
  onClose: () => void;
  isRefundable?: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const CancelRegistration = ({ eventId, open, onClose, isRefundable = true, setRefresh }: CancelEventRegisterationProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { removeEventFromCalendar } = useGoogleCalendar();

  const handleCallApi = async (eventId: string) => {
    setLoading(true);
    setError(null);
    setResponse([]);
    try {
      // TODO: Replace with your API route
      const res = await api.post("/payments/" + eventId + "/refund");
      setResponse(res.data);
      setRefresh((prev) => !prev);

      // Remove event from calendar tracking
      await removeEventFromCalendar(eventId);

      // Show success toast
      toast.success('Registration cancelled successfully! Refund has been issued to your wallet.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err: any) {
      setError(err?.message || "API call failed");
      const errorMessage = err?.response?.data?.error || err?.response?.data?.message || "Failed to cancel registration. Please try again.";

      // Show error toast
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


  const handleCancelRegistration = async () => {
    // Logic to cancel registration
    await handleCallApi(eventId);
    onClose();
  }

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Cancel Registration"
      modalType='error'
      borderColor={theme.palette.error.main}
      buttonOption1={isRefundable ? {
        label: "Yes",
        variant: "contained",
        color: "error",
        onClick: handleCancelRegistration,
      } : {
        label: "Close",
        variant: "contained",
        color: "error",
        onClick: onClose,
      }}
      buttonOption2={isRefundable ? {
        label: "No",
        variant: "outlined",
        color: "error",
        onClick: onClose,
      } : undefined}
    >
      {isRefundable ?
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            Are you sure you want to cancel your registration for this event?
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "gray",
              mb: 1,
              fontSize: "0.95rem",
            }}
          >
            You will need to register again if you change your mind.
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: "gray",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Amount paid will be refunded to your wallet
          </Typography>
        </Box>
        :
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), system-ui, sans-serif",
              color: theme.palette.error.main,
              mb: 2,
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            You cannot cancel your registration for this event as the start date is less than 14 days away.
          </Typography>
        </Box>
      }
    </CustomModal>
  )
}

export default CancelRegistration
