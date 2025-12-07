"use client";
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Tooltip,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  Bug,
  CheckCircle,
  Eye,
  Download,
  Calendar,
} from 'lucide-react';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { CustomModalLayout } from '@/components/shared/modals';
import theme from '@/themes/lightTheme';
import { toast } from 'react-toastify';
import EmptyState from '@/components/shared/states/EmptyState';
import { grey } from '@mui/material/colors';
import { jsPDF } from 'jspdf';

// TypeScript interface for Bug Report
interface BugReport {
  id: string;
  title: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  environment: string;
  status: 'pending' | 'resolved';
  submittedAt: string;
  reportedBy: string;
}

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
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resolving, setResolving] = useState<string | null>(null);

  const accentColor = theme.palette.tertiary.main;

  const handleViewMore = (bug: BugReport) => {
    setSelectedBug(bug);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedBug(null), 300);
  };

  const handleDownloadReport = (bug: BugReport) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 20;

      // Helper function to add wrapped text and return new Y position
      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 7): number => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
      };

      // Title
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text('Bug Report Details', margin, yPosition);
      yPosition += 10;

      // Underline for title
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, margin + 60, yPosition);
      yPosition += 15;

      // Status, Date, Reporter info
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const statusText = bug.status === 'pending' ? 'Pending' : 'Resolved';
      doc.text(`Status: ${statusText}    |    Submitted: ${formatDate(bug.submittedAt)}    |    Reported by: ${bug.reportedBy}`, margin, yPosition);
      yPosition += 15;

      // Title Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Title:', margin, yPosition);
      yPosition += 3;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPosition, margin + 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.title, margin, yPosition, contentWidth);
      yPosition += 10;

      // Steps to Reproduce Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Steps to Reproduce:', margin, yPosition);
      yPosition += 3;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPosition, margin + 50, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.stepsToReproduce, margin, yPosition, contentWidth);
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Expected Result Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Expected Result:', margin, yPosition);
      yPosition += 3;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPosition, margin + 45, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.expectedResult, margin, yPosition, contentWidth);
      yPosition += 10;

      // Actual Result Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Actual Result:', margin, yPosition);
      yPosition += 3;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPosition, margin + 40, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.actualResult, margin, yPosition, contentWidth);
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Environment Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Environment:', margin, yPosition);
      yPosition += 3;
      doc.setDrawColor(100, 100, 100);
      doc.line(margin, yPosition, margin + 35, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.environment, margin, yPosition, contentWidth);
      yPosition += 20;

      // Footer
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;
      
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, yPosition);

      // Save the PDF
      doc.save(`bug-report-${bug.id}-${new Date().getTime()}.pdf`);

      toast.success(`Bug report downloaded successfully: ${bug.title}`, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  const handleMarkResolved = async (bugId: string) => {
    setResolving(bugId);
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
    
    setResolving(null);
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

  // Empty state
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

      {/* Bug Report Cards */}
      <Stack spacing={2.5}>
        {bugReports.map((bug) => (
          <Paper
            key={bug.id}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: '#e5e7eb',
              borderRadius: '12px',
              background: '#ffffff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderColor: accentColor,
              },
            }}
          >
            <Stack direction="row" spacing={2.5} sx={{ p: 3 }} alignItems="center">
              {/* Bug Icon Avatar */}
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                <Bug size={28} />
              </Avatar>

              {/* Bug Info */}
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {bug.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip
                    label={bug.status === 'pending' ? 'Pending' : 'Resolved'}
                    size="small"
                    sx={{
                      bgcolor: bug.status === 'pending' ? '#fffbeb' : '#f0fdf4',
                      color: bug.status === 'pending' ? '#b45309' : '#15803d',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      borderRadius: '6px',
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={14} color="#6b7280" />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {formatDate(bug.submittedAt)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    •
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Reported by {bug.reportedBy}
                  </Typography>
                </Stack>
              </Stack>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1} alignItems="center">
                {/* View More */}
                <Tooltip title="View Details">
                  <Box
                    onClick={() => handleViewMore(bug)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: `${accentColor}15`,
                        borderColor: accentColor,
                        color: accentColor,
                      },
                    }}
                  >
                    <Eye size={18} />
                  </Box>
                </Tooltip>

                {/* Download Report */}
                <Tooltip title="Download Report">
                  <Box
                    onClick={() => handleDownloadReport(bug)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: `${accentColor}15`,
                        borderColor: accentColor,
                        color: accentColor,
                      },
                    }}
                  >
                    <Download size={18} />
                  </Box>
                </Tooltip>

                {/* Mark as Resolved Button */}
                {bug.status === 'pending' && (
                  <CustomButton
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckCircle size={16} />}
                    onClick={() => handleMarkResolved(bug.id)}
                    disabled={resolving === bug.id}
                    label={resolving === bug.id ? 'Resolving...' : 'Mark as Resolved'}
                    sx={{
                      minWidth: 160,
                      height: 40,
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Bug Detail Modal */}
      {selectedBug && (
        <CustomModalLayout
          open={modalOpen}
          onClose={handleCloseModal}
          title="Bug Report Details"
          width="w-[95vw] md:w-[80vw] lg:w-[70vw]"
          borderColor={accentColor}
        >
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Title Field */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  paddingBottom: '4px',
                }}
              >
                Title:
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: '60%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor})`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease-in-out',
                  '&:hover': {
                    width: '100%',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.grey[300]}`,
                bgcolor: theme.palette.grey[50],
                mb: 2,
              }}
            >
              {selectedBug.title}
            </Typography>

            {/* Steps to Reproduce Field */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  paddingBottom: '4px',
                }}
              >
                Steps to Reproduce:
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: '40%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor})`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease-in-out',
                  '&:hover': {
                    width: '100%',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.grey[300]}`,
                bgcolor: theme.palette.grey[50],
                mb: 2,
                whiteSpace: 'pre-wrap',
                minHeight: 120,
              }}
            >
              {selectedBug.stepsToReproduce}
            </Typography>

            {/* Expected Result Field */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  paddingBottom: '4px',
                }}
              >
                Expected Result:
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: '40%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor})`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease-in-out',
                  '&:hover': {
                    width: '100%',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.grey[300]}`,
                bgcolor: theme.palette.grey[50],
                mb: 2,
                whiteSpace: 'pre-wrap',
                minHeight: 80,
              }}
            >
              {selectedBug.expectedResult}
            </Typography>

            {/* Actual Result Field */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  paddingBottom: '4px',
                }}
              >
                Actual Result:
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: '40%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor})`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease-in-out',
                  '&:hover': {
                    width: '100%',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.grey[300]}`,
                bgcolor: theme.palette.grey[50],
                mb: 2,
                whiteSpace: 'pre-wrap',
                minHeight: 80,
              }}
            >
              {selectedBug.actualResult}
            </Typography>

            {/* Environment Field */}
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  paddingBottom: '4px',
                }}
              >
                Environment:
              </Typography>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: '40%',
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor})`,
                  borderRadius: '2px',
                  transition: 'width 0.3s ease-in-out',
                  '&:hover': {
                    width: '100%',
                  },
                }}
              />
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.grey[300]}`,
                bgcolor: theme.palette.grey[50],
              }}
            >
              {selectedBug.environment}
            </Typography>
          </Box>
        </CustomModalLayout>
      )}
    </Box>
  );
};

export default BugReports;
