import React from 'react';
import { Box, Typography, Grid as MuiGrid, Chip, CardContent, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Mail, Building2, FileText, PiggyBank } from 'lucide-react';
import { WorkshopDetails as WorkshopDetailsType } from '../types/eventDetails.types';
import { SectionTitle } from './shared/StyledComponents';
import { 
  AccessTime, 
  AttachMoney, 
  CalendarToday, 
  EventAvailable, 
  LocationOn,
  Person,
  School,
  AccountBalance
} from '@mui/icons-material';

const Grid = styled(MuiGrid)``;

const WorkshopDetails: React.FC<WorkshopDetailsType> = ({
  color,
  registrationDeadline,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  cost,
  capacity,
  spotsLeft,
  faculty,
  resources,
  funding,
  budget,
  professors,
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
      icon: <AttachMoney sx={{ color: '#F9A826' }} />,
      label: "Cost",
      value: cost,
      customColor: '#F9A826'
    },
    {
      icon: <Person sx={{ color: '#6e8ae6' }} />,
      label: "Capacity",
      value: `${spotsLeft} / ${capacity} spots available`,
      customColor: "#6e8ae6"
    },
    {
      icon: <School sx={{ color: '#9c27b0' }} />,
      label: "Faculty",
      value: faculty,
      customColor: "#9c27b0"
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

  // Function to generate avatar color based on name
  const stringToColor = (string: string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <CardContent sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Event Details Grid */}
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
        {/* Professors Section */}
        <Grid size={{ xs:12 }}>
          <Box sx={{ mt: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Typography variant="h6" sx={{ 
                color: 'text.primary', 
                fontWeight: 600
              }}>
                Workshop Professors
              </Typography>
              {professors?.length > 0 && (
                <Chip 
                  icon={<School />}
                  label={`${professors.length} Professor${professors.length !== 1 ? 's' : ''}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              )}
            </Box>
            
            <Grid container spacing={2}>
              {professors?.map((professor, index) => (
                <Grid size={{ xs:12, md:6, sm:6 }} key={index}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'white',
                      boxShadow: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                        bgcolor: 'primary.50'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        mr: 2,
                        bgcolor: stringToColor(professor),
                        width: 50,
                        height: 50,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {professor.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="medium"
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {professor}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Professor
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default WorkshopDetails;