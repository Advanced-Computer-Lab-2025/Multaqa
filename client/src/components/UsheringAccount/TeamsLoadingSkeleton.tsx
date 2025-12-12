import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

const TeamsLoadingSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid size={{ xs: 12, md: 6 }} key={item}>
          <Card
            sx={{
              display: 'flex',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: '100%',
              minHeight: '160px',
            }}
          >
            {/* Logo Skeleton */}
            <Box
              sx={{
                width: '120px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                p: 2,
              }}
            >
              <Skeleton variant="circular" width={40} height={40} />
            </Box>

            {/* Content Skeleton */}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, width: '100%' }}>
              <Box sx={{ mb: 1 }}>
                <Skeleton variant="text" width="60%" height={32} />
              </Box>
              <Box>
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="85%" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamsLoadingSkeleton;
