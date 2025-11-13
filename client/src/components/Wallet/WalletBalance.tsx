import { Box, Typography } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User } from 'lucide-react';
import React from 'react'

interface WalletBalanceProps {
    currentBalance?: number;
    userInfo: any;
}

const WalletBalance = ({userInfo, currentBalance=0}:WalletBalanceProps) => {
  const gradient = `linear-gradient(135deg, ${theme.palette.tertiary?.main ?? theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <Box
      sx={{
        background: gradient, // slightly lighter grey
        borderRadius: 3,            // rounder corners
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(30, 30, 37, 0.1)', // subtle 3D shadow
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 12px 30px rgba(14, 30, 37, 0.12)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* Header: icon + name on same line with full-width bottom border */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          width: '100%',
          borderBottom: `2px solid #E6E6E6`, // full width border under header
        }}
      >
        <User size={40} color={theme.palette.tertiary.contrastText} />
        <Typography variant="h6" fontWeight="bold">
          {userInfo?.firstName ?? "User"}'s Account
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h6" color={theme.palette.tertiary.contrastText} mb={1}>
          Current Balance
        </Typography>
        <Typography variant="h5" color={theme.palette.tertiary.contrastText}>
          ${currentBalance.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  )
}

export default WalletBalance
