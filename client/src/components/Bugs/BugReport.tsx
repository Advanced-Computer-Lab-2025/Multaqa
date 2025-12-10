"use client";
import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Avatar,
  Typography,
  Chip,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Bug,
  CheckCircle,
  Eye,
  Download,
  Calendar,
  Mail,
} from 'lucide-react';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import BugReportDetails from './BugReportDetails';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

// TypeScript interface for Bug Report
export interface BugReport {
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

interface BugReportProps {
  bug: BugReport;
  accentColor: string;
  onResolve?: (bugId: string) => Promise<void>;
}

const BugReportCard: React.FC<BugReportProps> = ({ bug, accentColor, onResolve }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [resolving, setResolving] = useState(false);

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

  const handleViewMore = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDownloadReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 20;

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
      doc.line(margin, yPosition, margin + 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.title, margin, yPosition, contentWidth);
      yPosition += 10;

      // Steps to Reproduce
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Steps to Reproduce:', margin, yPosition);
      yPosition += 3;
      doc.line(margin, yPosition, margin + 50, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.stepsToReproduce, margin, yPosition, contentWidth);
      yPosition += 10;

      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Expected Result
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Expected Result:', margin, yPosition);
      yPosition += 3;
      doc.line(margin, yPosition, margin + 45, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.expectedResult, margin, yPosition, contentWidth);
      yPosition += 10;

      // Actual Result
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Actual Result:', margin, yPosition);
      yPosition += 3;
      doc.line(margin, yPosition, margin + 40, yPosition);
      yPosition += 7;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      yPosition = addWrappedText(bug.actualResult, margin, yPosition, contentWidth);
      yPosition += 10;

      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Environment
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text('Environment:', margin, yPosition);
      yPosition += 3;
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

  const handleMarkResolved = async () => {
    setResolving(true);
    
    if (onResolve) {
      await onResolve(bug.id);
    } else {
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
    }
    
    setResolving(false);
  };

  return (
    <>
      <Paper
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
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>•</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Reported by {bug.reportedBy}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Inform Developer">
              <Box
                onClick={() => {}}
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
                <Mail size={18} />
              </Box>
            </Tooltip>
            <Tooltip title="View Details">
              <Box
                onClick={handleViewMore}
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

            <Tooltip title="Download Report">
              <Box
                onClick={handleDownloadReport}
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

            {bug.status === 'pending' && (
              <CustomButton
                variant="contained"
                color="success"
                size="small"
                startIcon={<CheckCircle size={16} />}
                onClick={handleMarkResolved}
                disabled={resolving}
                label={resolving ? 'Resolving...' : 'Mark as Resolved'}
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

      <BugReportDetails
        open={modalOpen}
        onClose={handleCloseModal}
        bug={bug}
        accentColor={accentColor}
      />
    </>
  );
};

export default BugReportCard;
