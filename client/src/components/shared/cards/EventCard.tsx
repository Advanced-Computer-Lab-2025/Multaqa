import React, { useState } from 'react';
import { Box, Typography, IconButton, Chip, Tooltip } from '@mui/material';
import { ChevronDown, ChevronUp, Calendar, Clock, MapPin, Check, Copy, Wallet, ExternalLink} from 'lucide-react';
import PaymentIcon from '@mui/icons-material/Payment';
import theme from '@/themes/lightTheme';
import CustomModalLayout from '../modals/CustomModalLayout';
import EventTypeDetails from '../../Event/Modals/EventTypeDetails';

interface EventCardProps {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?:string;
  duration?:string;
  spotsLeft?: string;
  link?:string;
  cost?:string;
  totalSpots?: string;
  color?: string;
  eventType: string;
  leftIcon?: React.ReactNode;
  utilities?: React.ReactNode;
  registerButton?: React.ReactNode;
  onExpandChange?: (expanded: boolean) => void;
  onOpenDetails?: () => void;
  expanded?: boolean;
  details?: Record<string, any>;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  link,
  cost,
  duration,
  spotsLeft,
  totalSpots,
  color = '#6366F1', // Default indigo color
  leftIcon,
  utilities,
  registerButton,
  onExpandChange,
  onOpenDetails,
  eventType,
  expanded = false,
  details,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const spots = spotsLeft&&parseInt(spotsLeft)||0;
  const [copySuccess, setCopySuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (onOpenDetails) {
      onOpenDetails();
    }
  };

  const handleCopyLink = () => {
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };
  const handleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: `${color}30`,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight:220,
        maxHeight:220,
        '&:hover': {
          borderColor: color,
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 24px ${color}15`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color}, ${color}90)`,
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          borderBottom: isExpanded ? `1px solid ${color}20` : 'none',
        }}
      >
        {/* Left Icon */}
        {leftIcon && (
          <Box
            sx={{
              backgroundColor: `${color}10`,
              color: color,
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              border: '1px solid',
              borderColor: `${color}30`,
              '&:hover': {
                backgroundColor: `${color}15`,
                borderColor: color,
              },
            }}
          >
            {leftIcon}
          </Box>
        )}

        {/* Content Section */}
        <Box sx={{ flex: 1 }}>
          {/* Top Row - Event Type and Spots/Utilities */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 1 
          }}>
            <Chip
              label={eventType}
              size="small"
              sx={{
                backgroundColor: `${color}08`,
                color: color,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 20,
                border: `1px solid ${color}40`,
                '&:hover': {
                  backgroundColor: `${color}15`,
                },
              }}
            />
            
            {/* Show spots in top right if register button exists, show utilities if they exist */}
            {/* Utilities and Expand Button Group */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ml: 'auto' }}>
                {registerButton ? (
                  spotsLeft !== undefined && totalSpots && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        py: 0.5,
                        px: 1.2,
                        borderRadius: '20px',
                        backgroundColor: spots > 0 ? `${color}08` : 'error.lighter',
                        border: '1px solid',
                        borderColor: spots > 0 ? `${color}30` : 'error.light',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: spots > 0 ? color : 'error.main',
                          fontSize: '0.75rem',
                          lineHeight: 1,
                        }}
                      >
                        {spots} {spots === 1 ? 'spot' : 'spots'} left
                      </Typography>
                    </Box>
                  )
                ) : (
                  utilities && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {utilities}
                    </Box>
                  )
                )}
                 <Tooltip title ={"More Info"}>
                <Box
                  onClick={handleOpenModal}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: `${color}15`,
                      borderColor: color,
                      color:color
                    },
                  }}
                >
                  <ExternalLink size={18} />
                </Box>
                </Tooltip>
              </Box>
              {details && (
                <IconButton
                  size="small"
                  onClick={handleExpand}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: `${color}10`,
                      borderColor: color,
                    },
                  }}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Title Row */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '1.1rem',
              mb: 1.5,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>

          {/* Date, Time, and Location Info */}
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {startDate&&endDate&& <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calendar size={16} color={color} />
              <Typography
                variant="body2"
                sx={{
                  color: color,
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {startDate === endDate ? startDate : `${startDate} - ${endDate}`}
              </Typography>
            </Box>}
            
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {startTime&&endTime&&<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} color={color} />
                <Typography
                  variant="body2"
                  sx={{ 
                    color: color,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  {`${startTime} - ${endTime}`}
                </Typography>
              </Box>} 

              {/* Show register button if it exists */}
              {!utilities && registerButton && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {registerButton}
                </Box>
              )}
            </Box>
            
            {/* Location Row */}
           {location && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MapPin size={16} color={color} />
              <Typography
                variant="body2"
                sx={{ 
                  color: color,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {location}
              </Typography>
            </Box>} 
              {duration && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={16} color={color} />
              <Typography
                variant="body2"
                sx={{ 
                  color: color,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {duration} weeks
              </Typography>
            </Box>} 

            {link&& <Box
                    key="link"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                    }}
                  >
                      <IconButton
                      size="small"
                      onClick={handleCopyLink}
                      sx={{
                        padding: 0.25,
                        "&:hover": {
                          backgroundColor: theme.palette.primary.light + "20",
                        },
                      }}
                    >
                      {copySuccess ? (
                        <Check size={14} color="green" />
                      ) : (
                        <Copy size={14} color="#6b7280" />
                      )}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.primary",
                        textDecoration: "underline",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: color,
                        },
                      }}
                      onClick={() => window.open(link, "_blank")}
                    >
                      {link}
                    </Typography>
                  </Box>}
                  {cost&& <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>  
                  <Wallet size={16} color={color} />
                  <Typography
                    variant="body2"
                    sx={{ 
                      color: color,
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {cost}
                  </Typography>
                </Box>
                  }
                  {/* Spots left at the bottom */}
                  {utilities && spotsLeft !== undefined && totalSpots && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%',
                        mt: .5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          py: 0.5,
                          px: 1.2,
                          borderRadius: '6px',
                          backgroundColor: spots > 0 ? `${color}08` : 'error.lighter',
                          border: '1px solid',
                          borderColor: spots > 0 ? `${color}30` : 'error.light',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color: spots > 3 ? color : 'error.main',
                            fontSize: '0.9rem',
                            lineHeight: 1,
                          }}
                        >
                          {spots} {spots === 1 ? 'spot' : 'spots'} left
                        </Typography>
                      </Box>
                    </Box>
                  )}
          </Box>
        </Box>

      </Box>


    </Box>
  );
};

export default EventCard;