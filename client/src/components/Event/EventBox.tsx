"use client";

import React from "react";
import { Box, Divider, Paper } from "@mui/material";

export type EventBoxProps = {
  sections: React.ReactNode[];
  sx?: any;
};

const EventBox: React.FC<EventBoxProps> = ({ sections, sx }) => {
  const contentSections = sections.slice(0, -1); // All sections except the last one (register button)
  const registerButton = sections[sections.length - 1]; // The last section should be the register button

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: "20px",
        backgroundColor: "#fff",
        overflow: "hidden",
        width:"100%",
        height:"90%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
   >
      <Box sx={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        p: 2,
        pb: 8, // Add bottom padding to prevent content from being hidden behind fixed button
      }}>
        {contentSections.map((section, index) => (
          <React.Fragment key={index}>
            <Box>{section}</Box>
            {index !== contentSections.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
      
      {/* Fixed register button at bottom */}
      <Box sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        p: 2,
        borderRadius: "0 0 20px 20px",
      }}>
        {registerButton}
      </Box>
    </Paper>
  );
};

export default EventBox;


