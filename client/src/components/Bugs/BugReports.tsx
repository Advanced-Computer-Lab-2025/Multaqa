"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Stack, Skeleton, Chip, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import theme from '@/themes/lightTheme';
import { toast } from 'react-toastify';
import EmptyState from '@/components/shared/states/EmptyState';
import { grey } from '@mui/material/colors';
import BugReportCard, { BugReport } from './BugReport';
import ExportReportsButton from './ExportReportsButton';
import { api } from "../../api";

const BugReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  const accentColor = theme.palette.tertiary.main;

  // Map API response to BugReport interface
  const mapApiBugReportToComponent = (apiBug: any): BugReport => {
    // Format the reportedBy field from the populated user object
    const formatReportedBy = (createdBy: any): string => {
      if (!createdBy) return 'Unknown';
      if (typeof createdBy === 'string') return createdBy;
      if (createdBy.firstName && createdBy.lastName) {
        return `${createdBy.firstName} ${createdBy.lastName}`;
      }
      return createdBy.name || createdBy.email || 'Unknown';
    };

    return {
      id: apiBug._id,
      title: apiBug.title,
      stepsToReproduce: apiBug.stepsToReproduce,
      expectedResult: apiBug.expectedBehavior,
      actualResult: apiBug.actualBehavior,
      environment: apiBug.environment,
      status: apiBug.status,
      submittedAt: apiBug.date,
      reportedBy: formatReportedBy(apiBug.createdBy),
    };
  };

  const handleLoadBugs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bugreports");
      // Extract bug reports from the API response structure { success, data, message }
      const bugsData = res.data?.data || [];
      const mappedBugs = bugsData.map(mapApiBugReportToComponent);
      setBugReports(mappedBugs);
    } catch (err: any) {
      setError(err.response.data.error || "Failed to load bug reports");
      toast.error(err.response.data.error || "Failed to load bug reports", {
        position: 'bottom-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/bugreports/export", {
        responseType: 'blob', // Important: tell axios to expect a binary response
      });
      
      // Create a blob URL and trigger download
      const blob = new Blob([res.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.download = `unresolved-bug-reports-${date}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Reports exported successfully!", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to export bug reports");
      toast.error(err.response?.data?.error || "Failed to export bug reports", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };  

  // Load bug reports on component mount
  useEffect(() => {
    handleLoadBugs();
  }, [refresh]);

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

  const handleReportExport = async () => {
    await handleExport();
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
        
        <ExportReportsButton onClick={() => handleReportExport()} isLoading={loading}/>
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
              id={bug.id}
              key={bug.id}
              bug={bug}
              accentColor={accentColor}
              setRefresh={setRefresh}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BugReports;
