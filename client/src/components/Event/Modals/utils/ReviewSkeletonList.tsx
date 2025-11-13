import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';

/**
 * Renders a skeleton placeholder for a single review card,
 * matching the layout from your screenshot.
 */
const ReviewSkeleton: React.FC = () => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'grey.200' ,
      }}
    >
      {/* Top section: Avatar + Name/Rating */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
        {/* Circular Avatar Skeleton */}
        <Skeleton 
          variant="circular" 
          width={40} 
          height={40} 
          sx={{ mr: 2, mt: 0.5 }} 
        />
        
        {/* Name and Rating Block */}
        <Box sx={{ flex: 1 }}>
          {/* Name Skeleton */}
          <Skeleton 
            variant="text" 
            width="120px" 
            sx={{ fontSize: '1.1rem' }} 
          />
          {/* Rating Skeleton */}
          <Skeleton 
            variant="text" 
            width="100px" 
            sx={{ fontSize: '0.9rem' }} 
          />
        </Box>
      </Box>

      {/* Date Skeleton */}
      <Skeleton 
        variant="text" 
        width="80px" 
        sx={{ fontSize: '0.8rem', mb: 1.5, ml: '56px' }} // 40px avatar + 16px margin
      />

      {/* Comment Skeleton */}
      <Box sx={{ ml: '56px' }}> {/* Aligns with text block above */}
        <Skeleton variant="text" width="90%" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="text" width="70%" sx={{ fontSize: '1rem' }} />
      </Box>
    </Paper>
  );
};

/**
 * A component to render a list of review skeletons.
 * Pass the `count` prop to control how many skeletons to show.
 */
interface ReviewSkeletonListProps {
  count?: number;
}

export const ReviewSkeletonList: React.FC<ReviewSkeletonListProps> = ({ count = 2 }) => {
  return (
    <Box>
      {Array.from(new Array(count)).map((_, index) => (
        <ReviewSkeleton key={index} />
      ))}
    </Box>
  );
};