import React from 'react';
import { 
  Box, 
  Typography, 
  Grid as MuiGrid, 
  CardContent,
  Avatar,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MapPin, Users, Mail } from 'lucide-react';
import { BoothDetails as BoothDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';
import { CalendarToday, EventAvailable, AccessTime, LocationOn, Person } from '@mui/icons-material';

const Grid = styled(MuiGrid)``;

const BoothDetails: React.FC<BoothDetailsType> = ({
  color,
  location,
  boothSize,
  setupDuration,
  people
}) => {
  const detailItems = [
    {
      icon: <LocationOn sx={{ color: '#4CAF50' }} />,
      label: "Location",
      value: location,
      customColor: '#4CAF50'
    },
    {
      icon: <EventAvailable sx={{ color: "#9c27b0" }} />,
      label: "Booth Size",
      value: boothSize,
      customColor: "#9c27b0"
    },
    {
      icon: <AccessTime sx={{ color: '#FF6B35' }} />,
      label: "Setup Duration",
      value: setupDuration,
      customColor: '#FF6B35'
    },
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
        {/* Booth Details */}
        {detailItems.map((item, index) => (
          <Grid size={{ xs:12, md:4 }} key={index}>
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

        {/* People Section - Full Width */}
        <Grid size={{ xs:12 }}>
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              background: `${color}15`,
              border: `2px solid' ${color}`,
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  mr: 2
                }}
              >
                <Users size={24} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Booth Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {people.length} team member{people.length !== 1 ? 's' : ''} managing this booth
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {people.map((person, index) => (
                <Grid size={{ xs:12, md:6 , sm:6 }} key={index}>
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
                        bgcolor: stringToColor(person.name),
                        width: 50,
                        height: 50,
                        fontSize: '1.1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                        {person.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Mail size={14} color="#666" style={{ marginRight: 4 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {person.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Team Summary Chip */}
            {people.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Chip 
                  icon={<Person />}
                  label={`${people.length} Team Member${people.length !== 1 ? 's' : ''}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default BoothDetails;