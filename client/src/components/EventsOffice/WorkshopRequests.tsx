"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "./WorkshopItemCard";
import { EventType } from "../BrowseEvents/browse-events";
import { api } from "@/api";
import { frameData } from "../BrowseEvents/utils";
import { WorkshopViewProps } from "../Event/types";

// export interface Workshop {
//   id: string;
//   type: EventType;
//   name: string;
//   description: string;
//   agenda: string;
//   professors: string[];
//   details: {
//     [key: string]: string; // or more specific if needed
//   };
// }

interface WorkshopRequestsProps {
  setEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  setSpecificWorkshop: React.Dispatch<React.SetStateAction<WorkshopViewProps | undefined>>;
}

const WorkshopRequests: React.FC<WorkshopRequestsProps> = ({
  setEvaluating,
  setSpecificWorkshop,
}) =>  {
  const [requests, setRequests] = useState<WorkshopViewProps[]>([]);
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