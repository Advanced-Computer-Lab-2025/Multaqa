import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

// Function to generate a single event card skeleton
const EventCardSkeleton = ({ typeColor = "#e0e0e0" }) => ( // Default light grey if no color
  <Box
    sx={{
      p: 2,
      mb: 2,
      borderRadius: 2,
      border: '1px solid rgba(0,0,0,0.06)',
      background: 'white',
      position: 'relative', // For the colored icon
      overflow: 'hidden',
    }}
  >
    {/* Colored Icon at the top left */}
    {/* Main content of the card */}
    <Box sx={{ pl: 6 }}> {/* Padding to make space for the icon */}
      <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
        <Skeleton width="80%" /> {/* Event Title */}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        <Skeleton width="30%" /> {/* Event Type (e.g., Bazaar, Workshop) */}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <Skeleton width="60%" /> {/* Deadline */}
      </Typography>
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        <Skeleton width="90%" /> {/* Date Range */}
      </Typography>
      <Typography variant="body2">
        <Skeleton width="50%" /> {/* Location */}
      </Typography>
    </Box>

    {/* Bottom bar with arrow and button */}
    <Box
      sx={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1,
        px: 2,
        mt: 2,
        background: "rgba(255,255,255,0.8)",
      }}
    >
      {/* Spacer for centering */}
      <Skeleton variant="rectangular" width={60} height={36} sx={{ borderRadius: 1, visibility: 'hidden' }} />
    </Box>
  </Box>
);

// To render multiple card skeletons
export const EventCardsListSkeleton = () => (
  <Box>
    <EventCardSkeleton typeColor="#4caf50" /> {/* Example: Green for a "Trips" type */}
    <EventCardSkeleton typeColor="#9c27b0" /> {/* Example: Purple for a "Workshop" type */}
    <EventCardSkeleton typeColor="#2196f3" /> {/* Example: Blue for a "Bazaar" type */}
    {/* You can add more as needed */}
  </Box>
);