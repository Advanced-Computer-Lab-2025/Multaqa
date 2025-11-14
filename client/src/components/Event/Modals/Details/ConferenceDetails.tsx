import React, { useState } from 'react';
import { Box, Typography, Grid as MuiGrid, CardContent, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Check, Copy, FileText, PiggyBank } from 'lucide-react';
import { ConferenceDetails as ConferenceDetailsType } from '../types/eventDetails.types';
import { EventAvailable, AccessTime, LocationOn, AccountBalance } from '@mui/icons-material';
import { color } from 'storybook/internal/theming';
import theme from '@/themes/lightTheme';

const Grid = styled(MuiGrid)``;

const ConferenceDetails: React.FC<ConferenceDetailsType> = ({ 
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  link,
  resources,
  funding,
  budget,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };
  const detailItems = [
      {
        icon: <EventAvailable sx={{ color: "#9c27b0" }} />,
        label: "Event Period",
        value: `${startDate} - ${endDate}`,
        customColor: "#9c27b0"
      },
      {
        icon: <AccessTime sx={{ color: '#FF6B35' }} />,
        label: "Time",
        value: `${startTime} - ${endTime}`,
        customColor: '#FF6B35'
      },
      {
        icon: <LocationOn sx={{ color: '#4CAF50' }} />,
        label: "Location",
        value: location,
        customColor: '#4CAF50'
      },
      {
        icon: <FileText style={{ color: '#FF6B35' }} />,
        label: "Resources",
        value: resources || 'None',
        customColor: '#FF6B35'
      },
      {
        icon: <PiggyBank style={{ color: "#6e8ae6" }} />,
        label: "Funding Source",
        value: funding,
        customColor: "#6e8ae6"
      },
      {
        icon: <AccountBalance sx={{ color: '#F9A826' }} />,
        label: "Budget",
        value: budget,
        customColor: '#F9A826'
      }
    ];
  return (
    <>
      <CardContent sx={{ p: 3 }}>
         <Tooltip title={copySuccess ? "Copied!" : "Copy link"} arrow placement="top">
  <Box
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      mb:4,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 2,
      padding: '6px 12px',
      backgroundColor: theme.palette.background.paper,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderColor: theme.palette.primary.main,
      },
    }}
    onClick={handleCopyLink}
  >
         <Typography 
          variant="h5" 
          color= {theme.palette.primary.main}
          fontWeight="medium"
          sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight:600 }}
        >
          Conference Website:
        </Typography>
        {/* Link */}
        <Typography
          variant="body2"
          sx={{
            color: "text.primary" ,
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 200,
          }}
        >
          {link}
        </Typography>

        {/* Copy Icon */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: copySuccess ? theme.palette.success.main : theme.palette.text.secondary,
            transition: 'color 0.2s ease',
          }}
        >
          {copySuccess ? <Check size={14} /> : <Copy size={14} />}
        </Box>
      </Box>
    </Tooltip>
        <Grid container spacing={3}>
          {detailItems.map((item, index) => (
            <Grid size={{xs: 12, md: 6}} key={index}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: 1,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box 
                  sx={{ 
                    mr: 2,
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: item.customColor ? `${item.customColor}15` : color,
                    color: item.customColor 
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography 
                    variant="caption" 
                    color="text.primary" 
                    fontWeight="medium"
                    sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}
                  >
                    {item.label}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium"
                    sx={{ 
                      color: item.customColor,
                      mt: 0.5
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </>
  );
};

export default ConferenceDetails;