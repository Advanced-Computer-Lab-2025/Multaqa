import { Box, Typography, Paper } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User, ArrowUp, ArrowDown } from 'lucide-react';
import WalletBalance from './WalletBalance';
import React from 'react'


interface WalletProps {
  userID: string;
  userInfo: any;
}

const Wallet = ({userID, userInfo}: WalletProps) => {
  const currentBalance = 0;
  const dummyTransactions = [
    {
      "type": "payment",
      "date": "2025-10-02",
      "amount": 150.75,
      "event_name": "Tech Conference 2025"
    },
    {
      "type": "refund",
      "date": "2025-10-10",
      "amount": 50.00,
      "event_name": "Music Fest Cairo"
    },
    {
      "type": "payment",
      "date": "2025-09-28",
      "amount": 299.99,
      "event_name": "Startup Summit"
    },
    {
      "type": "payment",
      "date": "2025-11-05",
      "amount": 75.00,
      "event_name": "AI Workshop"
    },
    {
      "type": "refund",
      "date": "2025-08-14",
      "amount": 20.50,
      "event_name": "Cooking Masterclass"
    },
    {
      "type": "payment",
      "date": "2025-10-25",
      "amount": 120.00,
      "event_name": "Design Thinking Bootcamp"
    },
    {
      "type": "payment",
      "date": "2025-11-10",
      "amount": 89.99,
      "event_name": "Photography 101"
    },
    {
      "type": "refund",
      "date": "2025-11-11",
      "amount": 89.99,
      "event_name": "Photography 101"
    },
    {
      "type": "payment",
      "date": "2025-07-30",
      "amount": 45.00,
      "event_name": "Coding for Beginners"
    },
    {
      "type": "payment",
      "date": "2025-09-12",
      "amount": 200.00,
      "event_name": "Startup Networking Night"
    }
  ];

  return (
    <>
      <WalletBalance userInfo={userInfo} currentBalance={currentBalance}/>
      <Typography variant="h5" sx={{width: '100%', mt: 5, mb: 2, pb:2, fontWeight: 600, color: theme.palette.text.primary, borderBottom: `2px solid ${theme.palette.divider}`}}>
        Previous Transactions
      </Typography>
      
      {/* Transactions List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {dummyTransactions.map((transaction, index) => {
          const isRefund = transaction.type === 'refund';
          const arrowColor = isRefund ? '#10B981' : '#EF4444';
          const amountColor = isRefund ? '#10B981' : '#EF4444';
          const amountPrefix = isRefund ? '+' : '-';

          return (
            <Paper
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: '#FAFAFA',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-4px)',
                  backgroundColor: '#F5F5F5',
                },
              }}
            >
              {/* Icon Box */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: 1.5,
                  backgroundColor: isRefund ? '#D1FAE5' : '#FEE2E2',
                  transition: 'transform 0.3s ease',
                }}
              >
                {isRefund ? (
                  <ArrowUp size={24} color={arrowColor} strokeWidth={2.5} />
                ) : (
                  <ArrowDown size={24} color={arrowColor} strokeWidth={2.5} />
                )}
              </Box>

              {/* Transaction Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600" color={theme.palette.text.primary}>
                  {transaction.event_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {transaction.type}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {transaction.date}
                </Typography>
              </Box>

              {/* Amount */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: amountColor, minWidth: '80px', textAlign: 'right' }}
              >
                {amountPrefix}${transaction.amount.toFixed(2)}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </>
  );
}

export default Wallet
