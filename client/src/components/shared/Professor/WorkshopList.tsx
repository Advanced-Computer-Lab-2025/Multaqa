"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { EventType } from "@/components/BrowseEvents/browse-events";
import { api } from "@/api";

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
    id: "3",
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

interface WorkshopListProps {
  userId: string;
}

const WorkshopList: React.FC<WorkshopListProps> = ({ userId }) => {
  const [workshops, setWorkshops] = useState(demoData);
  useEffect(() => {
    handleCallAPI()
  }, []); 
  // Handle event deletion

  async function handleCallAPI (){
    try{
      const res = await api.get(`/users/${userId}`);
      const data = res.data.data;
      //const result = frameData(data);
      // setWorkshops(data);
      console.log(data);
      }
    catch(err){
      console.error(err);
    }
 
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 2,
            textAlign: 'left',
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            color: theme.palette.tertiary.dark
          }}
        >
          Your Workshops
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            fontFamily: "var(--font-poppins)",
            mb: 4
          }}
        >
          Here are all the workshops you have created. Thanks for your continuous effort!
        </Typography>
      </Box>

      <Stack spacing={2}>
        {workshops.map((item) => (
          <WorkshopItemCard
            id={item.id}
            key={item.id}
            item={item}
            userId={userId}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default WorkshopList;

