"use client";

import React from 'react';
import { Box, Typography, Grid as MuiGrid, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Calendar, Clock, MapPin, Users, Book } from 'lucide-react';

const Grid = styled(MuiGrid)``;

interface EventTypeDetailsProps {
  type: string;
  details: Record<string, any>;
  color: string;
}

const EventTypeDetails: React.FC<EventTypeDetailsProps> = ({ type, details, color }) => {
  const IconWrapper = ({ icon: Icon, text }: { icon: any, text: string }) => (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
      <Icon size={20} color={color} />
      <Typography variant="body2">{text}</Typography>
    </Box>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
      {children}
    </Typography>
  );

  const renderConferenceDetails = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Schedule</SectionTitle>
          {details.agenda?.map((item: any, index: number) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color }}>{item.time}</Typography>
              <Typography variant="body2">{item.activity}</Typography>
            </Box>
          ))}
        </Box>
        <Box>
          <SectionTitle>Location Details</SectionTitle>
          <IconWrapper icon={MapPin} text={details.location || 'Location TBA'} />
          {details.virtualLink && (
            <IconWrapper icon={Clock} text={`Virtual Link: ${details.virtualLink}`} />
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ mb: 3 }}>
          <SectionTitle>Speakers</SectionTitle>
          {details.speakers?.map((speaker: any, index: number) => (
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

  const renderWorkshopDetails = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Workshop Information</SectionTitle>
          <IconWrapper icon={Users} text={`Capacity: ${details.capacity} participants`} />
          <IconWrapper icon={Clock} text={`Duration: ${details.duration}`} />
          <IconWrapper icon={Book} text={`Prerequisites: ${details.prerequisites || 'None'}`} />
        </Box>
        <Box sx={{ mb: 3 }}>
          <SectionTitle>Skills You'll Learn</SectionTitle>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {details.skills?.map((skill: string, index: number) => (
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
          {details.instructors?.map((instructor: any, index: number) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2">{instructor.name}</Typography>
              <Typography variant="body2" color="text.secondary">{instructor.expertise}</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const renderBazaarDetails = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Vendor Information</SectionTitle>
          <Typography variant="body2" sx={{ mb: 3 }}>{details.vendorDescription}</Typography>
          <SectionTitle>Products & Services</SectionTitle>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {details.products?.map((product: string, index: number) => (
              <Chip 
                key={index} 
                label={product} 
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
          <SectionTitle>Operating Hours</SectionTitle>
          {details.operatingHours?.map((hour: string, index: number) => (
            <IconWrapper key={index} icon={Clock} text={hour} />
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const renderBoothDetails = () => (
    <Grid container spacing={3}>
      <Grid size={{ xs: 6, md: 8 }}>
        <Box sx={{ mb: 4 }}>
          <SectionTitle>Booth Information</SectionTitle>
          <IconWrapper icon={MapPin} text={`Location: ${details.location}`} />
          <IconWrapper 
            icon={Users} 
            text={`Representatives: ${details.representatives?.join(', ')}}`} 
          />
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box>
          <SectionTitle>Schedule</SectionTitle>
          {details.schedule?.map((item: any, index: number) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color }}>{item.time}</Typography>
              <Typography variant="body2">{item.activity}</Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  );

  const renderContent = () => {
    switch (type.toLowerCase()) {
      case 'conference':
        return renderConferenceDetails();
      case 'workshop':
        return renderWorkshopDetails();
      case 'bazaar':
        return renderBazaarDetails();
      case 'booth':
        return renderBoothDetails();
      default:
        return <Typography>No additional details available</Typography>;
    }
  };

  return (
    <Box>
      {renderContent()}
    </Box>
  );
};

export default EventTypeDetails;
