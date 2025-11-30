import { Box, Typography, Paper } from '@mui/material';
import theme from "@/themes/lightTheme";
import { User, ArrowUp, ArrowDown , CreditCard, Wallet} from 'lucide-react';
import WalletBalance from './WalletBalance';
import React from 'react'

interface TransactionsProps {
 transactions:any;
}

const PreviousTransactions = ({transactions}:TransactionsProps) => {

   // Sort transactions by date in descending order (newest first)
  const sortedTransactions = [...(transactions || [])].sort((a, b) => {
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

          const total = Number(transaction.amount ?? 0).toFixed(2);
          const card = Number(transaction.cardAmount ?? 0).toFixed(2);
          const wallet = Number(transaction.walletAmount ?? 0).toFixed(2);
          const displayDate = transaction.date ? new Date(transaction.date).toLocaleDateString() : '';

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

              {/* Transaction Details - adjusted to new dummy fields */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {isRefund ? `Refund for ${transaction.eventName}` : `Payment for ${transaction.eventName}`}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Total: EGP {total}
                </Typography>

                {!isRefund ?
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard size={16} />
                    Card: EGP {card}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wallet size={16} />
                    Wallet: EGP {wallet}
                  </Typography>
                </>  
                :<></>} 

                <Typography variant="caption" color="textPrimary">
                  Date: {displayDate}
                </Typography>
              </Box>

              {/* Amount */}
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: amountColor, minWidth: '80px', textAlign: 'right' }}
              >
                {amountPrefix}EGP {Number(transaction.amount ?? 0).toFixed(2)}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </>
  );
}

export default PreviousTransactions
