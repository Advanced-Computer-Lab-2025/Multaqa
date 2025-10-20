"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, IconButton, Tooltip } from "@mui/material";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "@/components/BrowseEvents/utils";
import { WorkshopViewProps } from "@/components/Event/types";
import EventIcon from '@mui/icons-material/Event';
import CreateParent from "@/components/createButton/createParent";
import { EditIcon } from "lucide-react";
import { color } from "storybook/internal/theming";
import CreateWorkshop from "@/components/tempPages/CreateWorkshop/CreateWorkshop";
import EditWorkshop from "@/components/tempPages/EditWorkshop/EditWorkshop";
import { create } from "domain";
import { V } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

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
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(null);
  const [creation, setCreation] = useState(false);
  const [loading, setLoading] = useState(true);
  const WorkshopSetter = [
    setCreation
   ];
   const Workshop = [
    { label: 'Workshop', icon: EventIcon},
  ];
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
      <CreateParent options={Workshop} setters={WorkshopSetter}/>
      <Stack spacing={2}>
        {
        workshops && workshops.length>0&&
              workshops.map((item) => (
             <React.Fragment key={item.id}>
            <WorkshopItemCard
              id={item.id}
              item={item}
              userId={userId}
              rightIcon={
                (item.details["Status"] === "pending" || item.details["Status"] === "awaiting_review") && (
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => setEditingWorkshopId(item.id)}
                      sx={{
                        color,
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              }
              rightSlot={
                <Stack direction="row" spacing={1} alignItems="center">
                  {statusChip(item.details["Status"])}
                </Stack>
              }
          />
          <EditWorkshop
            workshopId={item.id}  
            open={editingWorkshopId === item.id} 
            workshopName={item.name}
            budget={parseInt(item.details["Required Budget"],10)}
            capacity={parseInt(item.details.Capacity,10)}  
            startDate={new Date(item.details["Start Date"])} 
            endDate={new Date(item.details["End Date"])} 
            registrationDeadline={new Date(item.details["Registration Deadline"])}
            description={item.description}
            agenda={item.agenda}
            location={item.details.Location}
            fundingSource={item.details["Funding Source"]} 
            creatingProfessor={item.details["Created By"]} 
            // extraResources={item.details["Extra Required Resources"]}
            // associatedProfs={rawWorkshops[index].associatedProfs}
            onClose={(() => {setEditingWorkshopId(null); window.location.reload();})} 
            // setRefresh={setRefresh}
          />
          </React.Fragment>
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
      <CreateWorkshop professors={[]} creatingProfessor={userId} open={creation} onClose={()=>{setCreation(false); window.location.reload();}}/>
    </Box>
  );
};

export default WorkshopList;
