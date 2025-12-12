"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Chip, alpha } from "@mui/material";
import CustomButton from "@/components/shared/Buttons/CustomButton";
import theme from "@/themes/lightTheme";
import WorkshopItemCard from "./WorkshopItemCard";
import { api } from "@/api";
import { frameData } from "../BrowseEvents/utils";
import { WorkshopViewProps } from "../Event/types";
import WorkshopView from "../Event/WorkshopView";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import { EventCardsListSkeleton } from "../BrowseEvents/utils/EventCardSkeleton";
import { CustomModalLayout } from "../shared/modals";
import CommentsList from "../shared/Professor/CommentsModal";
import EmptyState from "../shared/states/EmptyState";

interface WorkshopRequestsProps {
  setEvaluating: React.Dispatch<React.SetStateAction<boolean>>;
  setSpecificWorkshop: React.Dispatch<
    React.SetStateAction<WorkshopViewProps | undefined>
  >;
  evaluate: boolean;
  filter: string;
}

interface CommentItem {
  commenter: string;
  name: string;
  text: string;
  timestamp: string;
}

const statusChip = (status: string) => {
  if (status === "pending")
    return (
      <Chip size="small" label="Pending" color="warning" variant="outlined" />
    );
  if (status === "awaiting_review")
    return (
      <Chip
        size="small"
        label="Awaiting Review"
        color="info"
        variant="outlined"
      />
    );
  if (status === "rejected")
    return (
      <Chip size="small" label="Rejected" color="error" variant="outlined" />
    );
  return (
    <Chip size="small" label="Accepted" color="success" variant="outlined" />
  );
};

const WorkshopRequests: React.FC<WorkshopRequestsProps> = ({
  setEvaluating,
  setSpecificWorkshop,
  evaluate,
  filter,
}) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [commentModal, setCommentModal] = useState<boolean>(false);
  const [selectedWorkshopComments, setSelectedWorkshopComments] = useState<
    any[]
  >([]);

  useEffect(() => {
    handleCallAPI();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [selectedFilter, requests]); // 💡 Added 'requests' to dependencies to re-filter after load

  async function handleCallAPI() {
    try {
      setLoading(true);
      const res = await api.get(`/events/workshops`);
      const data = res.data.data;
      const result = frameData(data, null);

      // 💡 NEW: Sort the framed data before saving to state
      const sortedResult = sortWorkshops(result);

      setRequests(sortedResult);
      setFilteredRequests(sortedResult); // Set initial filtered list to sorted result
      console.log(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleViewComments = (comments: CommentItem[]) => {
    setSelectedWorkshopComments(comments || []);
    setCommentModal(true);
  };
  // 💡 NEW: Custom sorting logic to put 'pending' workshops first
  const sortWorkshops = (
    workshops: WorkshopViewProps[]
  ): WorkshopViewProps[] => {
    // Create a mutable copy to sort
    return [...workshops].sort((a, b) => {
      const statusA = a.details["Status"];
      const statusB = b.details["Status"];

      // Check for 'pending' status
      const isAPending = statusA === "pending";
      const isBPending = statusB === "pending";

      if (isAPending && !isBPending) {
        return -1; // A (pending) comes before B
      }
      if (!isAPending && isBPending) {
        return 1; // B (pending) comes before A
      }

      // Secondary sort (e.g., sort by name or submission date, here we do no secondary sort)
      return 0;
    });
  };

  const filterOptions = [
    { label: "All", value: "all", color: "#6299d0" },
    { label: "Accepted", value: "approved", color: "#10b981" },
    { label: "Pending", value: "pending", color: "#f59e0b" },
    { label: "Awaiting Review", value: "awaiting_review", color: "#3b82f6" },
    { label: "Rejected", value: "rejected", color: "#ef4444" },
  ];
  const background = "#9c27b0";

  function filterWorkshops() {
    // Filter based on selectedFilter, using the sorted 'requests' state as the source
    const filteredResults = requests.filter((item) => {
      const matchesFilter =
        selectedFilter === "all" || item.details["Status"] === selectedFilter;
      const isNotEmpty = item && item.id && item.name;
      return matchesFilter && isNotEmpty;
    });
    setFilteredRequests(filteredResults);
  }
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
            color: `${theme.palette.tertiary.dark}`,
          }}
        >
          Workshop Requests
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#757575", fontFamily: "var(--font-poppins)", mb: 4 }}
        >
          Here are all workshop requests. Make sure to evaluate wisely.
        </Typography>
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
        {filteredRequests &&
          filteredRequests.length > 0 &&
          filteredRequests.map((item) => (
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
                user={"events-office"}
                registered={true}
                datePassed={true}
                professorStatus={item.details["Status"]}
                attendees={item.attendees}
                waitlist={item.waitlist}
                isFull={
                  (item.attendees?.length || 0) +
                    (item.waitlist?.filter(
                      (w: any) => w.status === "pending_payment"
                    ).length || 0) >=
                  Number(item.details.Capacity)
                }
                evaluateButton={
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
                    }}
                    onClick={() => {
                      setEvaluating(true);
                      setSpecificWorkshop(item);
                    }}
                  >
                    Evaluate
                  </CustomButton>
                }
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
        {!loading && (!filteredRequests || filteredRequests.length === 0) && (
          <EmptyState title="No workshops to view" />
        )}
      </Stack>
      <CustomModalLayout
        open={commentModal}
        title="Events Office Comments"
        onClose={() => setCommentModal(false)}
      >
        <CommentsList comments={selectedWorkshopComments} />
      </CustomModalLayout>
    </Box>
  );
};

export default WorkshopRequests;
