import React from 'react';
import { Box, Skeleton } from '@mui/material'; // Removed Paper, using Box for flexibility

/**
 * Renders a compact skeleton placeholder for a single review card,
 * designed to fit within a smaller height (e.g., ~120px).
 */
const ReviewSkeleton: React.FC = () => {
  return (
    <Box
      sx={{
        // --- Matched "ready" card styles ---
        mb: 2, // Reduced margin between skeletons
        p: 2, // Padding
        borderRadius: 2,
        backgroundColor: 'background.paper',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: "1px solid rgba(0,0,0,0.07)",
        
        // --- Fixed Height for the skeleton card ---
        height: '120px', // Target height for the entire card
        overflow: 'hidden', // Crucial to prevent content overflow
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Distribute content vertically
        // ---
      }}
    >
      {/* Top section: Avatar + Text Block */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0}}> {/* Reduced gap, ensure it doesn't shrink */}
        
        {/* Circular Avatar Skeleton */}
        <Skeleton 
          variant="circular" 
          width={32} // Smaller avatar
          height={32} 
        />
        
        {/* Name, Rating, Date Block */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Name Skeleton */}
          <Skeleton 
            variant="text" 
            width="80%" // Relative width
            sx={{ fontSize: '0.8rem', height: '1.2rem', mb: 0.2 }} // Smaller font size, precise height
          />
          {/* Rating Skeleton */}
          <Skeleton 
            variant="text" 
            width="60%" // Relative width
            sx={{ height: 16, my: 0.2 }} // Smaller height for rating
          />
        </Box>
      </Box>
      
      {/* Comment & Date Block */}
      <Box sx={{ ml: '44px', mt: 0.5, flexGrow: 1, minHeight: 0}}> {/* ml: 44px (32px avatar + 12px gap) */}
         {/* Date Skeleton */}
        <Skeleton 
          variant="text" 
          width="60px" 
          sx={{ fontSize: '0.7rem', height: '1rem', mb: 0.5 }} // Smaller font size, precise height
        />
        {/* Comment Skeleton */}
        <Skeleton variant="text" width="95%" sx={{ fontSize: '0.75rem', height: '1.1rem' }} /> {/* Smaller font size, precise height */}
        <Skeleton variant="text" width="75%" sx={{ fontSize: '0.75rem', height: '1.1rem' }} />
      </Box>
    </Box>
  );
};

/**
 * A component to render a list of review skeletons.
 * Pass the `count` prop to control how many skeletons to show.
 */
interface ReviewSkeletonListProps {
  count?: number;
}

export const ReviewSkeletonList: React.FC<ReviewSkeletonListProps> = ({ count = 3 }) => {
  return (
    <Box>
      {Array.from(new Array(count)).map((_, index) => (
        <ReviewSkeleton key={index} />
      ))}
    </Box>
  );
};