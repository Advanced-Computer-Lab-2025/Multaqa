import React from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';
import { User, TrendingUp } from 'lucide-react';
import theme from '@/themes/lightTheme';
import StatusChip from '../shared/StatusChip';
import { capitalizeFullName } from '../shared/utils/nameUtils';

interface WalletBalanceProps {
  currentBalance?: number;
  userInfo?: any;
  transactions?: any[]; // make optional
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  userInfo,
  currentBalance = 0,
  transactions = [], // default to empty array
}) => {
  const getInitials = () => {
    const firstInitial = userInfo?.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = userInfo?.lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };
  const active = userInfo.status == "active";
  const fullNameRaw = userInfo?.firstName + " " + userInfo?.lastName;
  const fullName = capitalizeFullName(fullNameRaw);

  const monthTransactions = (transactions || []).reduce((acc: any, tx: any) => {
    const txDate = new Date(tx.date);
    const now = new Date();
    if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
      return acc + (tx.type === 'refund' ? tx.amount : -tx.amount);
    }
    return acc;
  }, 0).toFixed(2)
  const isMonthPositive = parseFloat(monthTransactions) >= 0;

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      {/* Modern Card with Glassmorphism Effect */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 50%, #1e293b 100%)',
          p: 0.125,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Decorative Blurred Circles */}
          <Box
            sx={{
              position: 'absolute',
              right: -48,
              top: -48,
              width: 192,
              height: 192,
              borderRadius: '50%',
              background: 'rgba(59, 130, 246, 0.1)',
              filter: 'blur(60px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: -48,
              bottom: -48,
              width: 192,
              height: 192,
              borderRadius: '50%',
              background: 'rgba(168, 85, 247, 0.1)',
              filter: 'blur(60px)',
            }}
          />

          {/* Content Container */}
          <Box sx={{ position: 'relative', zIndex: 10, p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    background: `linear-gradient(135deg, ${theme.palette.tertiary.main} 0%, ${theme.palette.primary.main} 100%)`,
                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.4)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    Account Holder
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                    {fullName ?? "User"}'s Account
                  </Typography>
                </Box>
              </Box>

              {/* Status Badge */}
              <StatusChip active={active} />
            </Box>

            {/* Balance Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  Current Balance
                </Typography>
                <TrendingUp size={16} color="#34d399" />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', sm: '3.5rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                ${currentBalance.toFixed(2)}
              </Typography>

              {/* Subtle separator */}
              <Box
                sx={{
                  mt: 3,
                  height: 1,
                  width: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, #475569 50%, transparent 100%)',
                }}
              />
            </Box>

            {/* Quick Stats */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(30, 41, 59, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    This Month
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, mt: 0.5 }}>
                    {/* sum transactions with their signs and check this month's date */}
                    {isMonthPositive ? "+" : "-"}${Math.abs(parseFloat(monthTransactions)).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(30, 41, 59, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Transactions
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, mt: 0.5 }}>
                    {transactions.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Box
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(10px)',
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(30, 41, 59, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    Last Activity
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, mt: 0.5 }}>
                    {/* // get newest transaction date */}
                    {transactions.length > 0 ? new Date(Math.max(...transactions.map((tx: any) => new Date(tx.date).getTime()))).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WalletBalance;