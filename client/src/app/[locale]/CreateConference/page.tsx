// Example usage in a main DashboardReportPage.tsx file

import { Box } from 'lucide-react';
import ReportTable from '../../../components/shared/Report/reportTable';
import { Typography } from '@mui/material';

const DashboardReportPage = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>Reports Dashboard</Typography>
            
            {/* Requirement 1: Total Attendees */}
            <ReportTable reportType="attendees" /> 

            {/* Requirement 2: Sales/Revenue */}
            <ReportTable reportType="sales" /> 
        </Box>
    );
}

export default DashboardReportPage;