"use client"
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container
} from '@mui/material';
import { ErrorOutline } from '@mui/icons-material'; // Changed icon
import { useRouter } from '@/i18n/navigation';
import { useAuth } from "@/context/AuthContext";
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles'; // Import useTheme to access error color

const PaymentError: React.FC = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const { user} = useAuth();
  const role = String(user?.role);
  const position = String((user as any)?.position || "");
  const theme = useTheme(); // Use theme to get MUI error color

  useEffect(() => {
    // Determine which role/position to use for redirect
    const redirectRole = role === "staffMember" ? position : role;
    
    if(role === "staffMember" || role === "student"){
      const timer = setTimeout(() => {
        router.push(`/${redirectRole}/events/browse-events`);
      }, 3000); // Redirect after 3 seconds

      // Countdown effect
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };
    }
    else  if(role==="vendor"){
      const timer = setTimeout(() => {
        router.push(`/${role}/opportunities/available`);
      }, 3000); // Redirect after 3 seconds

      // Countdown effect
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownTimer);
      };

    }
    else {
      toast.error("Illegal Route",
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  }, [router, role]); // Added role to dependency array for correctness

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
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <ErrorOutline // Changed icon to ErrorOutline
            sx={{
              fontSize: 80,
              color: theme.palette.error.main, // Changed color to error red
              mb: 3
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="error" // Changed color to error
          >
            Payment Failed!
          </Typography>

          <Typography
            variant="h6"
            color="text.primary"
            sx={{ mb: 3 }}
          >
            Your transaction could not be processed. Please try again or contact support.
          </Typography>

          <Typography
            variant="body1"
            color="text.primary"
          >
            Returning to the dashboard in {countdown} seconds...
          </Typography>

          <CircularProgress
            size={40}
            sx={{ mt: 3, color: theme.palette.error.main }} // Added error color to progress bar
          />
        </Box>
      </Container>
    </Box>
  );
};

export default PaymentError;