"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "@/components/BrowseEvents/utils";
import { WorkshopViewProps } from "@/components/Event/types";

const statusChip = (status: string) => {
  if (status === "pending")
    return <Chip size="small" label="Pending" color="warning" variant="outlined" />;
  if (status === "awaiting_review")
    return <Chip size="small" label="Awaiting Review" color="info" variant="outlined" />;
  if (status === "rejected")
    return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
  if (status === "approved")
  return <Chip size="small" label="Accepted" color="success" variant="outlined" />;
};

interface WorkshopListProps {
  userId: string;
  filter: string;
  userInfo: any;
}

const WorkshopList: React.FC<WorkshopListProps> = ({ userId, filter, userInfo }) => {
  const [workshops, setWorkshops] = useState<WorkshopViewProps[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(workshops);

  useEffect(() => {
    setLoading(true);
    const data = userInfo.myWorkshops;
    const result = frameData(data);
    const filteredResults = result.filter((item) => filter === "none" || item.details["Status"] === filter)
    setWorkshops(filteredResults);
    setLoading(false);
  }, [userInfo]);

  // ✅ Conditional rendering based on loading state
  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </Box>
    );
  }

  // ✅ Main content when not loading
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            mb: 2,
            textAlign: "left",
            fontFamily: "var(--font-jost), system-ui, sans-serif",
            color: theme.palette.tertiary.dark,
          }}
        >
          Your Workshops
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#757575",
            fontFamily: "var(--font-poppins)",
            mb: 4,
          }}
        >
          Here are all the workshops you have created. Thanks for your continuous effort!
        </Typography>
      </Box>

      <Stack spacing={2}>
     
        {
        workshops && workshops.length>0&&
              workshops.map((item) => (
              <WorkshopItemCard
                id={item.id}
                key={item.id}
                item={item}
                userId={userId}
                rightIcon={
                  <Stack direction="row" spacing={1} alignItems="center">
                    {statusChip(item.details["Status"])}
                  </Stack>
                }
              />
            ))}
            {(!workshops || workshops.length==0)&&
              <Box
              sx={{
                height: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "1.2rem",
              }}
            >
              No Requests to view here!
            </Box>
            }
      </Stack>
    </Box>
  );
};

export default WorkshopList;
