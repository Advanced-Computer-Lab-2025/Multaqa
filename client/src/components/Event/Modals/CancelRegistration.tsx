import { CustomModal, CustomModalLayout } from '@/components/shared/modals'
import { Box, Typography } from '@mui/material'
import theme from "@/themes/lightTheme";
import React from 'react'
import { on } from 'events';

interface CancelEventRegisterationProps {
    eventId: string;
    open: boolean;
    onClose: () => void;
    isRefundable?: boolean;
}

const CancelRegistration = ({eventId, open, onClose, isRefundable=true}: CancelEventRegisterationProps) => {
  return (
    <CustomModal
      open={open} 
      onClose={onClose} 
      title="Cancel Registration"
      modalType='warning'
      borderColor={theme.palette.warning.main}
      buttonOption2={isRefundable ?{
        label: "Yes",
        variant: "contained",
        color: "warning",
        onClick:onClose,
      }: undefined}
      buttonOption1={isRefundable? {
        label: "No",
        variant: "outlined",
        color: "warning",
        onClick:onClose,
      }: 
      {
        label: "Close",
        variant: "contained",
        color: "warning",
        onClick:onClose,
      }
    }  
    >
      {isRefundable ? 
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
          Are you sure you want to cancel your registration for this event?
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: theme.palette.warning.main,
            mb: 1,
            fontSize: "0.95rem",
          }}
        >
          You will need to register again if you change your mind.
        </Typography>
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), system-ui, sans-serif",
            color: theme.palette.warning.main,
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
            color:theme.palette.error.main,
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
