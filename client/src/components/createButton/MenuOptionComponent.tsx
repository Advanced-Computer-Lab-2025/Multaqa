// app/page.tsx (or pages/index.tsx)
"use client";
import React, { Dispatch, SetStateAction } from 'react';
import { ThemeProvider, Box, CssBaseline, Grid, Typography } from '@mui/material';
import theme from "../../themes/lightTheme";
import MenuOption from '../shared/CreateButton/menuOption';
import { SvgIconComponent } from '@mui/icons-material';
// --- Import Icons ---

// Define the shape of each option
interface MenuOption {
  label: string;
  icon: SvgIconComponent;
}


// Define the props shape
interface MenuOptionTestPageProps {
  options: MenuOption[];
  setters: Dispatch<SetStateAction<boolean>>[];
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuOptionComponent: React.FC<MenuOptionTestPageProps> = ({ options, setters }) => {
  const handleTestClick = (label: string) => {
    console.log(`Clicked: ${label}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          padding: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          maxWidth: '210px',
          width: '100%',
        }}
      >
        <Typography variant="h6" color="tertiary" sx={{ fontSize: "14px", fontFamily: "var(--font-poppins), system-ui, sans-serif", mb: 2 }}>
          Create New
        </Typography>
        <Grid container spacing={2}>
          {options.map((option, index) => (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Grid item xs={4} key={option.label} {...{ component: 'div' } as any} >
              <MenuOption
                label={option.label}
                icon={option.icon}
                onClick={() => setters[index](true)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
export default MenuOptionComponent;