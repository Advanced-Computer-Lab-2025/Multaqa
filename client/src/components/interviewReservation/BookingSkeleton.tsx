// BookingSkeleton.tsx
import React from 'react';
import { Box, Paper, Skeleton } from '@mui/material';

const BookingSkeleton: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", py: 4, px: 4 }}>
        {/* Team Selector Skeleton */}
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                {[...Array(6)].map((_, index) => (
                    <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Skeleton variant="text" width={60} sx={{ mt: 1 }} />
                    </Box>
                ))}
            </Box>
        </Paper>

        {/* Main Content Skeleton (Calendar + Slots) */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "stretch" }}>
            {/* Calendar Skeleton (Left Panel) */}
            <Paper sx={{ flex: 1, p: 4 }}>
                <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 2, width: '50%' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 1 }} />
                </Box>
            </Paper>

            {/* Slots/Details Skeleton (Right Panel) */}
            <Paper sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
                <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 2, width: '70%' }} />
                <Box sx={{ flexGrow: 1, mb: 4 }}>
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 1.5 }} />
                    <Skeleton variant="rectangular" height={40} sx={{ mb: 1.5 }} />
                </Box>
                <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 1 }} />
            </Paper>
        </Box>
    </Box>
  );
};

export default BookingSkeleton;