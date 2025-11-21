"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, IconButton, Tooltip } from "@mui/material";
import theme from "@/themes/lightTheme";
import LoadingBlocks from "@/components/shared/LoadingBlocks";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "@/components/BrowseEvents/utils";
import { WorkshopViewProps } from "@/components/Event/types";
import EventIcon from '@mui/icons-material/Event';
import CreationHubDropdown from "@/components/createButton/CreationHubDropdown";
import { EditIcon, TruckElectric } from "lucide-react";
import { color } from "storybook/internal/theming";
import CreateWorkshop from "@/components/tempPages/CreateWorkshop/CreateWorkshop";
import EditWorkshop from "@/components/tempPages/EditWorkshop/EditWorkshop";
import WorkshopView from "@/components/Event/WorkshopView";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { EventCardsListSkeleton } from "@/components/BrowseEvents/utils/EventCardSkeleton";

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
  const [rawWorkshops, setRawWorkshops] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const creationHubOptions = [
    {
      label: "Workshop",
      icon: EventIcon,
      color: "#9c27b0",
      description: "Schedule a new workshop session",
      onSelect: () => setCreation(true),
    },
  ];

  const filterOptions = [
    { label: "All", value: "all", color: "#6b7280" },
    { label: "Accepted", value: "approved", color: "#10b981" },
    { label: "Pending", value: "pending", color: "#f59e0b" },
    { label: "Awaiting Review", value: "awaiting_review", color: "#3b82f6" },
    { label: "Rejected", value: "rejected", color: "#ef4444" },
  ];

  useEffect(() => {
    setLoading(true);
    const data = userInfo.myWorkshops;
    const result = frameData(data, userInfo);
    
    // Filter based on selectedFilter
    const filteredResults = result.filter((item) => {
      const matchesFilter = selectedFilter === "all" || item.details["Status"] === selectedFilter;
      const isNotEmpty = item && item.id && item.name;
      return matchesFilter && isNotEmpty;
    });
    
    setWorkshops(filteredResults);
    setRawWorkshops(result);
    setLoading(false);
  }, [userInfo, selectedFilter]);


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

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <CreationHubDropdown
          options={creationHubOptions}
          helperText="Start something new"
        />
      </Box>

      {/* Filter Pills */}
      <Box sx={{ mb: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        {filterOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            onClick={() => setSelectedFilter(option.value)}
            variant="outlined"
            sx={{
              color: option.color,
              letterSpacing: 0.2,
              borderWidth:selectedFilter === option.value ? 3 : 2,
              borderColor: selectedFilter === option.value ? option.color : "#e5e7eb",
              fontWeight: selectedFilter === option.value ? 600 : 500,
              fontSize: "0.875rem",
              px: 2,
              py: 0.5,
              height: "28px",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                color: option.color,
                borderWidth:2,
              },
            }}
          />
        ))}
      </Box>

      <Stack spacing={2}>
        {workshops && workshops.length > 0 &&
          workshops.map((item, index) => (
            <React.Fragment key={item.id}>
              <WorkshopView 
                id={item.id}
                background={"#9c27b0"}
                icon={Diversity3Icon}
                key={item.id}
                details={item.details}
                name={item.name}
                description={item.description}
                professorsId={item.professorsId}
                professors={item.professors}
                agenda={item.agenda}
                user={"professor"}
                registered={true}
                userInfo={userInfo}
                datePassed={true}
                professorStatus={item.details["Status"]}
              />
              
              <EditWorkshop
                workshopId={item.id}  
                open={editingWorkshopId === item.id} 
                workshopName={item.name}
                budget={parseInt(item.details["Required Budget"], 10)}
                capacity={parseInt(item.details.Capacity, 10)}  
                startDate={new Date(item.details["Start Date"])} 
                endDate={new Date(item.details["End Date"])} 
                registrationDeadline={new Date(item.details["Registration Deadline"])}
                description={item.description}
                agenda={item.agenda}
                location={item.details.Location}
                fundingSource={item.details["Funding Source"]} 
                creatingProfessor={item.details["Created By"]}
                faculty={item.details["Faculty Responsible"]} 
                extraResources={item.details["Extra Required Resources"]}
                associatedProfs={rawWorkshops[index].associatedProfs}
                onClose={() => { setEditingWorkshopId(null); window.location.reload(); }} 
              />
            </React.Fragment>
          ))}

        {loading && <EventCardsListSkeleton />}
        {!loading &&(!workshops || workshops.length === 0) &&
          <Box
            sx={{
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
            }}
          >
            No workshops to view here!
          </Box>
        }
      </Stack>
      <CreateWorkshop 
        professors={[]} 
        creatingProfessor={userId} 
        open={creation} 
        onClose={() => { setCreation(false); window.location.reload(); }}
      />
    </Box>
  );
};

export default WorkshopList;