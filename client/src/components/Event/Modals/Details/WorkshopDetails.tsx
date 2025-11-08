import React from 'react';
import { Box, Typography, Grid as MuiGrid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Users, Clock, Book } from 'lucide-react';
import { WorkshopDetails as WorkshopDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';

const Grid = styled(MuiGrid)``;

const WorkshopDetails: React.FC<WorkshopDetailsType> = ({
  color,
  capacity,
  duration,
  prerequisites,
  skills,
  instructors
}) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Workshop Information</SectionTitle>
          <IconWrapper icon={Users} text={`Capacity: ${capacity} participants`} color={color} />
          <IconWrapper icon={Clock} text={`Duration: ${duration}`} color={color} />
          <IconWrapper icon={Book} text={`Prerequisites: ${prerequisites || 'None'}`} color={color} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <SectionTitle>Skills You'll Learn</SectionTitle>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {skills?.map((skill, index) => (
              <Chip 
                key={index} 
                label={skill} 
                sx={{ 
                  backgroundColor: `${color}15`,
                  color,
                  border: `1px solid ${color}40`
                }} 
              />
            ))}
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box>
          <SectionTitle>Instructor Information</SectionTitle>
          {instructors?.map((instructor, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{instructor.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {instructor.expertise}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default WorkshopDetails;