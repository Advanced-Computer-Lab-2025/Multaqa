import React from 'react';
import { Box, Typography } from '@mui/material';
import { CustomModalLayout } from '@/components/shared/modals';
import theme from '@/themes/lightTheme';
import { BugReport } from './BugReport';

interface BugReportDetailsProps {
  open: boolean;
  onClose: () => void;
  bug: BugReport;
  accentColor: string;
}

const BugReportDetails: React.FC<BugReportDetailsProps> = ({
  open,
  onClose,
  bug,
  accentColor,
}) => {
  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Bug Report Details"
      width="w-[95vw] md:w-[80vw] lg:w-[70vw]"
      borderColor={accentColor}
    >
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, paddingBottom: '4px' }}>
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
              '&:hover': { width: '100%' },
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
          {bug.title}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, paddingBottom: '4px' }}>
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
              '&:hover': { width: '100%' },
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
          {bug.stepsToReproduce}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, paddingBottom: '4px' }}>
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
              '&:hover': { width: '100%' },
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
          {bug.expectedResult}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, paddingBottom: '4px' }}>
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
              '&:hover': { width: '100%' },
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
          {bug.actualResult}
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 1, mt: 2 }}>
          <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary, paddingBottom: '4px' }}>
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
              '&:hover': { width: '100%' },
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
          {bug.environment}
        </Typography>
      </Box>
    </CustomModalLayout>
  );
};

export default BugReportDetails;
