import React, { useState } from 'react';
import logoPlaceholder from './logo.jpeg';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  LocalOffer as DiscountIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { IFileInfo } from '../../../../../backend/interfaces/fileData.interface';

interface Vendor {
  companyName: string;
  logo: IFileInfo;
  loyaltyProgram?: {
    discountRate: number;
    promoCode: string;
    termsAndConditions: string;
  };
}

interface VendorCardProps {
  vendor: Vendor;
}

const VendorCard: React.FC<VendorCardProps> = ({ vendor }) => {
  const theme = useTheme();
  const [copySuccess, setCopySuccess] = useState<'Copy' | 'Copied!'>('Copy');
  const [showTnc, setShowTnc] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess('Copy'), 2000);
    } catch {
      // fail silently
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '24px',
        border: '1.5px solid',
        borderColor: 'grey.300',
        padding: 3,
        maxWidth: 300,
        pt: 6,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      {/* LOGO & TITLE */}
      <Box sx={{ position: 'relative', mb: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: -85,
            left: 10,
            width: 65,
            height: 65,
            bgcolor: 'primary.main',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden',
          }}
        >
          <img
            src={vendor.logo?.url || logoPlaceholder.src}
            alt={`${vendor.companyName} logo`}
            onError={(e) => {
              if (e.currentTarget.src !== logoPlaceholder.src) {
                e.currentTarget.src = logoPlaceholder.src;
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600,textAlign: 'left' }}>
          {vendor.companyName}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2}} />

      {/* DISCOUNT RATE - GREEN & BOLD */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Box display="flex" alignItems="center">
          <DiscountIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
          <Typography variant="body2" color="#666666">
            Discount Rate
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: '#00C853', // Bright green
            fontSize: '14px',
          }}
        >
          {vendor.loyaltyProgram?.discountRate
            ? `${vendor.loyaltyProgram.discountRate}%`
            : 'Special Offer'}
        </Typography>
      </Box>

      {/* T&C SECTION - Right under Discount Rate */}
      <Box mb={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <InfoIcon color="action" sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2" color="#666666">
              Terms & Conditions
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={() => setShowTnc(!showTnc)}
            sx={{
              transform: showTnc ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s ease-in-out',
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 20,
                color: showTnc ? 'primary.main' : '#666666',
              }}
            />
          </IconButton>
        </Box>

        <Collapse in={showTnc}>
          <Box
            sx={{
              mt: 1,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              color="#666666"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '13px' }}
            >
              {vendor.loyaltyProgram?.termsAndConditions || 'No terms available.'}
            </Typography>
          </Box>
        </Collapse>
      </Box>

      <Divider sx={{ mb: 1}} />

      {/* PROMO CODE - Below T&C */}
      <Box>
        <Typography
          variant="caption"
          color="#666666"
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
        >
          <CodeIcon sx={{ fontSize: 16, mr: 0.5 }} />
          Promo Code:
        </Typography>

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'grey.100',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: 1,
              color: theme.palette.text.primary,
            }}
          >
            {vendor.loyaltyProgram?.promoCode || 'N/A'}
          </Typography>

          <Tooltip title={copySuccess === 'Copied!' ? 'Copied!' : 'Copy to clipboard'}>
            <IconButton
              size="small"
              onClick={() => handleCopy(vendor.loyaltyProgram?.promoCode || '')}
              color={copySuccess === 'Copied!' ? 'success' : 'primary'}
            >
              {copySuccess === 'Copied!' ? <CheckIcon /> : <CopyIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default VendorCard;