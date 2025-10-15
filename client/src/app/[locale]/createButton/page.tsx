// app/page.tsx (or pages/index.tsx)
"use client";
import React from 'react';
import { ThemeProvider, Box, CssBaseline,Grid } from '@mui/material';
import theme from "../../../themes/lightTheme";
import MenuOption from '../../../components/shared/CreateButton/menuOption'; 
// --- Import Icons ---
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import EventIcon from '@mui/icons-material/Event';
import PollIcon from '@mui/icons-material/Poll';

const testOptions = [
  { label: 'Gym', icon: FitnessCenterIcon },
  { label: 'Bazaars', icon: StorefrontIcon },
  { label: 'Trips', icon: FlightTakeoffIcon },
  { label: 'Conference', icon: EventIcon },
  { label: 'Polls', icon: PollIcon },
];

export default function MenuOptionTestPage() {
  const handleTestClick = (label: string) => {
    console.log(`Clicked: ${label}`);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh', 
          backgroundColor: theme.palette.background.default,
          p: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      > 
        <Box 
          sx={{
            padding:3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            maxWidth: '210px',
            width: '100%', 
          }}
        >
          <Grid container spacing={2}>
            {testOptions.map((option) => (
              <Grid item xs={4} key={option.label} {...{ component: 'div' } as any} >
                <MenuOption
                  label={option.label}
                  icon={option.icon}
                  onClick={() => handleTestClick(option.label)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}