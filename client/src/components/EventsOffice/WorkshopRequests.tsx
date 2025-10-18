"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "./WorkshopItemCard";
import { EventType } from "../BrowseEvents/browse-events";
import { api } from "@/api";
import { frameData } from "../BrowseEvents/utils";
import { Workshop } from "./WorkshopDetails";

const demoData: any[] = [
  {
    id: "demo1",
    type: EventType.WORKSHOP,
    name: 'Advanced Machine Learning Workshop',
    description: 'An intensive 3-day workshop covering advanced machine learning techniques, deep learning frameworks, and practical applications in industry.',
    agenda: `Day 1: Introduction to Deep Learning
  - 09:00-10:30: Neural Networks Fundamentals
  - 10:45-12:30: Convolutional Neural Networks
  - 14:00-17:00: Hands-on Lab Session
  
  Day 2: Advanced Architectures
  - 09:00-10:30: Recurrent Neural Networks & LSTMs
  - 10:45-12:30: Transformer Models
  - 14:00-17:00: Project Work
  
  Day 3: Industry Applications
  - 09:00-10:30: Computer Vision Applications
  - 10:45-12:30: NLP Applications
  - 14:00-17:00: Final Project Presentations`,
  professors:[ 'Dr. Sarah Ahmed',' Dr. Mohamed Ali', 'Prof. John Smith'],
    details: {
      "Start Date": '2024-11-15',
      "End Date": '2024-11-17',
      "Start Time": '09:00',
      "End Time": '17:00',
      Location: 'GUC Cairo',
      "Faculty Responsible": 'MET',
      "Required Budget": '50,000 EGP',
      "Funding Source": 'External',
      "Extra Required Resources": 'High-performance computing lab, GPU workstations (10 units), Cloud computing credits',
      Capacity: '30',
      "Registration Deadline": '2024-10-30'
    }
  },
    {
      id: "demo2",
      type: EventType.WORKSHOP,
      name: 'Advanced Machine Learning Workshop',
      description: 'An intensive 3-day workshop covering advanced machine learning techniques, deep learning frameworks, and practical applications in industry.',
      agenda: `Day 1: Introduction to Deep Learning
    - 09:00-10:30: Neural Networks Fundamentals
    - 10:45-12:30: Convolutional Neural Networks
    - 14:00-17:00: Hands-on Lab Session
    
    Day 2: Advanced Architectures
    - 09:00-10:30: Recurrent Neural Networks & LSTMs
    - 10:45-12:30: Transformer Models
    - 14:00-17:00: Project Work
    
    Day 3: Industry Applications
    - 09:00-10:30: Computer Vision Applications
    - 10:45-12:30: NLP Applications
    - 14:00-17:00: Final Project Presentations`,
    professors:[ 'Dr. Sarah Ahmed',' Dr. Mohamed Ali', 'Prof. John Smith'],
      details: {
        "Start Date": '2024-11-15',
        "End Date": '2024-11-17',
        "Start Time": '09:00',
        "End Time": '17:00',
        Location: 'GUC Cairo',
        "Faculty Responsible": 'MET',
        "Required Budget": '50,000 EGP',
        "Funding Source": 'External',
        "Extra Required Resources": 'High-performance computing lab, GPU workstations (10 units), Cloud computing credits',
        Capacity: '30',
        "Registration Deadline": '2024-10-30'
      }
    },
];

interface WorkshopRequestsProps {
  setEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  setSpecificWorkshop: React.Dispatch<React.SetStateAction<Workshop>>;
}

const WorkshopRequests: React.FC<WorkshopRequestsProps> = ({
  setEvaluating,
  setSpecificWorkshop,
}) =>  {
   const [requests, setRequests] = useState(demoData);
   useEffect(() => {
    handleCallAPI()
  }, []); 
  // Handle event deletion

  async function handleCallAPI (){
    try{
      const res = await api.get(`/events/workshops`);
      const data = res.data.data;
      const result = frameData(data);
      setRequests(result);
      console.log(data);
      }
    catch(err){
      console.error(err);
    }
 
  };
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
        {requests.map((item) => (
          <WorkshopItemCard
            id={item.id}  
            key={item.id}
            item={item}
            rightSlot={
              <CustomButton
                size="small"
                variant="contained"
                color="tertiary"
                onClick={() => {setEvaluating(true); setSpecificWorkshop(item)}}
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