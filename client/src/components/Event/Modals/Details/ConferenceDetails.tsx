import React from 'react';
import { Box, Typography, Grid as MuiGrid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapPin, Clock } from 'lucide-react';
import { ConferenceDetails as ConferenceDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';

const Grid = styled(MuiGrid)``;

const ConferenceDetails: React.FC<ConferenceDetailsType> = ({ 
  color, 
  location, 
  virtualLink, 
  agenda, 
  speakers 
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Schedule</SectionTitle>
          {agenda?.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color }}>{item.time}</Typography>
              <Typography variant="body2">{item.activity}</Typography>
            </Box>
          ))}
        </Box>
        <Box>
          <SectionTitle>Location Details</SectionTitle>
          <IconWrapper icon={MapPin} text={location || 'Location TBA'} color={color} />
          {virtualLink && (
            <IconWrapper icon={Clock} text={`Virtual Link: ${virtualLink}`} color={color} />
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ mb: 3 }}>
          <SectionTitle>Speakers</SectionTitle>
          {speakers?.map((speaker, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{speaker.name}</Typography>
              <Typography variant="body2" color="text.secondary">{speaker.role}</Typography>
              {speaker.topic && (
                <Typography variant="body2" sx={{ color }}>Topic: {speaker.topic}</Typography>
              )}
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConferenceDetails;