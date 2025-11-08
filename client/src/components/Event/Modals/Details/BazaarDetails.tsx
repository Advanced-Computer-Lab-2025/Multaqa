import React from 'react';
import { Box, Typography, Grid as MuiGrid, Chip, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Clock, Group } from 'lucide-react';
import { BazaarDetails as BazaarDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';
import { CalendarToday, EventAvailable, AccessTime, LocationOn, AttachMoney } from '@mui/icons-material';

const Grid = styled(MuiGrid)``;

const BazaarDetails: React.FC<BazaarDetailsType> = ({
  color,
  registrationDeadline,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  vendorCount,
}) => {
  const detailItems = [
      {
        icon: <CalendarToday color="primary" />,
        label: "Registration Deadline",
        value: registrationDeadline,
        customColor: "#6299d0"
      },
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
        icon: <Group />,
        label: "Vendor Count",
        value: vendorCount,
        customColor: "#6e8ae6"
      }
    ];
  
  return (
     <CardContent sx={{ p: 3 }}>
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
  );
};

export default BazaarDetails;