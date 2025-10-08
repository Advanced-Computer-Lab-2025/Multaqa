// app/admin/events/page.tsx or [locale]/page.tsx

import * as React from 'react';
import { Box } from '@mui/material';

// 💡 Import the main component that renders the two boxes side-by-side
import Create from '../../components/shared/CreateConference/Create'; 
// Adjust the import path as necessary based on where your Create folder is located

/**
 * Main page component for the Event Creation interface.
 * It primarily serves as a wrapper to render the Create component centered on the screen.
 */
const CreateEventPage: React.FC = () => {
  return (
    // Use a full-screen Box to provide a canvas for the centered content
    <Box 
      sx={{
        width: '100%',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content horizontally
        justifyContent: 'flex-start', // Start content from the top
        padding: 4, 
      }}
    >
      <Create />
    </Box>
  );
};

export default CreateEventPage;