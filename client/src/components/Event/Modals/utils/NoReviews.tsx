import React from 'react';
import { Box, Typography } from '@mui/material';
import { RateReviewOutlined } from '@mui/icons-material';

interface NoReviewsProps {
  // This prop will let you change the text if the user can or cannot add a review
  canAddReview: boolean;
  color?:string;
}

export const NoReviews: React.FC<NoReviewsProps> = ({ canAddReview , color='text.secondary'}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%', // Fills the scrolling container
        minHeight: '250px', // Ensures it looks good even if container is small
        p: 3,
      }}
    >
      <RateReviewOutlined 
        sx={{ 
          fontSize: 64, // Large, clean icon
          color: 'grey.400', // Muted color
          mb: 2 
        }} 
      />
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ fontWeight: 600, color: 'text.primary' }}
      >
        No Reviews Yet
      </Typography>
      <Typography variant="body2" sx={{ color: color}}>
        {canAddReview
          ? "Be the first to share your thoughts!"
          : "Check back later to see what others think."}
      </Typography>
    </Box>
  );
};