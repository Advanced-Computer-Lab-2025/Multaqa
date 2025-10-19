"use client";

import React from "react";
import BrowseEvents from "@/components/BrowseEvents/browse-events";
import { Box, Typography, Container } from "@mui/material";
import theme from "@/themes/lightTheme";

/**
 * Test page for BrowseEvents component
 * Accessible without authentication to test search functionality
 */
export default function TestEventsPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontFamily: "var(--font-jost), system-ui, sans-serif",
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            🧪 Event Search Test Page
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontFamily: "var(--font-poppins)",
            }}
          >
            This is a test page to verify the search functionality works
            correctly.
            <br />
            Try typing in the search bar to filter events in real-time!
          </Typography>
        </Box>

        {/* BrowseEvents component with test props */}
        <BrowseEvents registered={false} user="student" userID={undefined} />
      </Container>
    </Box>
  );
}
