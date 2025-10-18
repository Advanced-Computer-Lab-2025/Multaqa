"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "@/components/BrowseEvents/utils";
import { WorkshopViewProps } from "@/components/Event/types";


const statusChip = (status: string) => {
  if (status === "pending") return <Chip size="small" label="Pending" color="warning" variant="outlined" />;
  if (status === "rejected") return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
  return <Chip size="small" label="Accepted" color="success" variant="outlined" />;
};


interface WorkshopListProps {
  userId: string;
  filter:string,
}

const WorkshopList: React.FC<WorkshopListProps> = ({ userId, filter }) => {
  const [workshops, setWorkshops] = useState<WorkshopViewProps[]>();
  useEffect(() => {
    handleCallAPI()
  }, []); 
  // Handle event deletion

  async function handleCallAPI (){
    try{
      const res = await api.get(`/users/${userId}`);
      const data = res.data.data.myWorkshops;
      const result = frameData(data);
      console.log(result);
      setWorkshops(result);
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
      {workshops &&
        workshops
          .filter((item) => filter === "none" || item.details["Status"] === filter)
          .map((item) => (
            <WorkshopItemCard
              id={item.id}
              key={item.id}
              item={item}
              userId={userId}
              rightSlot={
                <Stack direction="row" spacing={1} alignItems="center">
                  {statusChip(item.details["Status"])}
                </Stack>
              }
          />
        ))}
      </Stack>
    </Box>
  );
};

export default WorkshopList;

