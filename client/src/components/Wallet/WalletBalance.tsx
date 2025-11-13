import { Box, Typography } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User } from 'lucide-react';
import React from 'react'

interface WalletBalanceProps {
    currentBalance?: number;
    userInfo: any;
}

const WalletBalance = ({userInfo, currentBalance=0}:WalletBalanceProps) => {
  // Move gradient definition INSIDE the component
  const gradient = `linear-gradient(135deg, #3a4f99 0%, #598bbd 100%)`;

  return (
    <Box
      sx={{
        background: gradient, // use background instead of backgroundColor
        borderRadius: 3,
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(30, 30, 37, 0.1)',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 12px 30px rgba(14, 30, 37, 0.12)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          width: '100%',
          borderBottom: `2px solid rgba(255, 255, 255, 0.3)`,
        }}
      >
        <User size={40} color="#fff" />
        <Typography variant="h6" fontWeight="bold" color="#fff">
          {userInfo?.firstName ?? "User"}'s Account
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, width: '100%' }}>
        <Typography variant="h6" color="#fff" mb={1}>
          Current Balance
        </Typography>
        <Typography variant="h5" color="#fff" fontWeight="bold">
          ${currentBalance.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  )
}

export default WalletBalance
