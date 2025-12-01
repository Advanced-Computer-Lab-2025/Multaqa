"use client";

import React, { useEffect, useState } from "react";
import { Box, Stack, Chip, IconButton, Tooltip } from "@mui/material";
import LoadingBlocks from "@/components/shared/LoadingBlocks";
import WorkshopItemCard from "@/components/EventsOffice/WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "@/components/BrowseEvents/utils";
import { WorkshopViewProps } from "@/components/Event/types";
import EventIcon from "@mui/icons-material/Event";
import CreationHubDropdown from "@/components/createButton/CreationHubDropdown";
import { EditIcon, TruckElectric } from "lucide-react";
import { color } from "storybook/internal/theming";
import CreateWorkshop from "@/components/tempPages/CreateWorkshop/CreateWorkshop";
import EditWorkshop from "@/components/tempPages/EditWorkshop/EditWorkshop";
import WorkshopView from "@/components/Event/WorkshopView";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { EventCardsListSkeleton } from "@/components/BrowseEvents/utils/EventCardSkeleton";
import CustomButton from "../Buttons/CustomButton";
import { CustomModalLayout } from "../modals";
import CommentsModal from "./CommentsModal";
import CommentsList from "./CommentsModal";
import ContentWrapper from "../containers/ContentWrapper";
import EmptyState from "../states/EmptyState";

interface CommentItem {
  commenter: string;
  name: string;
  text: string;
  timestamp: string;
}

interface WorkshopListProps {
  userId: string;
  filter: string;
  userInfo: any;
}
const mockComments = [
  {
    id: 1,
    commenter: "Dr. Sarah Johnson",
    text: "Please provide more details about the technical requirements.",
    timestamp: "2025-01-15T10:30:00Z",
  },
  {
    id: 2,
    commenter: "Events Office Admin",
    text: "The budget seems reasonable.",
    timestamp: "2025-01-16T14:22:00Z",
  },
];

const background = "#9c27b0";

const WorkshopList: React.FC<WorkshopListProps> = ({
  userId,
  filter,
  userInfo,
}) => {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [creation, setCreation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rawWorkshops, setRawWorkshops] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [commentModal, setCommentModal] = useState<boolean>(false);
  const [selectedWorkshopComments, setSelectedWorkshopComments] = useState<any[]>([]);
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);

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
    { label: "All", value: "all", color: "#6299d0" },
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
      const matchesFilter =
        selectedFilter === "all" || item.details["Status"] === selectedFilter;
      const isNotEmpty = item && item.id && item.name;
      return matchesFilter && isNotEmpty;
    });

    setWorkshops(filteredResults);
    setRawWorkshops(result);
    setLoading(false);
  }, [userInfo, selectedFilter, refreshToggle]);

  const handleViewComments = (comments: CommentItem[]) => {
    setSelectedWorkshopComments(comments || []);
    setCommentModal(true);
  };

  return (
    <ContentWrapper
      title="Your Workshops"
      description="Here are all the workshops you have created. Thanks for your continuous effort!"
    >
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
            size="medium"
            sx={{
              color: option.color,
              borderWidth: selectedFilter === option.value ? 2 : 1,
              borderColor: option.color,
              fontWeight: selectedFilter === option.value ? 600 : 500,
              fontSize: "0.875rem",
              px: 2,
              py: 0.5,
              height: "28px",
              transition: "all 0.1s ease",
              cursor: "pointer",
              "&:hover": {
                color: option.color,
                borderWidth: 2,
              },
            }}
          />
        ))}
      </Box>

      <Stack spacing={2}>
        {workshops &&
          workshops.length > 0 &&
          workshops.map((item, index) => (
            <React.Fragment key={item.id}>
              <WorkshopView
                id={item.id}
                attendees={item.attendees}
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
                commentButton={
                  <CustomButton
                    size="small"
                    variant="contained"
                    sx={{
                      borderRadius: 999,
                      border: `1px solid ${background}`,
                      backgroundColor: `${background}`,
                      color: background,
                      fontWeight: 600,
                      px: 3,
                      textTransform: "none",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                      width: "fit-content",
                    }}
                    onClick={() => handleViewComments(item.comments)}
                  >
                    View Comments
                  </CustomButton>
                }
              />
            </React.Fragment>
          ))}

        {loading && <EventCardsListSkeleton />}
        {!loading && (!workshops || workshops.length === 0) && (
          <EmptyState
            title="No workshops to view"
            description="Create your first workshop and spread some knowledge!"
          />
        )}
      </Stack>
      <CustomModalLayout
        open={commentModal}
        title="Events Office Comments"
        onClose={() => setCommentModal(false)}
      >
        <CommentsList comments={selectedWorkshopComments} />
      </CustomModalLayout>
      <CreateWorkshop
        professors={[]}
        creatingProfessor={userId}
        open={creation}
        onClose={() => {
          setCreation(false);
        }}
        setRefresh={setRefreshToggle}
      />
    </ContentWrapper>
  );
};

export default WorkshopList;
