import React from 'react';
import { Box, Typography, Grid as MuiGrid, Chip, CardContent, Avatar, Divider, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Clock, Group, Mail } from 'lucide-react';
import { BazaarDetails as BazaarDetailsType } from '../types/eventDetails.types';
import { SectionTitle, IconWrapper } from './shared/StyledComponents';
import { CalendarToday, EventAvailable, AccessTime, LocationOn, AttachMoney, Person } from '@mui/icons-material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { useState } from 'react';
import { handleGenerateQR } from '../utils/index';

const Grid = styled(MuiGrid)``;

const BazaarDetails: React.FC<BazaarDetailsType> = ({
  color,
  registrationDeadline,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  vendors,
  userRole,
  eventId
}) => {
  console.log(vendors);
  const [isGenerating, setIsGenerating] = useState(false);

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
        customColor: "#6e8ae6"
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
          <Divider sx={{ width: '100%', mb: 3, mt: 5 }} />
            <Grid container spacing={2} >
              <Grid size={{ xs:12 , md:12}}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                 {(vendors.filter(vendor => vendor !== null).length>0)&&<Typography variant="h6" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 600,
                    mb:3
                  }}>
                    Participating Vendors
                  </Typography>
                  }
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 ,mb:3}}>
                    {vendors?.filter(vendor => vendor !== null).length > 0 && (
                      <Chip 
                        icon={<Person />}
                        label={`${vendors.filter(vendor => vendor !== null).length} Vendor${vendors.filter(vendor => vendor !== null).length !== 1 ? 's' : ''}`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 'medium',
                          height: 35
                         }}
                      />
                    )}
                    {vendors?.filter(vendor => vendor !== null).length > 0 &&
                    userRole === "events-office" && (
                      <Tooltip title="Generate QR code and email it to participating vendors" arrow>
                        <span>
                          <CustomButton
                            onClick={() => handleGenerateQR(setIsGenerating, eventId)}
                            variant="outlined"
                            width="auto"
                            startIcon={<QrCode2Icon/>}
                            loading={isGenerating}
                            disabled={isGenerating}
                            sx={{paddingLeft:2, paddingRight:2}}
                          >
                            {isGenerating ? "Emailing QR Code..." : "Generate QR Code"}
                          </CustomButton>
                        </span>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Grid>
              
              {vendors?.filter(vendor => vendor !== null).map((vendor, index) => (
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
                // 💡 FIX: Check if vendor.logo exists AND if vendor.logo.url exists
                src={vendor.logo?.url || undefined} 
                sx={{ 
                    mr: 2,
                    // Apply color only if there's no logo URL (Avatar will show children)
                    bgcolor: vendor.logo?.url ? 'transparent' : stringToColor(vendor.companyName),
                    width: 50,
                    height: 50,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    // Optional: Ensure the image content fits nicely
                    '& img': {
                        objectFit: 'contain', 
                    }
                }}
            >
                {/* Fallback initials displayed only if src (vendor.logo.url) is not provided */}
                {!vendor.logo?.url && vendor.companyName.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                        {vendor.companyName}
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
                          {vendor.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

        </Grid>
      </CardContent>
  );
};

export default BazaarDetails;