import { Box, Typography, Paper } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User, ArrowUp, ArrowDown } from 'lucide-react';
import WalletBalance from './WalletBalance';
import React from 'react'

interface TransactionsProps {
 transactions:any;
}

const PreviousTransactions = ({transactions}:TransactionsProps) => {

   // Sort transactions by date in descending order (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const gradient = `linear-gradient(135deg, ${theme.palette.tertiary?.main ?? theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`;

  return (
    <>
     <Typography variant="h5" sx={{width: '100%', mt: 5, mb: 2, pb:2, fontWeight: 600, color: theme.palette.text.primary, borderBottom: `2px solid ${theme.palette.divider}`}}>
        Previous Transactions
      </Typography>
      
      {/* Transactions List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sortedTransactions.map((transaction:any, index:any) => {
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
                backgroundColor: "#FAFAFA",
                borderRadius: 3,
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
                  <ArrowDown size={24} color={arrowColor} strokeWidth={2.5} />
                ) : (
                  <ArrowUp size={24} color={arrowColor} strokeWidth={2.5} />
                )}
              </Box>

              {/* Transaction Details */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {transaction.event_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                  {transaction.type}
                </Typography>
                <Typography variant="caption" color="textSecondary">
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

export default PreviousTransactions
