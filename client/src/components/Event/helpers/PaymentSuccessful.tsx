import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';

const PaymentSuccess: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/en/student/events/browse-events');
    }, 3000); // Redirect after 3 seconds

    // Countdown effect
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            p: 4
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 80,
              color: '#4caf50',
              mb: 3
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Payment Successful!
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Your transaction was completed successfully.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Redirecting to events in {countdown} seconds...
          </Typography>

          <CircularProgress
            size={40}
            sx={{ mt: 3 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;