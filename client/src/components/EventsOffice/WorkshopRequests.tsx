"use client";

import React, { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "./WorkshopItemCard";
import { EventType } from "../BrowseEvents/browse-events";

const demoData: any[] = [
  {
    id: "2",
    type: EventType.WORKSHOP,
    name: "React Masterclass Workshop",
    description:
      "Learn advanced React patterns and best practices in this hands-on workshop.",
    agenda:
      "Morning: Advanced hooks and state management\nAfternoon: Performance optimization and testing\nEvening: Q&A session",
    details: {
      "Start Date": "2024-03-20",
      "End Date": "2024-03-20",
      "Start Time": "10:00",
      "End Time": "16:00",
      Location: "GUC Cairo",
      "Faculty Responsible": "MET",
      "Professors Participating": "Dr. Ahmed Hassan, Dr. Sarah Mohamed",
      "Required Budget": "$5,000",
      "Funding Source": "GUC",
      "Extra Required Resources": "Laptops, projectors",
      Capacity: "30",
      "Registration Deadline": "2024-03-15",
    },
  },
  {
    id: "2",
    type: EventType.WORKSHOP,
    name: "React Masterclass Workshop",
    description:
      "Learn advanced React patterns and best practices in this hands-on workshop.",
    agenda:
      "Morning: Advanced hooks and state management\nAfternoon: Performance optimization and testing\nEvening: Q&A session",
    details: {
      "Start Date": "2024-03-20",
      "End Date": "2024-03-20",
      "Start Time": "10:00",
      "End Time": "16:00",
      Location: "GUC Cairo",
      "Faculty Responsible": "MET",
      "Professors Participating": "Dr. Ahmed Hassan, Dr. Sarah Mohamed",
      "Required Budget": "$5,000",
      "Funding Source": "GUC",
      "Extra Required Resources": "Laptops, projectors",
      Capacity: "30",
      "Registration Deadline": "2024-03-15",
    },
  },
];

interface WorkshopRequestsProps {
  setEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  setSpecificWorkshop: React.Dispatch<React.SetStateAction<string>>;
}

const WorkshopRequests: React.FC<WorkshopRequestsProps> = ({
  setEvaluating,
  setSpecificWorkshop,
}) =>  {


  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 2, textAlign: 'left', fontFamily:"var(--font-jost), system-ui, sans-serif", color:`${theme.palette.tertiary.dark}`}}>
       Workshop Requests
      </Typography>
        <Typography variant="body2" sx={{ color: "#757575", fontFamily: "var(--font-poppins)",  mb: 4 }}>
          Here are all workshop requests. Make sure to evaluate wisely.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {demoData.map((item) => (
          <WorkshopItemCard
            key={item.id}
            item={item}
            rightSlot={
              <CustomButton
                size="small"
                variant="contained"
                color="tertiary"
                onClick={() => {setEvaluating(true); setSpecificWorkshop(item.id)}}
                label="View & Evaluate"
                width="auto"
                height="32px"
              />
            }
          />
        ))}
      </Stack>
    </Box>
  );
}

export default WorkshopRequests;