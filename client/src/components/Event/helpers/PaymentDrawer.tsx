import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Switch,
  Divider,
  Alert,
  CircularProgress,
  Drawer,
  IconButton,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import { 
  CreditCard, 
  AccountBalanceWallet, 
  Close,
  CheckCircle,
  LockOutlined,
  ArrowForward
} from '@mui/icons-material';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { api } from '@/api';

// Type definitions
interface PaymentSuccessDetails {
  method: 'stripe' | 'wallet' | 'combined';
  amount: number;
  transactionId: string;
  walletAmount?: number;
  stripeAmount?: number;
}

interface PaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  walletBalance: number;
  onPaymentSuccess: (paymentDetails: PaymentSuccessDetails) => void;
  eventId:string,
  email:string,
}

interface MockPaymentResponse {
  success: boolean;
  transactionId: string;
  error?: string;
}

const PaymentDrawer: React.FC<PaymentDrawerProps> = ({ 
  open, 
  onClose, 
  totalAmount, 
  walletBalance, 
  onPaymentSuccess,
  eventId, 
  email
}) => {
  const theme = useTheme();
  const [useWallet, setUseWallet] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');

  // Calculate amounts
  const walletCoverage = Math.min(walletBalance, totalAmount);
  const remainingAmount = totalAmount - walletCoverage;
  const needsStripePayment = remainingAmount > 0;
  const totalDue = useWallet 
  ? Math.max(totalAmount - walletCoverage, 0) 
  : totalAmount;


  // Color definitions based on your theme
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
      setUseWallet(false);
      setIsProcessing(false);
      setPaymentError('');
    }
  }, [open]);

  const handleWalletToggle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUseWallet(event.target.checked);
    setPaymentError('');
  };

  const handleStripePayment = async (): Promise<void> => {
    setIsProcessing(true);
    setPaymentError('');
    const payload = {
      customerEmail:email,
      quantity:1,
      metadata:''
    }
    
    try {
      const stripeResponse = await api.post(`/payments/${eventId}`, payload); 
      console.log(stripeResponse);
      window.location.href = stripeResponse.data.data.url;
    } catch (error) {
      setPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletPayment = async (): Promise<void> => {
    if (walletBalance < totalAmount) {
      setPaymentError('Insufficient wallet balance');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');
    
    try {
      const walletResponse = await mockWalletPayment(totalAmount);
      
      if (walletResponse.success) {
        onPaymentSuccess({
          method: 'wallet',
          amount: totalAmount,
          transactionId: walletResponse.transactionId
        });
      } else {
        setPaymentError(walletResponse.error || 'Wallet payment failed');
      }
    } catch (error) {
      setPaymentError('Wallet payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCombinedPayment = async (): Promise<void> => {
    setIsProcessing(true);
    setPaymentError('');
    
    try {
      const walletResponse = await mockWalletPayment(walletCoverage);
      
      if (!walletResponse.success) {
        setPaymentError('Wallet payment failed');
        return;
      }

      const stripeResponse = await mockStripePayment(remainingAmount);
      
      if (stripeResponse.success) {
        onPaymentSuccess({
          method: 'combined',
          amount: totalAmount,
          walletAmount: walletCoverage,
          stripeAmount: remainingAmount,
          transactionId: stripeResponse.transactionId
        });
      } else {
        setPaymentError('Stripe payment failed');
      }
    } catch (error) {
      setPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayNow = (): void => {
    if (useWallet && walletBalance >= totalAmount) {
      handleWalletPayment();
    } else if (useWallet && needsStripePayment) {
      handleCombinedPayment();
    } else {
      handleStripePayment();
    }
  };

  const canPayWithWallet = useWallet && walletBalance >= totalAmount;
  const canPayWithCombined = useWallet && walletBalance > 0 && needsStripePayment;
  const isPayButtonEnabled = !isProcessing && (
    !useWallet || 
    canPayWithWallet || 
    canPayWithCombined
  );

  // Mock payment functions
  const mockStripePayment = (amount: number): Promise<MockPaymentResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'stripe_' + Date.now()
        });
      }, 2000);
    });
  };

  const mockWalletPayment = (amount: number): Promise<MockPaymentResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: 'wallet_' + Date.now()
        });
      }, 1500);
    });
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
          {/* Payment Methods */}
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'text.secondary', 
              fontWeight: 700,
              letterSpacing: 1.2,
              fontSize: '0.7rem'
            }}
          >
            Payment Methods
          </Typography>

          {/* Wallet Card */}
          <Fade in={true} timeout={300}>
            <Box 
              onClick={() => setUseWallet(!useWallet)}
              sx={{ 
                mt: 2,
                p: 2.5,
                borderRadius: 3,
                background: useWallet 
                  ? `linear-gradient(135deg, ${colors.tertiary.main} 0%, ${alpha(colors.primary.main, 0.8)} 100%)` 
                  : 'white',
                border: useWallet ? 'none' : `2px solid ${alpha(theme.palette.divider, 0.5)}`,
                cursor: 'pointer',
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: useWallet ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: useWallet 
                  ? `0 12px 40px ${alpha(colors.primary.main, 0.35)}` 
                  : `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                '&:hover': {
                  transform: useWallet ? 'translateY(-4px) scale(1.02)' : 'translateY(-2px) scale(1)',
                  boxShadow: useWallet 
                    ? `0 16px 48px ${alpha(colors.primary.main, 0.4)}` 
                    : `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: useWallet ? alpha('#ffffff', 0.2) : alpha(colors.tertiary.main, 0.1),
                    display: 'flex',
                    transition: 'all 0.3s ease'
                  }}>
                    <AccountBalanceWallet sx={{ 
                      color: useWallet ? 'white' : colors.primary.main, 
                      fontSize: 26
                    }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight="700"
                      sx={{ 
                        color: useWallet ? 'white' : 'text.primary',
                        fontSize: '1.1rem',
                        mb: 0.3
                      }}
                    >
                      Wallet Balance
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: useWallet ? alpha('#ffffff', 0.85) : 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      EGP {walletBalance.toFixed(2)} available
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={useWallet}
                  onChange={handleWalletToggle}
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'white',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: alpha('#ffffff', 0.5),
                    },
                  }}
                />
              </Box>
              
              <Slide direction="down" in={useWallet} mountOnEnter unmountOnExit>
                <Box sx={{ 
                  mt: 2, 
                  pt: 2, 
                  borderTop: useWallet ? `1px solid ${alpha('#ffffff', 0.2)}` : 'none',
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap'
                }}>
                  {walletCoverage > 0 && (
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 18 }} />}
                      label={`Covers EGP ${walletCoverage.toFixed(2)}`}
                      size="small"
                      sx={{ 
                        bgcolor: useWallet ? alpha('#ffffff', 0.25) : alpha(colors.success.main, 0.15),
                        backdropFilter: 'blur(10px)',
                        color: useWallet ? 'white' : colors.success.dark,
                        fontWeight: 600,
                        border: useWallet ? `1px solid ${alpha('#ffffff', 0.3)}` : `1px solid ${alpha(colors.success.main, 0.3)}`,
                        '& .MuiChip-icon': { color: useWallet ? 'white' : colors.success.main },
                        '& .MuiChip-label': { px: 1.5 }
                      }}
                    />
                  )}
                  {needsStripePayment && (
                    <Chip
                      label={`Remaining EGP ${remainingAmount.toFixed(2)}`}
                      size="small"
                      sx={{ 
                        bgcolor: useWallet ? alpha('#ffffff', 0.25) : alpha(colors.error.main, 0.1),
                        backdropFilter: 'blur(10px)',
                        color: useWallet ? 'white' : colors.error.dark,
                        fontWeight: 600,
                        border: useWallet ? `1px solid ${alpha('#ffffff', 0.3)}` : `1px solid ${alpha(colors.error.main, 0.3)}`,
                        '& .MuiChip-label': { px: 1.5 }
                      }}
                    />
                  )}
                </Box>
              </Slide>
            </Box>
          </Fade>

          {/* Stripe Card */}
          <Fade in={true} timeout={500}>
            <Box sx={{ 
              mt: 2,
              p: 2.5,
              borderRadius: 3,
              background: (useWallet && !needsStripePayment) 
                ? theme.palette.action.disabledBackground 
                : 'white',
              border: `2px solid ${(useWallet && !needsStripePayment) 
                ? theme.palette.action.disabledBackground :alpha(theme.palette.divider, 0.5)}`,
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              transform:'translateY(0) scale(1)',
              boxShadow:  `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
              '&:hover': {
                  transform:(useWallet && !needsStripePayment) ?"":'translateY(-2px) scale(1)',
                  boxShadow: (useWallet && !needsStripePayment) ?"": `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
                },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2, 
                    bgcolor: alpha(colors.tertiary.main, 0.1),
                    display: 'flex',
                  }}>
                    <CreditCard sx={{ color:`${(useWallet && !needsStripePayment)?theme.palette.action.disabledBackground :colors.tertiary.main}`, fontSize: 26 }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700" sx={{ fontSize: '1.1rem', mb: 0.3, color:`${(useWallet && !needsStripePayment)?theme.palette.grey[500]:"text.primary"}}` }}>
                      Credit / Debit Card
                    </Typography>
                    <Typography variant="body2" color={(useWallet && !needsStripePayment)?theme.palette.grey[500]:"text.secondary"} fontWeight="500">
                      {(useWallet && !needsStripePayment) 
                        ? "Wallet covers full amount"
                        : "Powered by Stripe"
                      }
                    </Typography>
                  </Box>
                </Box>
                {!(useWallet && !needsStripePayment) && (
                  <Chip 
                    label="Secure" 
                    size="small"
                    sx={{
                      bgcolor: alpha(colors.success.main, 0.15),
                      color: colors.success.dark,
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-label': { px: 1.5 }
                    }}
                  />
                )}
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
                    Order Total
                  </Typography>
                  <Typography variant="body2" fontWeight="700">
                    EGP {totalAmount.toFixed(2)}
                  </Typography>
                </Box>
                
                {useWallet && walletCoverage > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.success.dark, fontWeight: 600 }}>
                      ✓ Wallet Payment
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.success.dark, fontWeight: 700 }}>
                      - EGP {walletCoverage.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                
                {useWallet && needsStripePayment && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: colors.tertiary.main, fontWeight: 600 }}>
                      Card Payment
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.tertiary.main, fontWeight: 700 }}>
                      EGP {remainingAmount.toFixed(2)}
                    </Typography>
                  </Box>
                )}
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
                  EGP {totalDue.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                    Inclusive of all taxes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Error Message */}
          {paymentError && (
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
                {paymentError}
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
          <Box sx={{ width: '100%', maxWidth: '100%', display:"flex", justifyContent:"center", alignItems:"center" }}>
            <CustomButton
              variant="contained"
              disabled={!isPayButtonEnabled}
              onClick={handlePayNow}
              color="tertiary"
              sx={{ 
                py: 2,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
                width:"100%"
                // background: isPayButtonEnabled 
                //   ? `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`
                //   : alpha(theme.palette.action.disabled, 0.5),
                // boxShadow: isPayButtonEnabled 
                //   ? `0 6px 24px ${alpha(colors.primary.main, 0.35)}`
                //   : 'none',
                // transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                // '&:hover': isPayButtonEnabled ? {
                //   transform: 'translateY(-2px)',
                //   boxShadow: `0 8px 32px ${alpha(colors.primary.main, 0.45)}`,
                // } : {},
                // '&:active': isPayButtonEnabled ? {
                //   transform: 'translateY(0)',
                // } : {},
              }}
            >
              {isProcessing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                  <CircularProgress size={22} sx={{ color: 'white' }} />
                  <span>Processing Payment...</span>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                    <span>
                    {useWallet && totalDue === 0
                      ? "Pay from Wallet"
                      : useWallet && totalDue > 0
                      ? "Pay Remaining via Stripe"
                      : "Pay via Stripe"}
                  </span>
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
              {useWallet && walletBalance >= totalAmount
                ? "Payment from wallet • Instant processing"
                : useWallet && needsStripePayment
                ? `Split: EGP ${walletCoverage.toFixed(2)} wallet + EGP ${remainingAmount.toFixed(2)} card`
                : "Secure payment via Stripe • PCI DSS compliant"
              }
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PaymentDrawer;