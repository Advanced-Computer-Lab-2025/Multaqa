"use client";
import React, { useState } from 'react';
import { Box, Typography, Stack, Skeleton, Chip, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import theme from '@/themes/lightTheme';
import { toast } from 'react-toastify';
import EmptyState from '@/components/shared/states/EmptyState';
import { grey } from '@mui/material/colors';
import BugReportCard, { BugReport } from './BugReport';
import ExportReportsButton from './ExportReportsButton';

// Dummy data
const dummyBugReports: BugReport[] = [
  {
    id: '1',
    title: 'Login form validation not working on mobile',
    stepsToReproduce: '1. Open the app on mobile browser (Chrome/Safari)\n2. Navigate to login page\n3. Try to submit form with empty fields\n4. No validation errors appear',
    expectedResult: 'Form should show validation errors when required fields are empty',
    actualResult: 'Form submits without validation, causing server error',
    environment: 'Mobile Chrome 118, iOS 17.1, iPhone 14 Pro',
    status: 'pending',
    submittedAt: '2024-12-05T10:30:00Z',
    reportedBy: 'John Doe',
  },
  {
    id: '2',
    title: 'Event card images not loading on slow connections',
    stepsToReproduce: '1. Throttle network to Slow 3G in DevTools\n2. Navigate to events page\n3. Scroll through event cards\n4. Images fail to load or take very long',
    expectedResult: 'Images should load with progressive enhancement or show placeholder',
    actualResult: 'Broken image icons appear, cards look incomplete',
    environment: 'Desktop Chrome 119, Windows 11, Slow 3G network',
    status: 'resolved',
    submittedAt: '2024-12-04T14:20:00Z',
    reportedBy: 'Sarah Smith',
  },
  {
    id: '3',
    title: 'Workshop registration deadline shows wrong timezone',
    stepsToReproduce: '1. View workshop details\n2. Check registration deadline\n3. Compare with server time\n4. Timezone is not converted to user local time',
    expectedResult: 'Deadline should display in user\'s local timezone',
    actualResult: 'Shows UTC time causing confusion for users',
    environment: 'Firefox 120, macOS Sonoma 14.1',
    status: 'pending',
    submittedAt: '2024-12-03T09:15:00Z',
    reportedBy: 'Mike Johnson',
  },
  {
    id: '4',
    title: 'Filter panel state not persisting after page navigation',
    stepsToReproduce: '1. Apply filters on events page\n2. Click on an event to view details\n3. Navigate back to events page\n4. All filters are reset to default',
    expectedResult: 'Filter selections should be preserved when navigating back',
    actualResult: 'User has to reapply all filters every time',
    environment: 'Safari 17, iPad Pro, iPadOS 17',
    status: 'pending',
    submittedAt: '2024-12-02T16:45:00Z',
    reportedBy: 'Emily Chen',
  },
  {
    id: '5',
    title: 'Toast notifications overlapping with bottom navigation',
    stepsToReproduce: '1. Trigger success/error toast on mobile\n2. Toast appears at bottom-right\n3. Bottom navigation bar covers part of the toast',
    expectedResult: 'Toast should appear above bottom navigation with proper spacing',
    actualResult: 'Toast is partially hidden behind navigation bar',
    environment: 'Chrome 118, Android 14, Samsung Galaxy S23',
    status: 'resolved',
    submittedAt: '2024-12-01T11:30:00Z',
    reportedBy: 'Alex Rivera',
  },
];

const BugReports = () => {
  const [loading, setLoading] = useState(false);
  const [bugReports] = useState<BugReport[]>(dummyBugReports);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const accentColor = theme.palette.tertiary.main;

  // Filter colors
  const filterColors = {
    all: "#6299d0",
    pending: "#f59e0b",
    resolved: "#10b981",
  };

  // Filter chips configuration
  const filterChips: Array<{ key: 'all' | 'pending' | 'resolved'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'resolved', label: 'Resolved' },
  ];

  // Filter and sort bug reports - pending first, then resolved
  const filteredBugReports = bugReports
    .filter((bug) => {
      if (statusFilter === 'all') return true;
      return bug.status === statusFilter;
    })
    .sort((a, b) => {
      // If both have same status, maintain original order
      if (a.status === b.status) return 0;
      // Pending comes before resolved
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
      return 0;
    });

  const handleResolve = async (bugId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Bug marked as resolved successfully', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Loading skeleton
  if (loading) {
    return (
      <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
        <Stack spacing={2} sx={{ mb: 4 }}>
          <Skeleton variant="text" width="300px" height={48} />
          <Skeleton variant="text" width="500px" height={24} />
        </Stack>
        <Stack spacing={2.5}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                p: 3,
              }}
            >
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Skeleton variant="circular" width={56} height={56} />
                <Stack spacing={1} sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Stack direction="row" spacing={1}>
                    <Skeleton variant="rounded" width={100} height={24} />
                    <Skeleton variant="rounded" width={150} height={24} />
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Skeleton variant="rounded" width={40} height={40} />
                  <Skeleton variant="rounded" width={150} height={40} />
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }

  // Empty state - no bug reports at all
  if (bugReports.length === 0) {
    return (
      <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: accentColor }}>
            View Bug Reports
          </Typography>
          <Typography variant="body1" sx={{ color: grey[600] }}>
            View bug reports and mark as resolved when the issue has been solved
          </Typography>
        </Stack>
        <EmptyState
          title="No bug reports found"
          description="There are no bug reports to display at the moment."
        />
      </Box>
    );
  }

  // Empty state - filtered results
  const hasFilteredResults = filteredBugReports.length === 0 && bugReports.length > 0;

  return (
    <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: accentColor }}>
          View Bug Reports
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          View bug reports and mark as resolved when the issue has been solved
        </Typography>
      </Stack>

      {/* Status Filter Chips and Export Button */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ 
          flexWrap: 'wrap', 
          mb: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {filterChips.map(({ key, label }) => {
            const isActive = statusFilter === key;
            const baseColor = filterColors[key];

            return (
              <Chip
                key={key}
                label={label}
                size="medium"
                onClick={() => setStatusFilter(key)}
                variant="outlined"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: isActive ? 600 : 500,
                  borderRadius: '28px',
                  px: 1.75,
                  height: 28,
                  borderWidth: isActive ? 1.5 : 1,
                  borderColor: baseColor,
                  color: baseColor,
                  backgroundColor: alpha(baseColor, isActive ? 0.1 : 0.06),
                  boxShadow: isActive
                    ? `0 4px 10px ${alpha(baseColor, 0.18)}`
                    : `0 1px 2px ${alpha(baseColor, 0.15)}`,
                  transition:
                    'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              />
            );
          })}
        </Stack>
        
        <ExportReportsButton onClick={() => { /* Add export logic here */ }} isLoading={loading}/>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Bug Report Cards or Empty State */}
      {hasFilteredResults ? (
        <EmptyState
          title="No bug reports match the selected filter"
          description="Try selecting a different status filter to view more bug reports."
        />
      ) : (
        <Stack spacing={2.5}>
          {filteredBugReports.map((bug) => (
            <BugReportCard
              key={bug.id}
              bug={bug}
              accentColor={accentColor}
              onResolve={handleResolve}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BugReports;
