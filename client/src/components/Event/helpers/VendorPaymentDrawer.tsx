import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { CreditCard, Close, LockOutlined, ArrowForward } from '@mui/icons-material';
import { api } from '@/api';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { toast } from 'react-toastify';

interface VendorPaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  eventId: string;
  email: string;
}

const VendorPaymentDrawer: React.FC<VendorPaymentDrawerProps> = ({
  open,
  onClose,
  totalAmount,
  eventId,
  email,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  // Color definitions matching PaymentDrawer
  const colors = {
    primary: {
      main: "#6299d0",
      light: "#b2cee2",
      dark: "#598bbd",
      contrastText: "#e6e6da",
    },
    secondary: {
      main: "#9c27b0",
      dark: "#d5de57",
      contrastText: "#13233d",
    },
    tertiary: {
      light: "#6e8ae6",
      main: "#3a4f99",
      dark: "#25346b",
      contrastText: '#fff',
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    }
  };

  // Reset state when drawer opens/closes
  useEffect(() => {
    if (open) {
      setLoading(false);
      setError(null);
    }
  }, [open]);

  const handleStripePayment = async (): Promise<void> => {
      setIsProcessing(true);
      setPaymentError('');
      const payload = {
        customerEmail: email,
        metadata: '',
      }
  
      try {
        const stripeResponse = await api.post(`/payments/vendor/${eventId}`, payload);
        console.log(stripeResponse);
        window.location.href = stripeResponse.data.data.url;
      } catch (error) {
        setPaymentError('Payment processing failed');
        toast.error('Payment processing failed');
        onClose();
      } finally {
        setIsProcessing(false);
      }
    };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450 },
          boxSizing: 'border-box',
          background: 'linear-gradient(to bottom, #fafbfc 0%, #ffffff 100%)',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header with primary color gradient */}
        <Box sx={{
          background: `linear-gradient(135deg, ${colors.tertiary.main} 0%, ${colors.primary.dark} 100%)`,
          p: 3,
          pb: 4,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)',
          }
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="h5" fontWeight="700" sx={{ color: "#fff", mb: 0.5 }}>
                Complete Payment
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: "#fff", opacity: 0.9 }}>
                <LockOutlined sx={{ fontSize: 16 }} />
                <Typography variant="caption" fontWeight="500">
                  Secured & Encrypted
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={onClose}
              sx={{
                color: colors.primary.contrastText,
                bgcolor: alpha(colors.primary.contrastText, 0.15),
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: alpha(colors.primary.contrastText, 0.25),
                  transform: 'rotate(90deg)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {/* Payment Method */}
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: 1.2,
              fontSize: '0.7rem'
            }}
          >
            Payment Method
          </Typography>

          {/* Card Payment Option */}
          <Fade in={true} timeout={300}>
            <Box sx={{
              mt: 2,
              p: 2.5,
              borderRadius: 3,
              background: 'white',
              border: `2px solid ${alpha(theme.palette.divider, 0.5)}`,
              transition: 'all 0.3s ease',
              boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: alpha(colors.tertiary.main, 0.1),
                  display: 'flex',
                }}>
                  <CreditCard sx={{ color: colors.tertiary.main, fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.1rem', mb: 0.3 }}>
                    Credit / Debit Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    Powered by Stripe
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>

          {/* Payment Summary */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: 1.2,
                fontSize: '0.7rem'
              }}
            >
              Payment Summary
            </Typography>

            <Box sx={{
              mt: 2,
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha('#f5f7fa', 1)} 0%, ${alpha('#e4e9f2', 0.5)} 100%)`,
              border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.06)}`
            }}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    Booth Registration Fee
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    USD {totalAmount}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: alpha(theme.palette.divider, 0.6) }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem' }}>
                  Total Due
                </Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="h5"
                    fontWeight="800"
                    sx={{
                      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    EGP {totalAmount.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Inclusive of all taxes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Error Message */}
          {error && (
            <Fade in={true}>
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  borderRadius: 2.5,
                  border: `1px solid ${alpha(colors.error.main, 0.3)}`,
                  boxShadow: `0 4px 16px ${alpha(colors.error.main, 0.15)}`
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}
        </Box>

        {/* Footer - Full width centered button */}
        <Box sx={{
          p: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: 'white',
          boxShadow: `0 -8px 32px ${alpha(theme.palette.common.black, 0.04)}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          <Box sx={{ width: '100%', maxWidth: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CustomButton
              variant="contained"
              disabled={loading}
              onClick={handleStripePayment}
              color="tertiary"
              sx={{
                py: 2,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                width: "100%"
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                  <CircularProgress size={22} sx={{ color: 'white' }} />
                  <span>Processing Payment...</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <span>Pay via Stripe</span>
                  <ArrowForward sx={{ fontSize: 20 }} />
                </Box>
              )}
            </CustomButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.8,
              mt: 2,
              width: '100%',
              textAlign: 'center'
            }}
          >
            <LockOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: 500,
                lineHeight: 1.5
              }}
            >
              Secure payment via Stripe • PCI DSS compliant
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default VendorPaymentDrawer;
