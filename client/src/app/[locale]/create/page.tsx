// AppPage.tsx
"use client";
import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import CreateParent from '../../../components/createButton/createParent';
import theme from "../../../themes/lightTheme"; 

const AppPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center',

          backgroundColor: '#f4f7f9', 
        }}
      >
        <CreateParent />
      </Box>
    </ThemeProvider>
  );
};

export default AppPage;