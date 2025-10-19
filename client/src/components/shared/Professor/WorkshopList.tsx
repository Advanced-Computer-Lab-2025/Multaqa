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

const statusChip = (status: string) => {
  if (status === "pending") return <Chip size="small" label="Pending" color="warning" variant="outlined" />;
  if (status === "awaiting_review") return <Chip size="small" label="Awaiting Review" color="info" variant="outlined" />;
  if (status === "rejected") return <Chip size="small" label="Rejected" color="error" variant="outlined" />;
  return <Chip size="small" label="Accepted" color="success" variant="outlined" />;
};

const Workshop = [
  { label: 'Workshop', icon: EventIcon},
];


interface WorkshopListProps {
  userId: string;
  filter:string,
}

const WorkshopList: React.FC<WorkshopListProps> = ({ userId, filter }) => {
  const [workshops, setWorkshops] = useState<WorkshopViewProps[]>();
  const[rawWorkshops, setRawWorkshops] = useState<any []>([]);
  const [refresh, setRefresh] = useState(false);
  const [creation, setCreation] = useState(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    handleCallAPI()
  }, [refresh]); 
  // Handle event deletion

  const WorkshopSetter = [
   setCreation
  ];
  
  async function handleCallAPI (){
    try{
      const res = await api.get(`/users/${userId}`);
      const data = res.data.data.myWorkshops;
      const result = frameData(data);
      console.log(data)
      setWorkshops(result);
      setRawWorkshops(data)
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
      <CreateParent options={Workshop} setters={WorkshopSetter}/>
      <Stack spacing={2} mt={4}>
      {workshops &&
        workshops
          .filter((item) => filter === "none" || item.details["Status"] === filter)
          .map((item, index) => (
            <>
            <WorkshopItemCard
              id={item.id}
              key={item.id}
              item={item}
              userId={userId}
              rightIcon={
                (item.details["Status"] === "pending" || item.details["Status"] === "awaiting_review") && (
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => setEdit(true)}
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
            key={index}
            workshopId={item.id}  
            open={edit} 
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
            extraResources={item.details["Extra Required Resources"]}
            associatedProfs={rawWorkshops[index].associatedProfs}
            onClose={()=>{setEdit(false)}} 
            setRefresh={setRefresh}/>
          </>
        ))}
      </Stack>
      <CreateWorkshop professors={[]} creatingProfessor={userId} open={creation} onClose={()=>{setCreation(false)}} setRefresh={setRefresh}/>
    </Box>
  );
};

export default WorkshopList;

