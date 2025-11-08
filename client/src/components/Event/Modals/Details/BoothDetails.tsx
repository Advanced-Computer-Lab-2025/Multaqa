import React from 'react';
import { Box, Typography, Grid as MuiGrid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapPin, Users } from 'lucide-react';
import { BoothDetails as BoothDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';

const Grid = styled(MuiGrid)``;

const BoothDetails: React.FC<BoothDetailsType> = ({
  color,
  location,
  representatives,
  schedule
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Booth Information</SectionTitle>
          <IconWrapper icon={MapPin} text={`Location: ${location}`} color={color} />
          <IconWrapper 
            icon={Users} 
            text={`Representatives: ${representatives?.join(', ')}`} 
            color={color}
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box>
          <SectionTitle>Schedule</SectionTitle>
          {schedule?.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color }}>{item.time}</Typography>
              <Typography variant="body2">{item.activity}</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BoothDetails;