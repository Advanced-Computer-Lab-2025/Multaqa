"use client";

import React from "react";
import { Box, Divider, Paper } from "@mui/material";

export type EventBoxProps = {
  sections: React.ReactNode[];
  sx?: any;
};

const EventBox: React.FC<EventBoxProps> = ({ sections, sx }) => {
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: "30px",
        p: 2,
        backgroundColor: "#fff",
        overflow: "hidden",
        ...sx,
      }}
   >
      <Box>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            <Box>{section}</Box>
            {index !== sections.length - 1 && (
              <Divider sx={{ my: 2 }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  );
};

export default EventBox;


